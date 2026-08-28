import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Sparkles,
  ArrowRight,
  Tag,
  Search,
  CheckSquare,
  X,
  Edit3,
} from 'lucide-react';
import { Note, Task, Project } from '../types';

interface NotesViewProps {
  notes: Note[];
  projects: Project[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onConvertNoteToTask: (note: Note) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  projects,
  onSaveNote,
  onDeleteNote,
  onConvertNoteToTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'Untitled Scratchpad',
      content: '',
      tags: ['quick-thought'],
      isPinned: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSaveNote(newNote);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleTogglePin = (note: Note) => {
    const updated = { ...note, isPinned: !note.isPinned };
    onSaveNote(updated);
    if (selectedNote?.id === note.id) setSelectedNote(updated);
  };

  const handleUpdateCurrentNote = (fields: Partial<Note>) => {
    if (!selectedNote) return;
    const updated = {
      ...selectedNote,
      ...fields,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setSelectedNote(updated);
    onSaveNote(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notes & Brainstorm</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture raw thoughts, meeting summaries, and convert ideas into executable tasks.
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[550px]">
        {/* Notes Sidebar List (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Notes Cards List */}
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No notes found.</div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{note.title}</h4>
                      {note.isPinned && <Pin className="w-3 h-3 text-indigo-600 fill-indigo-600 shrink-0" />}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {note.content || 'Empty note...'}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{note.updatedAt}</span>
                      <div className="flex items-center gap-1">
                        {note.tags.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Note Editor / Reader (8 cols) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Note Header Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateCurrentNote({ title: e.target.value })}
                  placeholder="Note Title"
                  className="font-extrabold text-lg text-slate-900 focus:outline-none w-full bg-transparent"
                />

                <div className="flex items-center gap-2 shrink-0">
                  {/* Convert to Task Button */}
                  <button
                    onClick={() => onConvertNoteToTask(selectedNote)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Turn this note into an actionable task"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Convert to Task</span>
                  </button>

                  {/* Pin Toggle */}
                  <button
                    onClick={() => handleTogglePin(selectedNote)}
                    className={`p-2 rounded-xl border transition-colors ${
                      selectedNote.isPinned
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={selectedNote.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Note */}
                  <button
                    onClick={() => {
                      onDeleteNote(selectedNote.id);
                      setSelectedNote(notes.find((n) => n.id !== selectedNote.id) || null);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content Textarea */}
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateCurrentNote({ content: e.target.value })}
                placeholder="Start writing ideas, meeting notes, action items, or outlines..."
                className="flex-1 w-full p-2 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none resize-none bg-transparent"
                rows={14}
              />

              {/* Tags Editor */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={selectedNote.tags.join(', ')}
                  onChange={(e) =>
                    handleUpdateCurrentNote({
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Tags (separated by comma e.g. marketing, idea, q3)"
                  className="text-xs text-slate-600 focus:outline-none flex-1"
                />
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-700 text-sm">No Note Selected</h3>
              <p className="text-xs text-slate-400 mt-1">Select a note on the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
