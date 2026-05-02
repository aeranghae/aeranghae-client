import React, { useState } from 'react';
import { Play, Terminal, Sparkles, CheckCircle, Code, Globe, Cpu, Layers, Database, Smartphone } from 'lucide-react';

interface TechStack {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface RecItem {
  id: string;
  text: string;
  isDefault: boolean;
}

const TECH_STACKS: TechStack[] = [
  { id: 'java', name: 'Java', icon: <Code size={18} />, color: 'text-orange-400' },
  { id: 'react', name: 'React', icon: <Globe size={18} />, color: 'text-blue-400' },
  { id: 'python', name: 'Python', icon: <Code size={18} />, color: 'text-yellow-300' },
  { id: 'node', name: 'Node.js', icon: <Globe size={18} />, color: 'text-green-500' },
  { id: 'c', name: 'C/C++', icon: <Cpu size={18} />, color: 'text-blue-600' },
  { id: 'sql', name: 'Oracle', icon: <Database size={18} />, color: 'text-red-400' },
  { id: 'spring', name: 'Spring', icon: <Layers size={18} />, color: 'text-green-400' },
  { id: 'flutter', name: 'Flutter', icon: <Smartphone size={18} />, color: 'text-cyan-400' },
];

const AI_RECOMMENDATIONS: RecItem[] = [
  { id: 'jwt', text: '사용자 로그인 (JWT)', isDefault: true },
  { id: 'api', text: 'REST API 서버 구축', isDefault: true },
  { id: 'db', text: 'DB 스키마 설계', isDefault: true },
  { id: 'ui', text: '반응형 웹 UI 구현', isDefault: true },
  { id: 'docker', text: 'Docker 배포 설정', isDefault: false },
  { id: 'admin', text: '관리자 페이지', isDefault: false },
];

const CreateProject = ({ onGenerate }: { onGenerate: () => void }) => {
  const [selectedTechs, setSelectedTechs] = useState<TechStack[]>([]);
  const [selectedRecs, setSelectedRecs] = useState<string[]>([]);

  const toggleTech = (tech: TechStack) => {
    if (selectedTechs.find(t => t.id === tech.id)) {
      setSelectedTechs(selectedTechs.filter(t => t.id !== tech.id));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const toggleRec = (id: string) => {
    if (selectedRecs.includes(id)) {
      setSelectedRecs(selectedRecs.filter(itemId => itemId !== id));
    } else {
      setSelectedRecs([...selectedRecs, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold mb-1">Create New Project</h1>
        <p className="text-gray-400 text-sm">아이디어를 입력하면 AI가 최적의 솔루션을 설계합니다.</p>
      </header>

      <div className="flex-1 flex gap-6 h-full min-h-0 overflow-hidden pb-4">
        <div className="flex-[2] flex flex-col gap-6 h-full min-h-0">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4 min-h-0">
            <div className="space-y-1 shrink-0">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">프로젝트 이름</label>
              <input type="text" placeholder="Ex. 사내 업무 자동화 시스템" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors" />
            </div>
            <div className="space-y-1 flex-1 flex flex-col min-h-0 overflow-hidden">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2 shrink-0">
                  프롬프트 입력 <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-tighter">AI Input Mode</span>
              </label>
              <textarea 
                className="flex-1 w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed text-sm overflow-y-auto custom-scrollbar"
                placeholder="만들고 싶은 프로그램에 대해 자세히 설명해주세요."
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2"><Terminal size={18} className="text-purple-400"/> Tech Stack</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {TECH_STACKS.map(tech => (
                <button 
                  key={tech.id} 
                  onClick={() => toggleTech(tech)} 
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all h-24 
                    ${selectedTechs.find(t => t.id === tech.id) ? 'bg-blue-500/20 border-blue-500 shadow-lg' : 'bg-black/20 border-white/5 hover:bg-white/10'}`}
                >
                  <div className={`p-1.5 rounded-full ${selectedTechs.find(t => t.id === tech.id) ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                    {tech.icon}
                  </div>
                  <span className="text-[11px] font-medium">{tech.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col h-full min-h-0">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 shrink-0">
            <Sparkles size={18} className="text-green-400 animate-pulse"/> AI Recommendation
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
            {AI_RECOMMENDATIONS.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => toggleRec(rec.id)} 
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group 
                  ${selectedRecs.includes(rec.id) ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all 
                  ${selectedRecs.includes(rec.id) ? 'bg-blue-500 border-transparent' : 'border-gray-600 group-hover:border-gray-400'}`}>
                  {selectedRecs.includes(rec.id) && <CheckCircle size={10} className="text-white" />}
                </div>
                <span className={`text-sm tracking-tight ${selectedRecs.includes(rec.id) ? 'text-white font-medium' : 'text-gray-400'}`}>{rec.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
             <button onClick={onGenerate} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <Play fill="white" size={16} /> Generate Project
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;