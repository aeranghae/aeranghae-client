import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FolderOpen, File, Cpu, Sparkles, RefreshCw, 
  Code2, Info, FileCode, Terminal, Globe, ChevronRight, ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { storageService, ProjectNode } from '../services/storageService';

interface ProjectDetailProps {
  projectUuid?: string; 
}

// [파일 확장자 → Prism 언어 식별자 매핑]
// Prism이 알아듣는 언어명으로 매핑해야 정확한 하이라이팅이 적용됨
const getLanguageFromPath = (filePath: string): string => {
  if (!filePath) return 'text';
  
  const fileName = filePath.split('/').pop() || '';
  const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : '';
  
  // 확장자별 언어 매핑 테이블
  const langMap: { [key: string]: string } = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'mjs': 'javascript',
    'cjs': 'javascript',
    
    // 백엔드 언어
    'java': 'java',
    'kt': 'kotlin',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'cs': 'csharp',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'hpp': 'cpp',
    
    // 웹 마크업/스타일
    'html': 'markup',
    'htm': 'markup',
    'xml': 'markup',
    'svg': 'markup',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    
    // 데이터/설정 파일
    'json': 'json',
    'yml': 'yaml',
    'yaml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',
    'env': 'bash',
    
    // 셸/빌드
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'gradle': 'groovy',
    'groovy': 'groovy',
    
    // 데이터베이스
    'sql': 'sql',
    
    // 문서
    'md': 'markdown',
    'markdown': 'markdown',
    
    // 기타
    'dockerfile': 'docker',
    'gitignore': 'bash',
  };
  
  // 확장자 없는 특수 파일명 처리
  if (!extension) {
    const lowerName = fileName.toLowerCase();
    if (lowerName === 'dockerfile') return 'docker';
    if (lowerName === 'makefile') return 'makefile';
    if (lowerName.startsWith('.git')) return 'bash';
    return 'text';
  }
  
  return langMap[extension] || 'text';
};

