import React, { useState, useEffect } from 'react';
import { Search, Folder, MoreVertical, Calendar, Download, RefreshCw, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { projectService, ProjectResponseDto } from '../services/projectService';

interface LibraryProps {
  setActiveMenu: (menu: string) => void;
  onSelectProject?: (uuid: string) => void;
}

const Library: React.FC<LibraryProps> = ({ setActiveMenu, onSelectProject }) => {
  const [projectsList, setProjectsList] = useState<ProjectResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectResponseDto | null>(null);
  
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null); 
  const [editTitleInput, setEditTitleInput] = useState<string>('');
  
  //중복 호출을 막고 재사용하기 위해 프로젝트 목록 가져오는 함수를 밖으로 분리
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjectsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("라이브러리 목록 로드 실패:", error);
      alert("프로젝트 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (item: ProjectResponseDto) => {
    if (!item || !item.uuid || editingProjectId === item.uuid) return;

    if (onSelectProject) {
      onSelectProject(item.uuid);
    }
    setActiveMenu('detail');
  };

  const handleStartEditUI = (item: ProjectResponseDto) => {
    if (!item || !item.uuid) return;
    setEditingProjectId(item.uuid);
    setEditTitleInput(item.projectName || '이름 없음');
    setActiveMenuId(null); 
  };

  const handleSaveTitleUI = async () => {
    if (!editingProjectId) return;
    if (!editTitleInput.trim()) {
      alert("변경할 이름을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true); // 로딩 스피너 켜기
      
      // 1. PATCH 요청 전송
      await projectService.updateProjectName(editingProjectId, editTitleInput);
      
      // 2. 수정 모드 종료
      setEditingProjectId(null);
      
      // 3.이름이 변경되었으므로 프로젝트 목록을 다시 서버에서 불러와 동기화(갱신)
      await fetchProjects();
      
    } catch (error) {
      alert("이름 변경 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

 const handleConfirmDeleteUI = async () => {
  //안전장치: 현재 선택된 삭제 대상 프로젝트나 uuid가 없으면 실행 안 함
  if (!projectToDelete || !projectToDelete.uuid) return;

  try {
    setIsLoading(true); // 로딩 스피너 켜기

    // 1. 서버에 해당 uuid 삭제 요청 전송
    await projectService.deleteProject(projectToDelete.uuid);

    // 2. 모달창 닫기 및 활성화된 더보기 메뉴 초기화
    setProjectToDelete(null);
    setActiveMenuId(null);

    // 3. 삭제가 완료되었으므로 프로젝트 목록을 서버에서 새로 받아와 갱신
    await fetchProjects();

  } catch (error) {
    alert("프로젝트 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
  } finally {
    setIsLoading(false); // 로딩 꺼주기
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <RefreshCw className="animate-spin text-blue-500" size={40} />
            <p className="text-sm text-gray-400 font-medium">프로젝트 보관함을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {projectsList && projectsList.length > 0 ? (
              projectsList.map((item) => {
                //만약 item 자체가 null이거나 uuid가 없으면 오류를 내지 않고 스킵
                if (!item || !item.uuid) return null;

                const currentUuid = item.uuid;
                const displayTitle = item.projectName || "이름 없는 프로젝트";

                return (
                  <div 
                    key={currentUuid} 
                    onClick={() => handleProjectClick(item)}
                    className="relative bg-[#1A1A1C] border border-white/5 hover:border-white/20 rounded-[32px] p-6 hover:-translate-y-1 transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white/5 text-blue-400 group-hover:bg-blue-500 group-hover:text-white">
                        <Folder size={24} />
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setActiveMenuId(activeMenuId === currentUuid ? null : currentUuid);
                          }}
                          className="p-1 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-all"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {activeMenuId === currentUuid && (
                          <>
                            <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                            <div className="absolute right-0 mt-2 w-36 bg-[#242426] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStartEditUI(item); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 rounded-xl transition-all mb-0.5"
                              >
                                <Edit2 size={13} /> 이름 변경
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setProjectToDelete(item); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                              >
                                <Trash2 size={13} /> 프로젝트 삭제
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* 이름 변경 렌더링 구역 */}
                    {editingProjectId === currentUuid ? (
                      <div className="flex gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="text"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTitleUI()}
                          autoFocus
                          className="flex-1 min-w-0 bg-black/30 border border-blue-500 rounded-xl px-3 py-1.5 text-base text-white focus:outline-none font-bold"
                        />
                        <button onClick={handleSaveTitleUI} className="bg-blue-600 hover:bg-blue-500 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0">저장</button>
                        <button onClick={() => setEditingProjectId(null)} className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all text-gray-400 shrink-0">취소</button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-xl mb-1 truncate">{displayTitle}</h3>
                    )}

                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Generation Complete
                    </p>
                    
                    {/* 하단 메타데이터 구역 (안전성 검사 보완) */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-6 mt-6 border-t border-white/5 font-bold uppercase tracking-tighter">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} /> 
                        {item.createdAt && typeof item.createdAt === 'string' 
                          ? item.createdAt.substring(0, 10) 
                          : '0000-00-00'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Download size={12} /> {item.fileCount || 0} files
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[40px]">
                <p className="text-gray-500 font-bold">저장된 프로젝트가 없습니다.</p>
                <p className="text-xs text-gray-600 mt-2">새 프로젝트 생성을 시작해 보세요.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 삭제 확인 팝업 모달 */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] text-white">
          <div className="bg-[#242426] border border-white/10 w-full max-w-sm rounded-[32px] p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">프로젝트 삭제</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              정말로 <span className="text-white font-bold">"{projectToDelete.projectName || '이름 없음'}"</span>을<br/>
              삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setProjectToDelete(null)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-gray-400 transition-all">취소</button>
              <button onClick={handleConfirmDeleteUI} className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-red-600/20">삭제하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;