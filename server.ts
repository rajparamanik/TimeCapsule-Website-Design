import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== "" && apiKey !== "MY_GEMINI_API_KEY") {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini generateContent caller with candidate models & exponential backoff
const CANDIDATE_MODELS = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

async function generateGeminiContentWithFallback(ai: GoogleGenAI, baseConfig: any) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    // Attempt up to 2 tries per model if 503 or transient
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...baseConfig,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || err?.statusCode || (err?.error && err.error.code);
        const msg = String(err?.message || (err?.error && err.error.message) || "");
        const isTemporary =
          status === 503 ||
          status === 429 ||
          status === 500 ||
          msg.includes("high demand") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("temporarily unavailable") ||
          msg.includes("Resource has been exhausted");

        if (isTemporary) {
          if (attempt === 0) {
            // Short backoff before trying next attempt/model
            await new Promise((resolve) => setTimeout(resolve, 350));
            continue;
          }
          // On second fail for this model, break to try next candidate model
          break;
        } else {
          // Non-transient error (e.g. bad schema/config), rethrow or break
          break;
        }
      }
    }
  }

  throw lastError;
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// API: AI Task Natural Language Parser
app.post("/api/ai/parse-task", async (req, res) => {
  const { input, projects = [] } = req.body;
  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Missing input text" });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemPrompt = `You are a smart productivity task parser for Time Capsule. Extract task details from the user's natural language input. Today's date is ${new Date().toISOString().split('T')[0]}.
Known project names: ${projects.map((p: any) => p.name || p.title).join(", ") || "None"}.
Respond in strict JSON with:
- title (string, clean concise action title)
- description (string, extra details if any, otherwise empty)
- priority ("low" | "medium" | "high" | "urgent")
- dueDate (ISO date string YYYY-MM-DD or YYYY-MM-DDTHH:mm if time mentioned, or null)
- estimatedMinutes (number in minutes, default 30 if not mentioned)
- tags (array of strings, e.g. ["client", "urgent", "review"])
- projectId (string or null matching any project names if mentioned)`;

      const response = await generateGeminiContentWithFallback(ai, {
        contents: `Parse this natural language task: "${input}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              estimatedMinutes: { type: Type.NUMBER },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              projectName: { type: Type.STRING },
            },
            required: ["title", "priority"],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({ success: true, task: parsed });
      }
    } catch (err: any) {
      console.warn("AI parse-task falling back to rule-based parser:", err?.message || err);
    }
  }

  // Heuristic rule-based fallback parser
  const text = input.trim();
  let priority = "medium";
  if (/\b(urgent|asap|critical|emergency|p0)\b/i.test(text)) priority = "urgent";
  else if (/\b(high|important|priority|p1)\b/i.test(text)) priority = "high";
  else if (/\b(low|whenever|someday|p3)\b/i.test(text)) priority = "low";

  let estimatedMinutes = 30;
  const durationMatch = text.match(/(\d+)\s*(?:min|mins|minute|minutes|h|hr|hrs|hour|hours)/i);
  if (durationMatch) {
    const num = parseInt(durationMatch[1], 10);
    if (/h|hr|hour/i.test(durationMatch[0])) {
      estimatedMinutes = num * 60;
    } else {
      estimatedMinutes = num;
    }
  }

  let dueDate = null;
  const now = new Date();
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    dueDate = d.toISOString().split("T")[0];
  } else if (/\btoday\b/i.test(text)) {
    dueDate = now.toISOString().split("T")[0];
  } else if (/\bnext week\b/i.test(text)) {
    const d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    dueDate = d.toISOString().split("T")[0];
  }

  // Clean title
  let title = text
    .replace(/,\s*(high|medium|low|urgent)\s*priority/i, "")
    .replace(/\b(high|medium|low|urgent)\s*priority\b/i, "")
    .replace(/\b(tomorrow|today|next week)\b(?:\s+at\s+\d+(?::\d+)?\s*(?:am|pm)?)?/i, "")
    .replace(/\b\d+\s*(?:mins|min|minutes|hours|hrs|hour)\b/i, "")
    .trim();

  if (!title) title = text;

  return res.json({
    success: true,
    task: {
      title,
      description: "",
      priority,
      dueDate,
      estimatedMinutes,
      tags: priority === "urgent" ? ["urgent"] : ["quick-capture"],
      projectName: null,
    },
  });
});

// API: AI Priority Assistant Chat
app.post("/api/ai/chat", async (req, res) => {
  const { message, tasks = [], projects = [], history = [] } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message text" });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemPrompt = `You are "Time Capsule", an expert AI Productivity & Priority Assistant.
Your mission is to help users conquer overwhelm, decide what to work on right now, organize their time, and give clear, crisp, actionable advice.
Current local time is ${new Date().toISOString()}.

User's current task list:
${JSON.stringify(
  tasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    estimatedMinutes: t.estimatedMinutes,
    projectName: t.projectName,
  })),
  null,
  2
)}

User's projects:
${JSON.stringify(
  projects.map((p: any) => ({
    id: p.id,
    title: p.title,
    progress: p.progress,
    deadline: p.deadline,
  })),
  null,
  2
)}

