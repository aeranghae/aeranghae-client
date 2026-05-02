
import { Search, Folder, MoreVertical, Calendar, Download } from 'lucide-react';

const Library = () => {
  const libraryItems = [
    { id: 1, title: '사내 업무 자동화', type: 'Blueprints', date: '2024.03.15', items: 12 },
    { id: 2, title: '쇼핑몰 기본 템플릿', type: 'Component', date: '2024.03.10', items: 5 },
    { id: 3, title: 'JWT 로그인 모듈', type: 'Code Snippet', date: '2024.02.28', items: 1 },
    { id: 4, title: '대시보드 UI 키트', type: 'Design System', date: '2024.02.15', items: 24 },
    { id: 5, title: 'Spring Security 설정', type: 'Code Snippet', date: '2024.01.20', items: 1 },
    { id: 6, title: '채팅 서버 아키텍처', type: 'Blueprints', date: '2024.01.05', items: 8 },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* 헤더 & 검색 */}
      <header className="flex justify-between items-center mb-6 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Library</h1>
          <p className="text-gray-400 text-sm">저장된 블루프린트와 코드 스니펫을 관리하세요.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search library..." 
            className="bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-64 transition-all"
          />
        </div>
      </header>

      {/* 그리드 컨텐츠 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        <div className="grid grid-cols-3 gap-4 pb-4">
          {libraryItems.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Folder size={20} />
                </div>
                <MoreVertical size={18} className="text-gray-500 hover:text-white" />
              </div>
              
              <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{item.type}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Calendar size={12} /> {item.date}
                </div>
                <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                   <Download size={12} /> {item.items} files
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Item Placeholder */}
          <div className="border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer h-full min-h-[180px]">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Download size={24} />
             </div>
             <span className="text-sm font-bold">Import External</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;