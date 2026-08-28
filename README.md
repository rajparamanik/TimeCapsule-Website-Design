# ⏳ Time Capsule (TC)

**Time Capsule (TC)** is an AI-powered productivity web application designed to help users preserve their time, organize workflows, and eliminate distractions. 

🤖 **Built with AI for AI:** This entire application was developed, architected, and optimized with the assistance of **Google AI Studio (Gemini)**. The platform itself integrates Google AI Studio as its core intelligence engine, acting as a smart co-pilot for managing tasks, projects, and personal analytics.

---

## 🚀 Key Features

*   **TC Time Capsule Dashboard** – A personalized command center displaying your daily focus, upcoming deadlines, and AI-generated productivity summaries.
*   **My Tasks & Projects** – Advanced task tracking with kanban boards, priority tiers, and parent-child task nesting.
*   **Calendar View** – Visual time-blocking and seamless scheduling to align your daily routines with long-term deadlines.
*   **Focus Mode** – A built-in Pomodoro/countdown timer that mutes notifications and tracks deep-work metrics.
*   **Notes & Analytics** – Rich-text note-taking paired with data visualizations that track your focus trends and completion rates.
*   **AI Assistant** – An embedded agent powered by Google AI Studio that breaks down massive projects, drafts schedules, and unblocks your workflows.

---

## 🛠️ Tech Stack & AI Development

*   **Development Assistant:** Google AI Studio / Gemini (Used for code generation, UI/UX structure, and debugging)
*   **Frontend:** [e.g., React / Next.js / Vue.js]
*   **Backend:** [e.g., Node.js (Express) / Python (FastAPI)]
*   **Database:** [e.g., MongoDB / PostgreSQL]
*   **AI Engine Integration:** Google AI Studio (Gemini API)

---

## 🏁 Getting Started

### Prerequisites

Before setting up the project locally, ensure you have installed:
*   [Node.js](https://nodejs.org) (v18+ recommended) or [Python](https://python.org)
*   A Google AI Studio API key (Get one from [Google AI Studio](https://google.com))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com
    cd time-capsule
    ```

2.  **Install dependencies:**
    ```bash
    # If using Node.js/npm
    npm install
    
    # If using Python/pip
    pip install -r requirements.txt
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory and populate it with your credentials:
    ```env
    PORT=3000
    GEMINI_API_KEY=your_google_ai_studio_api_key_here
    DATABASE_URL=your_database_connection_string
    ```

4.  **Run the application locally:**
    ```bash
    # For Node.js frontend/fullstack
    npm run dev
    
    # For Python backend
    uvicorn main:app --reload
    ```

---

## 💡 Usage Example

1.  Navigate to the **Projects** tab and create a new project called "Launch Marketing Campaign."
2.  Open the **AI Assistant** widget and type: *"Break this campaign down into 5 sequential tasks."*
3.  The system will automatically populate your **My Tasks** board and schedule milestones directly onto your **Calendar**.
4.  Trigger **Focus Mode** to block out 25 minutes of deep work to finish your first task.

