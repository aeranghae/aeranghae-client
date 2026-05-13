import React, { useState } from 'react';
import { 
  Folder, File, Cpu, Sparkles, RefreshCw, 
  Code2, Info, FileCode, Terminal, Globe, ChevronRight 
} from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'info'>('code');
  const [selectedFile, setSelectedFile] = useState('MainLogic.java');
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  // 1. 파일별 코드 데이터 정의
  const fileContent: { [key: string]: string } = {
    'App.tsx': `import React from 'react';\n\nexport const App = () => {\n  return <div>Pet Health Monitor</div>;\n};`,
    'MainLogic.java': `public class PetHealthMonitor {\n  private int dogAge = 12;\n  public void checkVitals() {\n    System.out.println("Monitoring...");\n  }\n}`,
    'styles.css': `body {\n  background-color: #0d0d0e;\n  color: white;\n}`,
    'database.sql': `CREATE TABLE health_logs (\n  id SERIAL PRIMARY KEY,\n  pet_id INT,\n  status TEXT\n);`,
    'env.json': `{\n  "API_KEY": "AER-9928-AX",\n  "DEBUG": true\n}`,
    'package.json': `{\n  "name": "senior-pet-care",\n  "version": "1.0.4"\n}`
  };

  // 2. 파일 트리 구조 정의
  const files = [
    { name: 'src', children: ['App.tsx', 'MainLogic.java', 'styles.css'] },
    { name: 'config', children: ['database.sql', 'env.json'] },
    { name: 'package.json', type: 'file' }
  ];

  // AI 수정 요청 핸들러
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
              <div className="space-y-6">
                {files.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    {item.children ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[14px] text-blue-400/80 font-black uppercase tracking-tighter">
                          <Folder size={14} className="fill-blue-500/20" /> {item.name}
                        </div>
                        <div className="pl-5 space-y-2.5 border-l border-white/5 ml-1.5">
                          {item.children.map(file => (
                            <button 
                              key={file}
                              onClick={() => setSelectedFile(file)}
                              className={`flex items-center gap-2 text-[13px] w-full text-left transition-all hover:translate-x-1 ${selectedFile === file ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <File size={12} className={selectedFile === file ? 'text-blue-400' : 'text-gray-600'} /> {file}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setSelectedFile(item.name)}
                        className={`flex items-center gap-2 text-[11px] w-full text-left transition-all hover:translate-x-1 ${selectedFile === item.name ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <File size={12} className={selectedFile === item.name ? 'text-blue-400' : 'text-gray-600'} /> {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
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
                            if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter는 줄바꿈, 그냥 Enter는 전송
                            e.preventDefault();
                            handleModifyRequest();
                            }
                        }}
                        rows={1} // 기본 높이
                        className="w-full bg-transparent py-4 pl-12 pr-40 outline-none text-sm text-gray-200 placeholder:text-gray-600 transition-all resize-none min-h-[56px] max-h-[200px] custom-scrollbar"
                        placeholder="수정하고 싶은 내용을 입력하세요."
                        />

                        <div className="absolute left-5 bottom-6"> {/* bottom 위치 조정 */}
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