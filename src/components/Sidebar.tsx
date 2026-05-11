import React from 'react';
import { Home, PlusCircle, Folder, Settings as SettingsIcon, LogOut, User } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
  //토큰 유무를 통해 실제 로그인 상태 확인
  const token = localStorage.getItem('aeranghae_token');
  const userName = localStorage.getItem('aeranghae_user_name') || 'Guest';

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('aeranghae_token');
      localStorage.removeItem('aeranghae_user_name');
      // 필요 시 이전에 썼던 임시 닉네임 기록도 삭제
      localStorage.removeItem('aeranghae_user_nickname'); 
      window.location.reload(); 
    }
  };

  return (
    <aside className="w-64 h-full relative flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl pt-8 z-20 shrink-0 select-none font-sans">
      <div className="px-6 pb-6 text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic tracking-tighter">
        AERANGHAE
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem icon={<Home size={20} />} text="Dashboard" active={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
        <SidebarItem icon={<PlusCircle size={20} />} text="New Project" active={activeMenu === 'create' || activeMenu === 'processing'} onClick={() => setActiveMenu('create')} />
        <SidebarItem icon={<Folder size={20} />} text="My Library" active={activeMenu === 'library'} onClick={() => setActiveMenu('library')} />
        <SidebarItem icon={<SettingsIcon size={20} />} text="Settings" active={activeMenu === 'settings'} onClick={() => setActiveMenu('settings')} />
      </nav>

      {/* 하단 프로필 영역 */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group transition-all hover:bg-white/10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <User size={18} />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-white">
              {token ? `${userName}님` : 'Guest Mode'}
            </p>
            <p className="text-[9px] text-blue-400 font-bold tracking-tighter uppercase opacity-80">
              {token ? 'Online' : 'Login Required'}
            </p>
          </div>

          {/* ✅ 로그인이 된 상태(token 존재)일 때만 로그아웃 버튼을 보여줍니다. */}
          {token && (
            <button 
              onClick={handleLogout}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-90"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        
        <div className="mt-4 px-2 text-[9px] text-gray-600 tracking-[0.2em] uppercase font-bold text-center">
          v1.0.0 Capstone
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