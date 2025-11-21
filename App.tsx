import React, { useState, useEffect, useRef } from 'react';
import { Todo, FilterType, Subtask } from './types';
import { TodoItem } from './components/TodoItem';
import { Button } from './components/Button';
import { suggestSubtasks } from './services/geminiService';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('smartdo-todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('smartdo-todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now(),
      imageUrl: selectedImage || undefined,
      subtasks: []
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSubtasks = async (id: string, text: string) => {
    const subtaskTexts = await suggestSubtasks(text);
    if (subtaskTexts.length > 0) {
        const newSubtasks: Subtask[] = subtaskTexts.map(st => ({
            id: crypto.randomUUID(),
            text: st,
            completed: false
        }));
        setTodos(prev => prev.map(t => t.id === id ? { ...t, subtasks: [...t.subtasks, ...newSubtasks] } : t));
    }
  };

  const handleAddSubtask = (todoId: string, text: string) => {
      const newSubtask: Subtask = {
          id: crypto.randomUUID(),
          text,
          completed: false
      };
      setTodos(todos.map(t => t.id === todoId ? {...t, subtasks: [...t.subtasks, newSubtask]} : t));
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
      setTodos(todos.map(t => {
          if (t.id !== todoId) return t;
          return {
              ...t,
              subtasks: t.subtasks.map(st => st.id === subtaskId ? {...st, completed: !st.completed} : st)
          };
      }));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.ACTIVE) return !todo.completed;
    if (filter === FilterType.COMPLETED) return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  // Map filter types to Chinese labels
  const filterLabels: Record<FilterType, string> = {
    [FilterType.ALL]: '全部',
    [FilterType.ACTIVE]: '进行中',
    [FilterType.COMPLETED]: '已完成'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
             </div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                SmartDo 智能待办
             </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
             {activeCount} 个待办
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Add Todo Input */}
        <div className="bg-white p-4 rounded-2xl shadow-lg shadow-indigo-100/50 border border-indigo-50 mb-8">
          <form onSubmit={handleAddTodo} className="flex flex-col gap-4">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="准备做点什么？"
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-lg"
                />
                 {/* File Upload Trigger */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${selectedImage ? 'text-indigo-600' : 'text-gray-400'}`}
                    title="上传图片"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                />
            </div>
            
            {selectedImage && (
                <div className="relative inline-block w-fit group">
                    <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                    <button 
                        type="button"
                        onClick={() => {
                            setSelectedImage(null);
                            if(fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 transition-colors"
                        title="移除图片"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center">
                 {/* Helpful Tip */}
                 <div className="hidden sm:flex text-xs text-gray-400 items-center gap-1.5">
                    <span className="bg-indigo-50 text-indigo-600 p-1 rounded">💡 提示</span>
                    <span>添加任务后，点击任务旁的 <span className="font-bold">✨</span> 可自动拆解步骤。</span>
                </div>

                <Button type="submit" disabled={!inputValue.trim()} className="ml-auto">
                    添加任务
                </Button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[FilterType.ALL, FilterType.ACTIVE, FilterType.COMPLETED].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === t 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filterLabels[t]}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">暂无任务</p>
                <p className="text-gray-400 text-sm mt-1">添加一个新的任务开始高效的一天吧！</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={handleToggleTodo} 
                onDelete={handleDeleteTodo}
                onAddSubtask={handleAddSubtask}
                onToggleSubtask={handleToggleSubtask}
                onGenerateSubtasks={handleGenerateSubtasks}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;