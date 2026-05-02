import React from 'react';
import { Home, PlusCircle, Folder, Settings as SettingsIcon } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  return (
    <aside className="w-64 h-full relative flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl pt-8 z-20 shrink-0">
      <div className="px-6 pb-6 text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        AI AutoStudio
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem 
          icon={<Home size={20} />} 
          text="Dashboard" 
          active={activeMenu === 'dashboard'} 
          onClick={() => setActiveMenu('dashboard')} 
        />
        <SidebarItem 
          icon={<PlusCircle size={20} />} 
          text="New Project" 
          active={activeMenu === 'create' || activeMenu === 'processing'} 
          onClick={() => setActiveMenu('create')} 
        />
        <SidebarItem 
          icon={<Folder size={20} />} 
          text="My Library" 
          active={activeMenu === 'library'} 
          onClick={() => setActiveMenu('library')} 
        />
        <SidebarItem 
          icon={<SettingsIcon size={20} />} 
          text="Settings" 
          active={activeMenu === 'settings'} 
          onClick={() => setActiveMenu('settings')} 
        />
      </nav>
      <div className="p-4 border-t border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
        v1.0.0 Capstone
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, text, active, onClick }: any) => (
  <div 
    onClick={onClick} 
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
  >
    {icon} <span className="font-medium text-sm">{text}</span>
  </div>
);

export default Sidebar;