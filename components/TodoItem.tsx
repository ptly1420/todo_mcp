import React, { useState } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (id: string, text: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onGenerateSubtasks: (id: string, text: string) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onToggleSubtask,
  onGenerateSubtasks 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    await onGenerateSubtasks(todo.id, todo.text);
    setIsGenerating(false);
    setIsExpanded(true);
  };

  return (
    <div className={`group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <button 
          onClick={() => onToggle(todo.id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 text-transparent hover:border-green-500'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-base font-medium text-gray-800 break-words cursor-pointer select-none ${todo.completed ? 'line-through text-gray-400' : ''}`}
            >
              {todo.text}
            </h3>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 opacity-100">
              <button 
                onClick={handleGenerate} 
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg" 
                title="Auto-generate subtasks with AI"
                disabled={isGenerating || todo.completed}
              >
                {isGenerating ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => onDelete(todo.id)} 
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {todo.imageUrl && (
            <div className="mt-3 relative group rounded-lg overflow-hidden max-w-xs border border-gray-200">
                <img src={todo.imageUrl} alt="Todo attachment" className="w-full h-auto object-cover max-h-48" />
            </div>
          )}

          {(todo.subtasks.length > 0) && (
            <div className={`mt-3 space-y-2 pl-1 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subtasks</p>
              {todo.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center gap-2 text-sm">
                   <button 
                    onClick={() => onToggleSubtask(todo.id, sub.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        sub.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 hover:border-indigo-500'
                    }`}
                   >
                    {sub.completed && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                   </button>
                   <span className={`${sub.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>{sub.text}</span>
                </div>
              ))}
            </div>
          )}
           {(todo.subtasks.length > 0 && !isExpanded) && (
                <button 
                    onClick={() => setIsExpanded(true)}
                    className="mt-2 text-xs text-indigo-500 font-medium hover:text-indigo-600 flex items-center gap-1"
                >
                   View {todo.subtasks.length} subtasks
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
           )}
        </div>
      </div>
    </div>
  );
};