//[재귀 트리 노드 컴포넌트] 깊이에 상관없이 모든 자식을 펼치도록 자기 자신을 호출
interface TreeNodeProps {
  node: ProjectNode;
  depth: number;
  selectedPath: string;
  onSelectFile: (filePath: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, selectedPath, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState<boolean>(depth < 2);
  const nodePath = (node as any).path || node.name;

  if (node.type === 'FILE') {
    return (
      <button 
        onClick={() => onSelectFile(nodePath)}
        className={`flex items-center gap-2 text-[13px] w-full text-left transition-all hover:translate-x-1 py-0.5 ${selectedPath === nodePath ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <File size={12} className={selectedPath === nodePath ? 'text-blue-400' : 'text-gray-600'} /> 
        {node.name}
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 w-full text-left transition-all hover:opacity-80 ${
          depth === 0 
            ? 'text-[14px] text-blue-400/80 font-black uppercase tracking-tighter' 
            : 'text-[13px] text-blue-300/70 font-bold'
        }`}
      >
        {isOpen 
          ? <ChevronDown size={12} className="text-blue-500/70 shrink-0" /> 
          : <ChevronRight size={12} className="text-blue-500/70 shrink-0" />
        }
        {isOpen 
          ? <FolderOpen size={14} className="fill-blue-500/20 shrink-0" /> 
          : <Folder size={14} className="fill-blue-500/20 shrink-0" />
        }
        <span className="truncate">{node.name}</span>
      </button>

      {isOpen && node.children && node.children.length > 0 && (
        <div className="pl-4 space-y-1.5 border-l border-l-white/5 ml-1.5">
          {node.children.map((childNode, idx) => (
            <TreeNode 
              key={`${childNode.name}-${idx}`}
              node={childNode}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectUuid }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'info'>('code');
  
  const [selectedPath, setSelectedPath] = useState<string>('');
  
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  const [serverFiles, setServerFiles] = useState<ProjectNode[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState<boolean>(false);
  
  const [fileContent, setFileContent] = useState<string>('// 좌측에서 파일을 선택해 주세요.');
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>('');
  
  const fileContentCacheRef = useRef<{ [path: string]: string }>({});
  
  const fetchedUuidRef = useRef<string | null>(null);

  const parseFlatToTree = (flatList: any[]) => {
    const root: ProjectNode[] = [];
    const lookup: { [key: string]: ProjectNode } = {};

    const sortedList = [...flatList].sort((a, b) => {
      const aDepth = a.path.split('/').length;
      const bDepth = b.path.split('/').length;
      return aDepth - bDepth;
    });

    sortedList.forEach((node) => {
      const parts = node.path.split('/');
      const name = parts[parts.length - 1]; 
      
      const newNode: ProjectNode = {
        name: name,
        type: node.type === 'DIR' ? 'DIRECTORY' : 'FILE',
        children: node.type === 'DIR' ? [] : undefined
      };

      (newNode as any).path = node.path;
      lookup[node.path] = newNode;

      if (parts.length === 1) {
        root.push(newNode); 
      } else {
        const parentPath = parts.slice(0, -1).join('/');
        if (lookup[parentPath]) {
          lookup[parentPath].children?.push(newNode);
        } else {
          root.push(newNode);
        }
      }
    });

    return root;
  };

  useEffect(() => {
    const fetchProjectTree = async () => {
      if (!projectUuid || 
          projectUuid.trim() === "" || 
          projectUuid === "undefined" || 
          projectUuid.length < 30) {
        console.log("[대기] 유효한 프로젝트 UUID가 확보되지 않아 API 요청을 차단했습니다.");
        return; 
      }

      if (fetchedUuidRef.current === projectUuid) {
        console.log(`[중복 차단] UUID ${projectUuid} 는 이미 조회 완료. 재요청 스킵.`);
        return;
      }
      fetchedUuidRef.current = projectUuid;
      
      setIsTreeLoading(true);
      try {
        console.log(`[API 발사] 검증 완료된 UUID로 트리를 조회합니다: ${projectUuid}`);
        const data = await storageService.getProjectTree(projectUuid);
        
        if (data && Array.isArray(data)) {
          const parsedTree = parseFlatToTree(data);
          setServerFiles(parsedTree);
          
          const findFirstFilePath = (nodes: ProjectNode[]): string | null => {
            for (const n of nodes) {
              if (n.type === 'FILE') return (n as any).path || n.name;
              if (n.children && n.children.length > 0) {
                const found = findFirstFilePath(n.children);
                if (found) return found;
              }
            }
            return null;
          };
          
          const firstFilePath = findFirstFilePath(parsedTree);
          if (firstFilePath) {
            setSelectedPath(firstFilePath);
          }
        } else {
          setServerFiles([]);
        }
      } catch (error) {
        console.error("화면에 프로젝트 트리를 바인딩하지 못했습니다:", error);
        fetchedUuidRef.current = null;
        setServerFiles([]);
      } finally {
        setIsTreeLoading(false);
      }
    };

    fetchProjectTree();
  }, [projectUuid]);

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!projectUuid || !selectedPath) {
        return;
      }
      
      if (fileContentCacheRef.current[selectedPath] !== undefined) {
        console.log(`[캐시 히트] ${selectedPath} - 메모리에서 즉시 로드`);
        setFileContent(fileContentCacheRef.current[selectedPath]);
        setFileError('');
        return;
      }
      
      setIsFileLoading(true);
      setFileError('');
      
      try {
        console.log(`[파일 조회] ${selectedPath}`);
        const content = await storageService.getFileContent(projectUuid, selectedPath);
        
        fileContentCacheRef.current[selectedPath] = content;
        setFileContent(content);
        
      } catch (error: any) {
        console.error(`파일 내용 로드 실패: ${selectedPath}`, error);
        setFileError(
          error.response?.status === 404 
            ? '파일을 찾을 수 없습니다.'
            : error.response?.status === 403
            ? '이 파일에 접근할 권한이 없습니다.'
            : '파일 내용을 불러오는 중 오류가 발생했습니다.'
        );
        setFileContent('');
      } finally {
        setIsFileLoading(false);
      }
    };

    fetchFileContent();
  }, [projectUuid, selectedPath]);

  useEffect(() => {
    fileContentCacheRef.current = {};
  }, [projectUuid]);

  const handleModifyRequest = () => {
    if (!modifyPrompt.trim()) return;
    setIsModifying(true);
    setTimeout(() => {
      setIsModifying(false);
      setModifyPrompt('');
    }, 2000);
  };

  const displayFileName = selectedPath ? selectedPath.split('/').pop() : '';
  
  //[현재 파일의 언어 식별자] 하이라이팅 적용을 위한 언어 결정
  const currentLanguage = getLanguageFromPath(selectedPath);

  return (
    <div className="flex flex-col h-full bg-[#0D0D0E] text-white overflow-hidden animate-in fade-in duration-700">
      {/* --- 상단 헤더 섹션 --- */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-white/5 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-900/20">
            <Code2 size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black italic tracking-tighter uppercase">시니어 견주 건강관리 앱</h2>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-widest">Live Build</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><Globe size={10}/> 개발: 웹</span>
              <span className="flex items-center gap-1"><Cpu size={10}/> 엔진: Gemini-3-Flash</span>
            </div>
          </div>
        </div>

        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('code')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <FileCode size={16} /> 코드
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Info size={16} /> 정보
          </button>
        </div>
      </header>

      {/* --- 메인 작업 영역 --- */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'code' ? (
          <div className="flex h-full animate-in slide-in-from-right-4 duration-500">
            {/* 좌측: 파일 트리 (Explorer) */}
            <aside className="w-72 border-r border-white/5 bg-black/30 p-8 overflow-y-auto custom-scrollbar">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <ChevronRight size={12} className="text-blue-500" /> Project Explorer
              </p>
              
              {isTreeLoading ? (
                <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-blue-500" /> 트리 구조 동기화 중...
                </div>
              ) : (
                <div className="space-y-3">
                  {serverFiles.map((item, idx) => (
                    <TreeNode 
                      key={`${item.name}-${idx}`}
                      node={item}
                      depth={0}
                      selectedPath={selectedPath}
                      onSelectFile={setSelectedPath}
                    />
                  ))}
                </div>
              )}
            </aside>

            {/* 중앙: 코드 편집기 */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0D0D0E] relative shadow-2xl">
              <div className="flex items-center justify-between px-8 py-3 bg-white/[0.03] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-blue-500" />
                  <span className="text-[11px] font-mono font-bold text-gray-400 tracking-tight">
                    {displayFileName || 'No file selected'}
                  </span>
                  {/* [언어 뱃지] 현재 파일의 언어를 우측에 살짝 표시 */}
                  {selectedPath && currentLanguage !== 'text' && (
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-widest ml-2">
                      {currentLanguage}
                    </span>
                  )}
                  {isFileLoading && (
                    <RefreshCw size={11} className="animate-spin text-blue-400 ml-1" />
                  )}
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {/*[에러 / 로딩 / 정상 표시] 3가지 상태에 따라 분기 렌더링 */}
                {fileError ? (
                  <div className="p-10">
                    <div className="flex items-center gap-3 text-red-400 bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                      <AlertCircle size={18} className="shrink-0" />
                      <div>
                        <p className="font-bold text-sm mb-1">파일을 불러올 수 없습니다</p>
                        <p className="text-xs text-red-400/70">{fileError}</p>
                      </div>
                    </div>
                  </div>
                ) : isFileLoading ? (
                  <div className="p-10 flex items-center gap-3 text-gray-500">
                    <RefreshCw size={14} className="animate-spin text-blue-500" />
                    <span className="text-xs">파일 내용을 가져오는 중...</span>
                  </div>
                ) : (
                  /*[구문 강조 적용] react-syntax-highlighter로 컬러 코딩 */
                  <SyntaxHighlighter
                    language={currentLanguage}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    wrapLongLines={false}
                    customStyle={{
                      background: 'transparent',
                      margin: 0,
                      padding: '2.5rem',
                      fontSize: '0.9rem',          // 글자 살짝 더 크게
                      lineHeight: '1.7',           // 줄 간격 넉넉하게
                      fontFamily: 'inherit',
                      textShadow: 'none',          // 텍스트 그림자 제거로 또렷함
                    }}
                    lineNumberStyle={{
                      color: '#52525b',            // 줄번호 조금 더 밝게
                      minWidth: '3em',             // 줄번호 영역 살짝 넓게
                      paddingRight: '1.5em',
                      userSelect: 'none',
                      borderRight: '1px solid rgba(255,255,255,0.05)',  // 줄번호 우측 구분선
                      marginRight: '1em',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                      }
                    }}
                  >
                    {fileContent || "// Empty File"}
                  </SyntaxHighlighter>
                )}
              </div>

              {/* 하단 AI 수정 프롬프트 바 */}
              <div className="p-8 bg-[#131315] border-t border-white/5 relative">
                <div className="max-w-5xl mx-auto relative group">
                  <div className="absolute -top-5 left-5 flex items-center gap-2">
                    <Sparkles size={14} className={`text-purple-400 ${isModifying ? 'animate-spin' : 'animate-pulse'}`} />
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">AI Modifier Ready</span>
                  </div>
                  <div className="relative overflow-hidden rounded-[28px] p-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 group-focus-within:from-blue-500/50 group-focus-within:via-purple-500/50 group-focus-within:to-blue-500/50 transition-all duration-500">
                    <div className="bg-[#0D0D0E] rounded-[27px] relative">
                      <textarea 
                        value={modifyPrompt}
                        onChange={(e) => setModifyPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) { 
                            e.preventDefault();
                            handleModifyRequest();
                            }
                        }}
                        rows={1}
                        className="w-full bg-transparent py-4 pl-12 pr-40 outline-none text-sm text-gray-200 placeholder:text-gray-600 transition-all resize-none min-h-[56px] max-h-[200px] custom-scrollbar"
                        placeholder="수정하고 싶은 내용을 입력하세요."
                        />

                        <div className="absolute left-5 bottom-6">
                        <Cpu size={22} className={`${isModifying ? 'text-purple-500' : 'text-gray-600 group-focus-within:text-blue-500'} transition-colors duration-500`} />
                        </div>

                        <button 
                        onClick={handleModifyRequest}
                        disabled={!modifyPrompt.trim() || isModifying}
                        className={`absolute right-3 bottom-3 px-7 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all
                            ${modifyPrompt.trim() && !isModifying ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' : 'bg-white/5 text-gray-700'}`}
                        >
                        {isModifying ? <RefreshCw size={14} className="animate-spin" /> : 'REQUEST MODIFY'}
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </main>
          </div>
        ) : (
          /* 프로젝트 명세 섹션 (SPEC) */
          <div className="h-full p-16 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 gap-12">
              <div className="col-span-2 space-y-12">
                <section className="space-y-5 border-l-4 border-blue-600 pl-8">
                  <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Core Specification</h3>
                  <p className="text-3xl font-bold leading-tight tracking-tighter">"시니어 반려견 건강 관리 돌봄 허브"</p>
                </section>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-inner">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Target Stack</p>
                    <p className="text-xl font-bold text-emerald-400">TypeScript, React</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-inner">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Policy</p>
                    <p className="text-xl font-bold text-orange-400">MIT License</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600/5 border border-blue-500/20 rounded-[48px] p-10 flex flex-col gap-8 shadow-2xl">
                 <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-3">
                   <Terminal size={18} /> Build Info
                 </h4>
                 <div className="space-y-6 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-gray-500">BUILD VERSION</span><span className="font-mono">v1.0.4-stable</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-4"><span className="text-gray-500">STATUS</span><span className="text-emerald-500 font-bold uppercase">Deployed</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500 font-bold">TOTAL SOURCE</span><span className="text-blue-400 underline underline-offset-4 font-black">24 Files</span></div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;