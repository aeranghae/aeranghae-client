import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Sparkles, Check, 
  Info, FileText, ShieldCheck, RefreshCw, AlertCircle, History,
  Terminal
} from 'lucide-react';

interface CreateProjectProps {
  onGenerate: (data: any) => void;
}

// llm 도메인 모델에 맞춘 상세 분석 결과 타입
interface AnalysisVersion {
  category: string;
  one_line_summary: string;
  primary_actions: string[];
  features: { name: string; description: string }[];
  app_type: string;
  programming_language: string;
  assumptions: { field: string; value: string; reasoning: string }[];
  user_constraints?: string;
  prompt: string;
  timestamp: string;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onGenerate }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  
  const [formData, setFormData] = useState({
    projectName: '',
    prompt: '',
    analysisHistory: [] as AnalysisVersion[],
    selectedHistoryIdx: -1,
    finalAnalysis: null as AnalysisVersion | null,
    selectedStack: '',
    license: 'MIT',
  });

  // 🪄 가이드라인 텍스트 주입
  const injectGuide = () => {
    const guideTemplate = `[누가 사용하나요?]\n- \n\n[핵심 목적]\n- \n\n[가장 필요한 기능 설명]\n- `;
    setFormData({ ...formData, prompt: guideTemplate });
  };

  const handleAnalyze = async () => {
    if (!formData.prompt.trim()) return alert("프롬프트를 입력해주세요.");
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const newVersion: AnalysisVersion = {
        category: "스마트 헬스케어 / 펫테크",
        one_line_summary: "시니어 반려견 건강 지표 추적 및 가족 구성원 간 공동 케어 시스템",
        primary_actions: ["일일 건강 데이터 기록", "복약 알림 발송", "이상 징후 AI 리포팅"],
        features: [
          { name: "지능형 알림", description: "약 복용 여부를 실시간으로 체크하여 가족 전체 알림" },
          { name: "이상 패턴 감지", description: "활동량 급감 시 AI가 건강 이상 가능성 리포트 생성" }
        ],
        app_type: "Web Application",
        programming_language: "TypeScript",
        assumptions: [
          { field: "프로그램 형태", value: "Web", reasoning: "범용적인 접근성과 실시간 데이터 동기화를 위해 웹 환경을 추천했습니다." },
          { field: "개발 언어", value: "TypeScript", reasoning: "데이터 안정성과 유지보수 효율을 위해 선정했습니다." }
        ],
        user_constraints: formData.prompt.includes("로컬") ? "데이터 보안을 위한 로컬 스토리지 사용" : undefined,
        prompt: formData.prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setFormData(prev => ({
        ...prev,
        analysisHistory: [newVersion, ...prev.analysisHistory],
        selectedHistoryIdx: 0,
      }));
      setIsAnalyzing(false);
    }, 1200);
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
            {/* 왼쪽: 입력 영역 (더 넓게 확장) */}
            <div className="flex-[1.2] flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] ml-1">Project Name</label>
                <input 
                  type="text" 
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 outline-none focus:border-blue-500 transition-all font-medium" 
                  placeholder="프로젝트 이름을 입력하세요" 
                />
              </div>
              <div className="flex-1 flex flex-col relative min-h-0">
                <div className="flex justify-between items-center mb-2 shrink-0">
                  <label className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] ml-1">Requirements Prompt</label>
                  <button 
                    onClick={injectGuide} 
                    className="text-[10px] bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/30 hover:bg-purple-600/30 font-bold transition-all"
                  >
                     가이드라인 불러오기
                  </button>
                </div>
                <textarea 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-purple-500 resize-none transition-all text-sm leading-relaxed custom-scrollbar shadow-inner" 
                  placeholder="아이디어를 자유롭게 적거나 가이드를 활용하세요. 수정 후 다시 분석하면 새로운 버전이 생성됩니다."
                  value={formData.prompt}
                  onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-4 w-full py-5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl font-bold hover:from-blue-600/20 hover:to-purple-600/20 transition-all flex items-center justify-center gap-2 group shadow-xl"
                >
                  {isAnalyzing ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-purple-400" />}
                  {formData.analysisHistory.length > 0 ? '수정하여 재분석하기' : 'AI 요구사항 분석하기'}
                </button>
              </div>
            </div>
            
            {/* 오른쪽: 상세 분석 리포트 패널 */}
            <div className="flex-1 bg-blue-600/5 border border-blue-500/20 rounded-[32px] p-6 flex flex-col shadow-2xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-sm font-bold flex items-center gap-2 text-blue-400">
                  <History size={18} /> Analysis Spec
                </h3>
                <div className="flex gap-1.5">
                  {formData.analysisHistory.slice(0, 3).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormData({...formData, selectedHistoryIdx: idx})}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all ${
                        formData.selectedHistoryIdx === idx 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      V{formData.analysisHistory.length - idx}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
                {isAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                    <RefreshCw size={30} className="animate-spin text-blue-500" />
                    <p className="text-xs">요구사항 모델링 중...</p>
                  </div>
                ) : formData.selectedHistoryIdx !== -1 ? (
                  <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                    {/* 카테고리 & 요약 */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="inline-block px-2 py-0.5 bg-blue-500/20 rounded text-[9px] text-blue-400 font-bold mb-2 uppercase">#{formData.analysisHistory[formData.selectedHistoryIdx].category}</div>
                      <p className="text-sm font-bold text-white leading-snug">"{formData.analysisHistory[formData.selectedHistoryIdx].one_line_summary}"</p>
                    </div>
                    
                    {/* 핵심 동작 & 기능 */}
                    <div className="space-y-4">
                      <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-2"><Terminal size={12}/> Primary Actions</p>
                      <div className="space-y-2">
                        {formData.analysisHistory[formData.selectedHistoryIdx].primary_actions.map((act, i) => (
                          <div key={i} className="text-[11px] text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
                            <Check size={14} className="text-blue-500" /> {act}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI 결정 근거 리포트 */}
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <p className="text-[10px] text-purple-400 font-bold uppercase">Architecture Decisions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 font-bold mb-1 uppercase">Form</p>
                          <p className="text-[11px] font-bold text-white uppercase">{formData.analysisHistory[formData.selectedHistoryIdx].app_type}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                          <p className="text-[9px] text-gray-500 font-bold mb-1 uppercase">Lang</p>
                          <p className="text-[11px] font-bold text-emerald-400">{formData.analysisHistory[formData.selectedHistoryIdx].programming_language}</p>
                        </div>
                      </div>
                      {formData.analysisHistory[formData.selectedHistoryIdx].assumptions.map((item, i) => (
                        <div key={i} className="p-3.5 bg-blue-900/10 rounded-2xl border border-blue-500/10">
                          <p className="text-[10px] text-blue-300 font-bold mb-1 flex items-center gap-1">[{item.field}] 분석 결과</p>
                          <p className="text-[10px] text-gray-400 leading-relaxed italic">"{item.reasoning}"</p>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setFormData({...formData, finalAnalysis: formData.analysisHistory[formData.selectedHistoryIdx]})}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        formData.finalAnalysis === formData.analysisHistory[formData.selectedHistoryIdx]
                        ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-600/20'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {formData.finalAnalysis === formData.analysisHistory[formData.selectedHistoryIdx] ? <><Check size={18}/> 확정된 버전</> : '이 버전 사용하기'}
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 pt-20">
                    <AlertCircle size={40} className="mb-3" />
                    <p className="text-xs leading-relaxed">아이디어를 분석하면 전문적인<br/>설계 명세서가 이곳에 작성됩니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 space-y-6">
              <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Stack Selection</h3>
              <div className="grid grid-cols-2 gap-4">
                {['React', 'Next.js', 'Spring Boot', 'Node.js'].map(stack => (
                  <button 
                    key={stack} 
                    onClick={() => setFormData({...formData, selectedStack: stack})}
                    className={`p-5 rounded-3xl border transition-all text-left ${
                      formData.selectedStack === stack 
                      ? 'bg-emerald-600/20 border-emerald-500 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className={`font-bold ${formData.selectedStack === stack ? 'text-emerald-400' : 'text-white'}`}>{stack}</p>
                    <p className="text-[10px] text-gray-500 mt-1 italic uppercase font-bold tracking-tighter">AI Recommended</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-80 bg-emerald-600/5 border border-emerald-500/20 rounded-[32px] p-6">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4"><Info size={18} className="text-emerald-400" /> Stack Info</h3>
              <p className="text-xs text-gray-400 leading-relaxed">선택하신 기술 스택은 현재 기획된 기능들의 확장성과 실시간 처리를 가장 안정적으로 지원합니다.</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex gap-8 h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 space-y-4">
              <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">License Policy</h3>
              {['MIT', 'Apache 2.0', 'GPL 3.0'].map(lic => (
                <button 
                  key={lic} 
                  onClick={() => setFormData({...formData, license: lic})}
                  className={`w-full p-6 rounded-3xl border transition-all flex justify-between items-center ${
                    formData.license === lic ? 'bg-orange-600/15 border-orange-500' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <span className="font-bold text-sm">{lic} License</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.license === lic ? 'border-orange-500' : 'border-white/20'}`}>
                    {formData.license === lic && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="w-80 bg-orange-600/5 border border-orange-500/20 rounded-[32px] p-6">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4"><ShieldCheck size={18} className="text-orange-400" /> License Detail</h3>
              <p className="text-xs text-gray-400 leading-relaxed">오픈소스 프로젝트로서의 법적 권한과 배포 규범을 설정합니다. {formData.license} 라이선스는 상업적 이용에 우호적입니다.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-500">
             <div className="flex-1 bg-black/20 border border-white/5 rounded-[40px] p-10 overflow-y-auto mb-6 custom-scrollbar shadow-inner">
              <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-5 text-blue-400">
                <FileText size={28} />
                <h2 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-4 decoration-blue-600">Final Build Report</h2>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 tracking-widest">Project Identity</p>
                    <p className="text-xl font-bold">{formData.projectName || 'New Project'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 tracking-widest">Selected Stack</p>
                    <p className="text-xl font-bold text-emerald-400">{formData.selectedStack || 'Not Selected'}</p>
                  </div>
                </div>
                <div className="space-y-6 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 tracking-widest">Legal Policy</p>
                    <p className="text-xl font-bold text-orange-400">{formData.license}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 tracking-widest">Build ID</p>
                    <p className="text-sm font-mono text-gray-400">#AER-{Math.floor(Math.random()*10000)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5">
                 <p className="text-[10px] text-blue-500 font-bold uppercase mb-4 tracking-tighter flex items-center gap-2">
                   <Sparkles size={14}/> 확정된 아키텍처 상세 (V{formData.analysisHistory.length - formData.analysisHistory.indexOf(formData.finalAnalysis!)})
                 </p>
                 <div className="grid grid-cols-2 gap-3">
                    {formData.finalAnalysis?.primary_actions.map((act, i) => (
                      <div key={i} className="flex gap-3 text-xs text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" /> {act}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mb-2">설계가 완료되었습니다. 프로젝트 환경 구축을 시작할 준비가 되었습니다.</p>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full px-6 py-4">
      <header className="mb-8 shrink-0 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
              <Sparkles size={26} className="text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">Project Architect</h1>
          </div>
          <p className="text-gray-400 text-sm ml-1 font-medium italic opacity-70">AI-Powered System Design Engine v4.0</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1.5">
            {[1,2,3,4].map(n => <div key={n} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${step >= n ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10'}`} />)}
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">STEP {step}</span>
        </div>
      </header>

      <div className="flex-1 min-h-0 bg-[#242426]/50 border border-white/10 rounded-[56px] p-10 relative shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* 배경 은은한 Orb 효과 */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="h-full pb-20 relative z-10">
          {renderContent()}
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center z-20">
          <button 
            onClick={() => setStep(s => Math.max(1, s-1))} 
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border border-white/5 ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <ChevronLeft size={22} /> BACK
          </button>
          
          <div className="flex gap-5">
            {step < 4 ? (
              <button 
                onClick={() => setStep(s => Math.min(4, s+1))}
                disabled={step === 1 && !formData.finalAnalysis}
                className={`px-14 py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-2xl flex items-center gap-4 active:scale-95 ${
                  (step === 1 && !formData.finalAnalysis)
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40'
                }`}
              >
                NEXT STEP <ChevronRight size={22} />
              </button>
            ) : (
              <>
                <button onClick={() => setStep(1)} className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold transition-all text-gray-400">RESTART</button>
                <button 
                  onClick={() => onGenerate(formData)}
                  className="px-16 py-4 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl font-black tracking-widest shadow-2xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transition-all text-white"
                >
                  GENERATE PROJECT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;