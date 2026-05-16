import React, { useState } from 'react';
import { Search, Folder, MoreVertical, Calendar, Download, RefreshCw, CheckCircle2, Trash2, Edit2 } from 'lucide-react';

// Props 인터페이스 정의
interface LibraryProps {
  projects: any[]; 
  setActiveMenu: (menu: string) => void;
}

const Library: React.FC<LibraryProps> = ({ projects, setActiveMenu }) => {
  // 어떤 카드의 '...' 메뉴가 열려있는지 관리하는 상태
  const [activeMenuId, setActiveMenuId] = useState<any | null>(null);
  // 현재 삭제 확인 모달을 띄울 프로젝트 상태
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  
  //이름 변경(수정 모드)을 위한 상태 변수들
  const [editingProjectId, setEditingProjectId] = useState<any | null>(null); // 현재 어떤 프로젝트를 수정 중인지 ID 보관
  const [editTitleInput, setEditTitleInput] = useState<string>(''); // 입력 중인 새 이름 텍스트

  const handleProjectClick = (item: any) => {
    //수정 모드일 때 메뉴 카드를 클릭해도 상세 페이지로 넘어가지 않게 방어
    if(editingProjectId === item.id) return;

    if (item.status === 'processing') {
      setActiveMenu('processing');
    } else {
      setActiveMenu('detail');
    }
  };

  //이름 변경 메뉴를 클릭했을 때 수정 모드로 진입시키는 핸들러
  const handleStartEditUI = (item: any) => {
    setEditingProjectId(item.id);
    setEditTitleInput(item.title); // 기존 이름을 인풋창에 미리 채워둠
    setActiveMenuId(null); // 더보기 드롭다운은 닫기
  };

  //인풋창에서 Enter를 누르거나 저장 버튼을 눌렀을 때의 임시 핸들러 (API는 나중에)
  const handleSaveTitleUI = () => {
    setEditingProjectId(null);
    alert(`UI 테스트: "${editTitleInput}"(으)로 이름 변경 요청 준비 완료!`);
  };

  //최종 삭제 확인 시 모달을 닫아주는 임시 핸들러 (API는 나중에 연결)
  const handleConfirmDeleteUI = () => {
    setProjectToDelete(null);
    setActiveMenuId(null);
    alert("UI 테스트: 삭제 버튼이 정상적으로 클릭되었습니다.");
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
                  
                  {/*더보기 메뉴 및 삭제 버튼 영역 */}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); //카드 디테일 이동 차단
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="p-1 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenuId === item.id && (
                      <>
                        {/* 바깥 클릭 시 메뉴가 닫히게 하는 투명 레이어 */}
                        <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                        <div className="absolute right-0 mt-2 w-36 bg-[#242426] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                         <button 
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleStartEditUI(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 rounded-xl transition-all mb-0.5"
                          >
                            <Edit2 size={13} /> 이름 변경
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setProjectToDelete(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={13} /> 프로젝트 삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/*이름 렌더링 구역: 일반 모드 vs 수정 모드 분기 처리 */}
                {editingProjectId === item.id ? (
                  <div className="flex gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text"
                      value={editTitleInput}
                      onChange={(e) => setEditTitleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitleUI()}
                      autoFocus
                      className="flex-1 min-w-0 bg-black/30 border border-blue-500 rounded-xl px-3 py-1.5 text-base text-white focus:outline-none font-bold"
                    />
                    <button 
                      onClick={handleSaveTitleUI}
                      className="bg-blue-600 hover:bg-blue-500 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0"
                    >
                      저장
                    </button>
                    <button 
                      onClick={() => setEditingProjectId(null)}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all text-gray-400 shrink-0"
                    >
                      취소
                    </button>
                  </div>
                ) : (

                <h3 className="font-bold text-xl mb-1 truncate">{item.title}</h3>
                )}

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
            <div className="col-span-3 py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[40px]">
              <p className="text-gray-500 font-bold">저장된 프로젝트가 없습니다.</p>
              <p className="text-xs text-gray-600 mt-2">새 프로젝트 생성을 시작해 보세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 팝업 모달 */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] animate-in fade-in duration-200">
          <div className="bg-[#242426] border border-white/10 w-full max-w-sm rounded-[32px] p-6 shadow-2xl text-center animate-in zoom-in-95 duration-150 text-white">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">프로젝트 삭제</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              정말로 <span className="text-white font-bold">"{projectToDelete.title}"</span>을<br/>
              삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-gray-400 transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleConfirmDeleteUI}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-red-600/20"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;