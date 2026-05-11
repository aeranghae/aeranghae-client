import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Library from './pages/Library';
import Settings from './pages/Settings';
import LoginPage from './pages/Login';
import ProcessingView from './pages/ProcessingView';
import './assets/index.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  const [bgConfig, setBgConfig] = useState({
    orb1: 'bg-blue-600/20', orb2: 'bg-purple-600/20',
    pos1: 'top-0 left-0', pos2: 'bottom-0 right-0'
  });

  useEffect(() => {
    const token = localStorage.getItem('aeranghae_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    switch (activeMenu) {
      case 'dashboard':
        setBgConfig({ orb1: 'bg-blue-600/20', orb2: 'bg-purple-600/20', pos1: 'top-[-10%] left-[-10%]', pos2: 'bottom-[-10%] right-[-10%]' });
        break;
      case 'create':
        setBgConfig({ orb1: 'bg-cyan-500/20', orb2: 'bg-indigo-500/20', pos1: 'top-[10%] left-[20%]', pos2: 'bottom-[10%] right-[20%]' });
        break;
      case 'library':
        setBgConfig({ orb1: 'bg-emerald-600/15', orb2: 'bg-teal-600/15', pos1: 'top-[-5%] right-[-5%]', pos2: 'bottom-[-5%] left-[-5%]' });
        break;
      case 'processing':
        setBgConfig({ orb1: 'bg-indigo-900/30', orb2: 'bg-blue-900/30', pos1: 'top-[50%] left-[50%]', pos2: 'bottom-[50%] right-[50%]' });
        break;
    }
  }, [activeMenu]);

  //로그인/게스트 입장 완료 핸들러
  const handleEntryComplete = () => {
    const token = localStorage.getItem('aeranghae_token');
    if (token) {
      setIsLoggedIn(true);
      setIsGuest(false); // 로그인 성공 시 게스트 모드 해제
    } else {
      setIsGuest(true);
    }
  };

  if (isLoading) return <div className="h-screen w-full bg-[#1C1C1E]" />;

  return (
    <div className="flex h-screen w-full min-w-[1100px] bg-[#1C1C1E] text-white overflow-hidden relative font-sans select-none">
      
      {/* 배경 레이어 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-[1500ms] ease-in-out ${bgConfig.orb1} ${bgConfig.pos1}`} />
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-[1500ms] ease-in-out ${bgConfig.orb2} ${bgConfig.pos2}`} />
      </div>

      {/* 인증 전(로그인X & 게스트X)일 때만 로그인 창 노출 */}
      {!isLoggedIn && !isGuest ? (
        <div className="relative z-50 w-full h-full flex items-center justify-center animate-in fade-in duration-700">
          <LoginPage onClose={handleEntryComplete} />
        </div>
      ) : (
        /*인증 후 레이아웃 */
        <>
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <main className="flex-1 p-8 flex flex-col relative pt-12 h-screen overflow-hidden z-10 animate-in slide-in-from-left-4 duration-1000">
            {activeMenu === 'dashboard' && <Dashboard setActiveMenu={setActiveMenu} />}
            {activeMenu === 'create' && <CreateProject onGenerate={() => setActiveMenu('processing')} />}
            {activeMenu === 'library' && <Library />}
            {activeMenu === 'processing' && <ProcessingView onComplete={() => setActiveMenu('dashboard')} />}
            {activeMenu === 'settings' && <Settings />}
          </main>
        </>
      )}
    </div>
  );
}

export default App;