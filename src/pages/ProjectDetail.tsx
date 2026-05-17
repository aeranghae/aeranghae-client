import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FolderOpen, File, Cpu, Sparkles, RefreshCw, 
  Code2, Info, FileCode, Terminal, Globe, ChevronRight, ChevronDown
} from 'lucide-react';
import { storageService, ProjectNode } from '../services/storageService';

interface ProjectDetailProps {
  projectUuid?: string; 
}

//[재귀 트리 노드 컴포넌트]깊이에 상관없이 모든 자식을 펼치도록 자기 자신을 호출
interface TreeNodeProps {
  node: ProjectNode;
  depth: number;
  selectedFile: string;
  onSelectFile: (fileName: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, selectedFile, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState<boolean>(depth < 2); // 깊이 0,1은 기본 펼침 / 2단계부터는 접힘

  // 파일 노드 렌더링
  if (node.type === 'FILE') {
    return (
      <button 
        onClick={() => onSelectFile(node.name)}
        className={`flex items-center gap-2 text-[13px] w-full text-left transition-all hover:translate-x-1 py-0.5 ${selectedFile === node.name ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <File size={12} className={selectedFile === node.name ? 'text-blue-400' : 'text-gray-600'} /> 
        {node.name}
      </button>
    );
  }

  // 디렉토리 노드 렌더링 (자식이 있으면 재귀 호출)
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

      {/*자식이 있고 펼침 상태면 재귀적으로 자식 노드들을 렌더링 */}
      {isOpen && node.children && node.children.length > 0 && (
        <div className="pl-4 space-y-1.5 border-l border-l-white/5 ml-1.5">
          {node.children.map((childNode, idx) => (
            <TreeNode 
              key={`${childNode.name}-${idx}`}
              node={childNode}
              depth={depth + 1}
              selectedFile={selectedFile}
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
  const [selectedFile, setSelectedFile] = useState('MainLogic.java');
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  const [serverFiles, setServerFiles] = useState<ProjectNode[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState<boolean>(false);
  
  const fetchedUuidRef = useRef<string | null>(null);

  const fileContent: { [key: string]: string } = {
    'App.tsx': `import React from 'react';\n\nexport const App = () => {\n  return <div>Pet Health Monitor</div>;\n};`,
    'MainLogic.java': `public class PetHealthMonitor {\n  private int dogAge = 12;\n  public void checkVitals() {\n    System.out.println("Monitoring...");\n  }\n}`,
    'styles.css': `body {\n  background-color: #0d0d0e;\n  color: white;\n}`,
    'database.sql': `CREATE TABLE health_logs (\n  id SERIAL PRIMARY KEY,\n  pet_id INT,\n  status TEXT\n);`,
    'env.json': `{\n  "API_KEY": "AER-9928-AX",\n  "DEBUG": true\n}`,
    'package.json': `{\n  "name": "senior-pet-care",\n  "version": "1.0.4"\n}`
  };

  const parseFlatToTree = (flatList: any[]) => {
    const root: ProjectNode[] = [];
    const lookup: { [key: string]: ProjectNode } = {};

    // 🟢 [정렬 추가] 부모가 자식보다 먼저 처리되도록 path 길이 오름차순 정렬
    //    이렇게 해야 깊은 경로(src/main/java/com)가 와도 lookup에서 부모를 항상 찾을 수 있음
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
          // 부모를 못 찾으면 root로 (안전망)
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
          
          //[재귀적으로 첫 번째 파일 찾기] 깊은 트리에서도 첫 파일을 찾아 선택
          const findFirstFile = (nodes: ProjectNode[]): string | null => {
            for (const n of nodes) {
              if (n.type === 'FILE') return n.name;
              if (n.children && n.children.length > 0) {
                const found = findFirstFile(n.children);
                if (found) return found;
              }
            }
            return null;
          };
          
          const firstFileName = findFirstFile(parsedTree);
          if (firstFileName) {
            setSelectedFile(firstFileName);
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

  const handleModifyRequest = () => {
    if (!modifyPrompt.trim()) return;
    setIsModifying(true);
    setTimeout(() => {
      setIsModifying(false);
      setModifyPrompt('');
    }, 2000);
  };

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
                /*[재귀 트리 렌더링] 깊이에 상관없이 모든 자식을 펼침 */
                <div className="space-y-3">
                  {serverFiles.map((item, idx) => (
                    <TreeNode 
                      key={`${item.name}-${idx}`}
                      node={item}
                      depth={0}
                      selectedFile={selectedFile}
                      onSelectFile={setSelectedFile}
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
                  <span className="text-[11px] font-mono font-bold text-gray-400 tracking-tight">{selectedFile}</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
              </div>
              
              <div className="flex-1 p-10 font-mono text-sm overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <pre className="text-gray-300 pl-4 whitespace-pre-wrap leading-relaxed">
                  {fileContent[selectedFile] || "// Empty File"}
                </pre>
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