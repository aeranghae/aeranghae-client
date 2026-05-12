import React from 'react';
import { Home, PlusCircle, Folder, Settings as SettingsIcon, LogOut, LogIn, User } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  const token = localStorage.getItem('aeranghae_token');
  const userName = localStorage.getItem('aeranghae_user_name') || 'User';

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleGoToLogin = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <aside className="w-64 h-full relative flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl pt-8 z-20 shrink-0 select-none font-sans">
      <div className="px-6 pb-6 text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic tracking-tighter uppercase">AERANGHAE</div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem icon={<Home size={20} />} text="Dashboard" active={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
        <SidebarItem icon={<PlusCircle size={20} />} text="New Project" active={activeMenu === 'create' || activeMenu === 'processing'} onClick={() => setActiveMenu('create')} />
        <SidebarItem icon={<Folder size={20} />} text="My Library" active={activeMenu === 'library'} onClick={() => setActiveMenu('library')} />
        <SidebarItem icon={<SettingsIcon size={20} />} text="Settings" active={activeMenu === 'settings'} onClick={() => setActiveMenu('settings')} />
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${token ? 'bg-white/5 border-white/5' : 'bg-blue-600/5 border-blue-500/20'}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0 ${token ? 'bg-gradient-to-tr from-blue-600 to-purple-600' : 'bg-gray-700'}`}>
            <User size={18} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-white">{token ? `${userName}님` : 'Guest Mode'}</p>
            <p className="text-[9px] text-blue-400 font-bold tracking-tighter uppercase opacity-80">{token ? 'Online' : 'Limited Access'}</p>
          </div>
          {token ? (
            <button onClick={handleLogout} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-90">
              <LogOut size={16} />
            </button>
          ) : (
            <button onClick={handleGoToLogin} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all active:scale-90 flex flex-col items-center">
              <LogIn size={16} /><span className="text-[8px] font-bold">Login</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, text, active, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span className="font-bold text-sm">{text}</span>
  </div>
);

export default Sidebar;