Guidelines:
- Give direct, confident recommendations answering "What should I work on first?", "What can I do in 30 mins?", "Plan my day", etc.
- If asked what to work on, specify 1st, 2nd, and 3rd priorities with estimated times and clear rationale.
- Use clean Markdown formatting with bullet points and bold highlights.
- Keep answers actionable, encouraging, and under 250 words unless the user asks for a detailed schedule.`;

      const contents = [
        ...history.slice(-4).map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

      const response = await generateGeminiContentWithFallback(ai, {
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        reply: response?.text || "I've analyzed your workspace. Let's tackle your top urgent priority first!",
      });
    } catch (err: any) {
      console.warn("AI chat falling back to local recommendation engine:", err?.message || err);
    }
  }

  // Intelligent fallback recommendation engine
  const pendingTasks = tasks.filter((t: any) => t.status !== "completed");
  const urgentTasks = pendingTasks.filter((t: any) => t.priority === "urgent" || t.priority === "high");
  const overdueTasks = pendingTasks.filter((t: any) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    return due < now;
  });

  const query = message.toLowerCase();
  let reply = "";

  if (query.includes("overdue")) {
    if (overdueTasks.length > 0) {
      reply = `You have **${overdueTasks.length} overdue task(s)** that need immediate attention:\n\n` +
        overdueTasks.map((t: any, idx: number) => `${idx + 1}. **${t.title}** (Due ${t.dueDate || 'Past'}, ${t.priority} priority)`).join("\n") +
        `\n\n💡 *Recommendation:* Dedicate the next 45 minutes to clearing these so you can regain momentum!`;
    } else {
      reply = `🎉 **Zero overdue tasks!** Your timeline is currently clean. You are ahead of schedule.`;
    }
  } else if (query.includes("30 min") || query.includes("quick") || query.includes("short")) {
    const quickTasks = pendingTasks.filter((t: any) => (t.estimatedMinutes || 30) <= 30);
    if (quickTasks.length > 0) {
      reply = `Here are high-impact tasks you can knock out in **under 30 minutes**:\n\n` +
        quickTasks.slice(0, 3).map((t: any, idx: number) => `${idx + 1}. **${t.title}** (~${t.estimatedMinutes || 25} min) — *${t.projectName || 'General'}*`).join("\n") +
        `\n\n⚡ *Action tip:* Pick one right now and start a 25-minute Pomodoro focus timer!`;
    } else {
      reply = `All your current tasks are larger items. Consider breaking down **${pendingTasks[0]?.title || 'your top task'}** into subtasks!`;
    }
  } else if (query.includes("plan my day") || query.includes("plan")) {
    const topPicks = pendingTasks.slice(0, 4);
    reply = `📅 **Here is your recommended Daily Flow for today:**\n\n` +
      `1. **Morning Deep Focus (9:00 - 10:30 AM):**\n   • **${topPicks[0]?.title || 'Finish key deliverable'}** (${topPicks[0]?.priority || 'High'} priority, ~${topPicks[0]?.estimatedMinutes || 45}m)\n\n` +
      `2. **Mid-Day Execution (11:00 AM - 1:00 PM):**\n   • **${topPicks[1]?.title || 'Team sync & feedback'}** (~${topPicks[1]?.estimatedMinutes || 30}m)\n   • **${topPicks[2]?.title || 'Communication & reviews'}** (~30m)\n\n` +
      `3. **Afternoon Wrap-Up (3:00 - 4:30 PM):**\n   • **${topPicks[3]?.title || 'Admin & planning next sprint'}**\n\n` +
      `💡 *Take a 5-minute break between focus blocks to maintain cognitive stamina.*`;
  } else if (query.includes("project")) {
    reply = `📊 **Project Health Check:**\n\n` +
      projects.map((p: any) => `• **${p.title}**: ${p.progress}% complete (${p.tasksCount || 0} tasks). Deadline: ${p.deadline || 'Flexible'}`).join("\n") +
      `\n\n🎯 **Focus Recommendation:** Direct 60% of today's effort to your closest deadline project.`;
  } else {
    // Default "What should I work on first"
    if (pendingTasks.length === 0) {
      reply = `✨ **Your workspace is clear!** You have completed all scheduled tasks. Capture a new idea or enjoy your focus break.`;
    } else {
      const top1 = urgentTasks[0] || pendingTasks[0];
      const top2 = urgentTasks[1] || pendingTasks[1];
      const top3 = pendingTasks[2];

      reply = `🎯 **Here is what you should work on right now:**\n\n` +
        `1. **Start with:** **${top1.title}**\n   • **Why:** Marked **${top1.priority}** priority${top1.dueDate ? `, due ${top1.dueDate}` : ''}.\n   • **Estimated time:** ${top1.estimatedMinutes || 30} minutes.\n\n` +
        (top2 ? `2. **Next up:** **${top2.title}** (~${top2.estimatedMinutes || 30} mins) to maintain momentum.\n\n` : '') +
        (top3 ? `3. **Later today:** **${top3.title}**.\n\n` : '') +
        `Ready? Launch a **Focus Mode** timer and eliminate all distractions!`;
    }
  }

  return res.json({ success: true, reply });
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Time Capsule server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
