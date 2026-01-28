
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { ManagerId, Message, Attachment, Language, Note, ActiveView } from './types';
import { MANAGERS, TRANSLATIONS } from './constants';
import { getManagerResponse } from './services/geminiService';

const EMOJIS = ['👋', '✅', '🏭', '📊', '🛠️', '🔬', '🧪', '👗', '🧶', '⚙️', '📈', '📋', '⚠️', '🚛', '🤝', '🇧🇩', '📉', '💡', '🔴', '🟢'];

const ChartRenderer: React.FC<{ data: any, color: string }> = ({ data, color }) => {
  const maxValue = Math.max(...data.datasets.flatMap((ds: any) => ds.values), 1);
  return (
    <div className="bg-white p-3 rounded-lg mt-3 border border-slate-100 shadow-sm overflow-x-auto">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{data.title || 'Production Metrics'}</h4>
      <div className="flex items-end gap-2 h-24 min-w-[180px]">
        {data.labels.map((label: string, idx: number) => {
          const value = data.datasets[0].values[idx] || 0;
          const height = (value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div 
                className={`w-full ${color.replace('text-', 'bg-')} opacity-80 rounded-t-sm transition-all`}
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-[8px] text-slate-400 mt-1 truncate w-full text-center">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SettingsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  language: Language; 
  setLanguage: (l: Language) => void;
  isExpertMode: boolean;
  setExpertMode: (e: boolean) => void;
}> = ({ isOpen, onClose, language, setLanguage, isExpertMode, setExpertMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-pop-in">
        <div className="bg-[#008069] p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            System Settings
          </h2>
          <p className="text-white/70 text-sm mt-1">Configure KnitTex Enterprise Dashboard</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Interface Language</p>
              <p className="text-xs text-slate-500">Choose your preferred communication language</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 text-xs font-bold rounded ${language === 'bn' ? 'bg-white shadow text-[#008069]' : 'text-slate-500'}`}
              >BN</button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-white shadow text-[#008069]' : 'text-slate-500'}`}
              >EN</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Expert Mode</p>
              <p className="text-xs text-slate-500">Enable advanced technical insights in responses</p>
            </div>
            <button 
              onClick={() => setExpertMode(!isExpertMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isExpertMode ? 'bg-[#00a884]' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isExpertMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-700">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
               <div className="text-xs">
                 <p className="font-bold">Enterprise v1.4.2</p>
                 <p>All factory sensors connected and operational.</p>
               </div>
             </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#008069] text-white font-bold rounded-lg hover:bg-[#006d58] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeManagerId, setActiveManagerId] = useState<ManagerId>(ManagerId.MEETING_ROOM);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [language, setLanguage] = useState<Language>('bn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExpertMode, setExpertMode] = useState(false);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<boolean>(false);
  const [viewportHeight, setViewportHeight] = useState('100dvh');
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('knittex_factory_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<Record<ManagerId, Message[]>>(() => {
    const initial: any = {};
    MANAGERS.forEach(m => { initial[m.id] = []; });
    
    const saved = localStorage.getItem('knittex_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          if (parsed[key] && Array.isArray(parsed[key])) {
            initial[key as ManagerId] = parsed[key].map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }));
          }
        });
      } catch (e) {
        console.error("Failed to load sessions from local storage:", e);
      }
    }
    return initial;
  });
  
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  const activeManager = MANAGERS.find(m => m.id === activeManagerId)!;
  const currentMessages = sessions[activeManagerId];
  const t = TRANSLATIONS[language];

  // Robust Visual Viewport tracking for mobile keyboards
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(`${height}px`);
      
      // Immediate scroll to bottom on keyboard popup
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    
    // Initial call to set correct height
    handleViewportChange();
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  // Sync notes to local storage
  useEffect(() => {
    localStorage.setItem('knittex_factory_notes', JSON.stringify(notes));
  }, [notes]);

  // Sync chat sessions to local storage
  useEffect(() => {
    localStorage.setItem('knittex_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading, activeView]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setHeaderMenuAnchor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveNote = (modelMessage: Message, index: number) => {
    let question = "";
    for (let i = index - 1; i >= 0; i--) {
      if (currentMessages[i].role === 'user') {
        question = currentMessages[i].content;
        break;
      }
    }
    const speaker = MANAGERS.find(m => m.id === modelMessage.managerId);
    const newNote: Note = {
      id: Date.now().toString(),
      question: question || "Management Update",
      answer: modelMessage.content,
      managerName: speaker?.name || "Senior Manager",
      timestamp: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    alert(t.noteSaved);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const clearCurrentChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setSessions(prev => ({ ...prev, [activeManagerId]: [] }));
    }
    setHeaderMenuAnchor(false);
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const attachments: Attachment[] = [];
    if (selectedImage) {
      attachments.push({ type: 'image', url: `data:${selectedImage.mimeType};base64,${selectedImage.data}`, mimeType: selectedImage.mimeType });
    }

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date(), attachments };
    const currentSessionId = activeManagerId;
    setSessions(prev => ({ ...prev, [currentSessionId]: [...prev[currentSessionId], userMsg] }));
    
    setInput('');
    setSelectedImage(null);
    setShowEmojiPicker(false);
    setIsLoading(true);

    const response = await getManagerResponse(currentSessionId, sessions[currentSessionId], input, language, selectedImage || undefined);

    for (const msgData of response.messages) {
      const modelMsg: Message = { 
        role: 'model', 
        managerId: msgData.managerId, 
        content: msgData.text, 
        timestamp: new Date(), 
        attachments: msgData.attachments 
      };
      if (response.messages.indexOf(msgData) > 0) await new Promise(r => setTimeout(r, 800));
      setSessions(prev => ({ ...prev, [currentSessionId]: [...prev[currentSessionId], modelMsg] }));
    }
    setIsLoading(false);
  };

  const handleInputFocus = () => {
    // Small delay to allow browser layout to stabilize
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="flex w-full overflow-hidden bg-[#efe7de] relative" style={{ height: viewportHeight }}>
      <Sidebar 
        activeManagerId={activeManagerId} 
        activeView={activeView}
        onSelectManager={setActiveManagerId} 
        onSelectView={setActiveView}
        language={language}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
        isExpertMode={isExpertMode}
        setExpertMode={setExpertMode}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="wa-bg-pattern"></div>

        {/* WhatsApp Header */}
        <header className="h-[60px] md:h-16 bg-[#008069] px-3 md:px-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="relative shrink-0">
              {activeView === 'chat' ? (
                <img src={activeManager.avatar} className="w-10 h-10 rounded-full border border-white/20 object-cover shadow-sm" alt="avatar" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.5 2H8.6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h6.8c1.1 0 2-.9 2-2V4.5L15.5 2z"/><path d="M15 2v5h5"/></svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] md:text-base font-bold text-white leading-tight truncate">
                {activeView === 'chat' ? activeManager.name : t.notesSection}
              </h3>
              <p className="text-[11px] text-white/80 truncate">
                {activeView === 'chat' ? 'online' : `${notes.length} saved records`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
             <div className="flex items-center gap-1.5 bg-black/10 px-2 py-1 rounded">
               <button onClick={() => setLanguage('bn')} className={`text-[10px] font-bold ${language === 'bn' ? 'text-white' : 'text-white/40'}`}>BN</button>
               <span className="text-white/20">|</span>
               <button onClick={() => setLanguage('en')} className={`text-[10px] font-bold ${language === 'en' ? 'text-white' : 'text-white/40'}`}>EN</button>
            </div>
            <div className="relative" ref={headerMenuRef}>
              <button 
                onClick={() => setHeaderMenuAnchor(!headerMenuAnchor)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
              {headerMenuAnchor && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-pop-in text-slate-800">
                  <button onClick={clearCurrentChat} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Clear Chat
                  </button>
                  <button onClick={() => { setHeaderMenuAnchor(false); alert("Session archived."); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
                    Archive Session
                  </button>
                  <button onClick={() => { setHeaderMenuAnchor(false); window.print(); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-t border-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    Print Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 md:px-4 z-10 scroll-smooth pb-4">
          {activeView === 'chat' ? (
            <div className="space-y-3 w-full max-w-none">
              <div className="flex justify-center my-4">
                <span className="bg-[#fff5c4] text-slate-700 text-[10px] md:text-[11px] font-bold py-1 px-3 rounded shadow-sm uppercase tracking-wide border border-[#e5d59c]/50">
                  {t.active} Industry Session {isExpertMode && "• EXPERT"}
                </span>
              </div>

              {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-center max-w-xs mx-auto opacity-70">
                  <div className="text-xs text-slate-600 bg-[#fff5c4] p-3 rounded-lg shadow-sm font-medium border border-[#e5d59c]">
                    {t.emptyDesc(activeManager.name)}
                  </div>
                </div>
              )}

              {currentMessages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const speaker = isUser ? null : MANAGERS.find(m => m.id === msg.managerId);
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200 group w-full`}>
                    <div className={`max-w-[95%] sm:max-w-[85%] md:max-w-[70%] wa-bubble ${isUser ? 'wa-bubble-user rounded-[8px] bg-[#dcf8c6]' : 'wa-bubble-received rounded-[8px] bg-white'}`}>
                      {!isUser && (
                        <button 
                          onClick={() => handleSaveNote(msg, idx)}
                          className="absolute top-1 right-1 p-1.5 text-[#8696a0] opacity-0 group-hover:opacity-100 transition-all hover:text-[#00a884] z-20"
                          title={t.saveNote}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </button>
                      )}

                      <div className="p-2 min-w-[80px] relative">
                        {!isUser && activeManagerId === ManagerId.MEETING_ROOM && (
                          <span className="text-[11px] font-bold block mb-1" style={{ color: speaker?.color }}>
                            {speaker?.name}
                          </span>
                        )}
                        
                        <div className="text-[14px] md:text-[15.5px] text-slate-800 leading-[1.4] whitespace-pre-wrap pr-4">
                          {msg.content}
                        </div>
                        
                        {msg.attachments?.map((att, i) => (
                          <div key={i} className="mt-2">
                            {att.type === 'image' && (
                              <img src={att.url} alt="attachment" className="rounded-md w-full max-h-[300px] object-cover border border-black/5" 
                                   onError={(e) => (e.currentTarget.style.display = 'none')} />
                            )}
                            {att.type === 'chart' && (
                              <ChartRenderer data={att.data} color={speaker?.color || activeManager.color} />
                            )}
                          </div>
                        ))}
                        
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[9px] font-medium text-slate-400 uppercase translate-y-0.5">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isUser && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#53bdeb" strokeWidth="2.5"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white p-2 rounded-lg shadow-sm text-[11px] text-slate-500 italic">
                     {t.loading}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#008069]">{t.notesSection}</h2>
                <button onClick={() => { if(confirm("Clear all notes?")) setNotes([]); }} className="text-xs text-red-500 font-bold uppercase tracking-wider">Clear All</button>
              </div>
              {notes.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <p className="font-bold text-slate-500">{t.noNotes}</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 animate-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#00a884] tracking-widest">{note.managerName}</span>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(note.timestamp).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded border-l-4 border-[#00a884]">
                        <p className="text-[11px] font-bold text-slate-400 mb-1 italic">Query:</p>
                        <p className="text-[14px] text-slate-700 font-medium">{note.question}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 mb-1 italic">Instruction:</p>
                        <p className="text-[15px] text-slate-800 leading-relaxed">{note.answer}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* WhatsApp Mobile/Web Style Input Bar */}
        {activeView === 'chat' && (
          <div className="p-2 md:p-3 bg-transparent z-40 shrink-0 pb-safe relative">
            {showEmojiPicker && (
              <div 
                ref={emojiRef}
                className="absolute bottom-full left-4 mb-3 bg-white p-2 rounded-xl shadow-2xl border border-slate-200 grid grid-cols-5 gap-1 z-50 animate-pop-in"
              >
                {EMOJIS.map(e => (
                  <button 
                    key={e} 
                    type="button"
                    onClick={() => addEmoji(e)}
                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full max-w-none px-2 md:px-6">
              <div className="flex-1 bg-white rounded-[24px] px-2 py-1 flex items-end shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 transition-colors rounded-full ${showEmojiPicker ? 'text-[#00a884]' : 'text-[#8696a0]'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                </button>
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedImage({ data: (reader.result as string).split(',')[1], mimeType: file.type });
                    };
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-[#8696a0] hover:text-[#54656f]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <textarea
                  value={input}
                  onFocus={handleInputFocus}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent px-2 py-2 text-[15.5px] outline-none min-h-[40px] max-h-40 text-slate-800 leading-snug"
                  rows={1}
                />
              </div>

              <button
                type="submit"
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-full text-white shadow-md ${
                  (!input.trim() && !selectedImage) || isLoading ? 'bg-[#8696a0] opacity-50' : 'bg-[#00a884] active:scale-90'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0.5"><path d="m22 2-7 20-4-9-9-4ZM22 2 11 13"></path></svg>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
