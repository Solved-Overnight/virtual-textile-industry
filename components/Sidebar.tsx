
import React, { useState, useRef, useEffect } from 'react';
import { ManagerId, Language, ActiveView } from '../types';
import { MANAGERS, TRANSLATIONS } from '../constants';

interface SidebarProps {
  activeManagerId: ManagerId;
  activeView: ActiveView;
  language: Language;
  onSelectManager: (id: ManagerId) => void;
  onSelectView: (view: ActiveView) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeManagerId, 
  activeView, 
  language, 
  onSelectManager, 
  onSelectView, 
  isOpen, 
  onClose,
  onOpenSettings
}) => {
  const t = TRANSLATIONS[language];
  const groupManager = MANAGERS.find(m => m.id === ManagerId.MEETING_ROOM)!;
  const standardManagers = MANAGERS.filter(m => m.id !== ManagerId.MEETING_ROOM);
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85%] bg-white text-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-96 shrink-0 border-r border-slate-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* WhatsApp Sidebar Header */}
        <div className="bg-[#f0f2f5] px-4 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border border-slate-200 shrink-0">
              <img src="https://picsum.photos/seed/me/100" alt="me" />
            </div>
            <h1 className="text-[13px] font-bold text-[#444] truncate uppercase tracking-tighter">KnitTex Industries</h1>
          </div>
          
          <div className="flex gap-1 text-slate-500 shrink-0">
            <button 
              onClick={() => onSelectView('notes')} 
              className={`p-1.5 rounded-full transition-colors ${activeView === 'notes' ? 'text-[#00a884] bg-slate-200' : 'hover:bg-slate-100'}`}
              title={t.notesSection}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15.5 2H8.6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h6.8c1.1 0 2-.9 2-2V4.5L15.5 2z"/><path d="M15 2v5h5"/></svg>
            </button>
            <button 
              onClick={() => { alert("New Group Chat requested."); }}
              className="p-1.5 hover:bg-slate-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded-full transition-colors ${showMenu ? 'bg-slate-200 text-[#00a884]' : 'hover:bg-slate-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
              {showMenu && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-pop-in">
                  <button onClick={() => { setShowMenu(false); onSelectView('notes'); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.5 2H8.6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h6.8c1.1 0 2-.9 2-2V4.5L15.5 2z"/></svg>
                    Factory Notes
                  </button>
                  <button onClick={() => { setShowMenu(false); alert("Starred messages coming soon."); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Starred Messages
                  </button>
                  <button onClick={() => { setShowMenu(false); onOpenSettings(); }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-t border-slate-50 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    Settings
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="md:hidden p-1.5 hover:bg-slate-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 bg-white border-b border-slate-100">
          <div className="bg-[#f0f2f5] rounded-lg px-3 py-1.5 flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search or start new chat" className="bg-transparent text-sm w-full outline-none" />
          </div>
        </div>
        
        {/* Chat List Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Group Chat */}
          <button
            onClick={() => { onSelectView('chat'); onSelectManager(groupManager.id); onClose(); }}
            className={`w-full flex items-center gap-3 p-3 hover:bg-[#f5f6f6] transition-colors border-b border-slate-100 ${
              activeView === 'chat' && activeManagerId === groupManager.id ? 'bg-[#f0f2f5]' : ''
            }`}
          >
            <div className="relative shrink-0">
                <img src={groupManager.avatar} alt={groupManager.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-slate-900 truncate">{t.meetingRoom}</p>
                <span className="text-[10px] text-[#667781] font-medium">12:00 PM</span>
              </div>
              <p className="text-xs text-[#667781] truncate mt-0.5">Managers are waiting for agenda...</p>
            </div>
          </button>

          {/* Individual Managers */}
          {standardManagers.map((manager) => (
            <button
              key={manager.id}
              onClick={() => { onSelectView('chat'); onSelectManager(manager.id); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 hover:bg-[#f5f6f6] transition-colors border-b border-slate-100 ${
                activeView === 'chat' && activeManagerId === manager.id ? 'bg-[#f0f2f5]' : ''
              }`}
            >
              <div className="relative shrink-0">
                <img src={manager.avatar} alt={manager.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-slate-900 truncate">{manager.name}</p>
                  <span className="text-[10px] text-[#25d366] font-bold">Online</span>
                </div>
                <p className="text-xs text-[#667781] truncate mt-0.5">{manager.role}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Section: Settings & Version */}
        <div className="bg-[#f0f2f5] p-3 border-t border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={onOpenSettings}
              className="flex items-center gap-2 text-[#54656f] hover:text-[#00a884] transition-colors p-1.5 rounded-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:rotate-45 transition-transform duration-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#8696a0] tracking-widest uppercase">KnitTex Pro</span>
              <span className="text-[9px] text-[#aebac1]">v1.4.2 Enterprise</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
