import React from 'react';
import { Search, Folder, MoreVertical, Calendar, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

// Props 인터페이스 정의
interface LibraryProps {
  projects: any[]; 
  setActiveMenu: (menu: string) => void;
}

const Library: React.FC<LibraryProps> = ({ projects, setActiveMenu }) => {
  
  const handleProjectClick = (item: any) => {
    if (item.status === 'processing') {
      setActiveMenu('processing');
    } else {
      // 나중에 상세페이지 구현 시 setActiveMenu('detail') 등으로 확장
      setActiveMenu('detail');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative text-white">
      <header className="flex justify-between items-center mb-8 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase underline decoration-blue-600">My Library</h1>
          <p className="text-gray-400 text-sm mt-1">생성 중인 프로젝트와 완성된 코드를 관리하세요.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 transition-all"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {/*App.tsx에서 넘겨받은 projects 배열이 비어있지 않은지 확인 */}
          {projects && projects.length > 0 ? (
            projects.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleProjectClick(item)}
                className={`relative bg-[#1A1A1C] border rounded-[32px] p-6 hover:-translate-y-1 transition-all cursor-pointer group shadow-xl
                  ${item.status === 'processing' ? 'border-blue-500/30 bg-blue-500/5 shadow-blue-500/10' : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                    ${item.status === 'processing' ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/5 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                    {item.status === 'processing' ? <RefreshCw size={24} className="animate-spin" /> : <Folder size={24} />}
                  </div>
                  <MoreVertical size={20} className="text-gray-600 hover:text-white" />
                </div>
                
                <h3 className="font-bold text-xl mb-1 truncate">{item.title}</h3>
                
                {item.status === 'processing' ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      <span>Generating...</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" /> Generation Complete
                  </p>
                )}
                
                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-6 mt-6 border-t border-white/5 font-bold uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {item.date}</div>
                  <div className="flex items-center gap-1.5"><Download size={12} /> {item.items || 0} files</div>
                </div>
              </div>
            ))
          ) : (
            /* 프로젝트가 하나도 없을 때 보여줄 화면 */
            <div className="col-span-3 py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[40px]">
              <p className="text-gray-500 font-bold">저장된 프로젝트가 없습니다.</p>
              <p className="text-xs text-gray-600 mt-2">새 프로젝트 생성을 시작해 보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;