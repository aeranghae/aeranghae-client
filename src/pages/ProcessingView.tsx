import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, Cpu, Loader2 } from 'lucide-react';

interface ProcessingViewProps {
  onComplete: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'success' }[]>([
    { msg: "System: Core Engine initialized.", type: 'info' }
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const steps = [
    { id: 1, label: '요구사항 모델링', threshold: 20 },
    { id: 2, label: '아키텍처 설계', threshold: 45 },
    { id: 3, label: '데이터베이스 스키마 생성', threshold: 70 },
    { id: 4, label: 'API 엔드포인트 구현', threshold: 90 },
    { id: 5, label: 'UI 컴포넌트 최적화', threshold: 100 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 1;

        // 로그 생성 로직
        if (next % 7 === 0) {
          const randomLogs = [
            `Allocating resources for module_${Math.floor(Math.random() * 1000)}...`,
            `Processing logic sequence ${next}%`,
            `Verifying architectural integrity...`,
            `Injecting middleware components...`
          ];
          setLogs(prevLogs => [...prevLogs, { msg: randomLogs[Math.floor(Math.random() * randomLogs.length)], type: 'info' }]);
        }

        // 단계 완료 시 로그
        steps.forEach(step => {
          if (next === step.threshold) {
            setLogs(prevLogs => [...prevLogs, { msg: `✓ [${step.label}] 단계가 완료되었습니다.`, type: 'success' }]);
          }
        });

        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const isFinished = progress === 100;

  return (
    <div className="h-full flex flex-col gap-8 p-10 text-white relative overflow-hidden">
      {/* 배경 Orb 효과 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 
        ${isFinished ? 'bg-emerald-500/10' : 'bg-blue-600/10 animate-pulse'}`} 
      />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-10">
        
        {/* 1. 중앙 CPU 애니메이션 섹셔ㄴ*/}
        <div className="relative">
          <div className={`w-40 h-40 rounded-[40px] border-4 flex items-center justify-center transition-all duration-700
            ${isFinished 
                ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-emerald-500/5' 
                : 'border-blue-500/30 animate-[spin_10s_linear_infinite] bg-blue-500/5' 
            }`}>
            <div className={`w-28 h-28 rounded-[30px] border-t-4 flex items-center justify-center transition-all duration-700
                ${isFinished ? 'border-emerald-400' : 'border-blue-400 animate-[spin_3s_linear_infinite_reverse]'}`} 
            />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
             {isFinished ? (
                 <CheckCircle2 size={48} className="text-emerald-400 animate-in zoom-in duration-500" />
             ) : (
                 <>
                  <Cpu size={48} className="text-white animate-pulse" />
                  <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] animate-pulse uppercase">Scaling</span>
                 </>
             )}
          </div>
        </div>

        {/* 2. 상태 텍스트 및 프로그레스 바 */}
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              {isFinished ? "Generation Complete" : "Architectural Processing"}
            </h2>
            <p className="text-gray-500 text-xs font-medium">
              {isFinished ? "모든 코드가 성공적으로 생성되었습니다." : "AI 에이전트가 소프트웨어 아키텍처를 구성 중입니다."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
              <span className={isFinished ? "text-emerald-400" : "text-blue-400"}>Progress Status</span>
              <span className={isFinished ? "text-emerald-400" : "text-blue-400"}>{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <div 
                className={`h-full rounded-full transition-all duration-300 relative ${isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}
                style={{ width: `${progress}%` }}
              >
                {!isFinished && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 실시간 터미널 로그 창*/}
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 h-52 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-white/5 pb-2 shrink-0 uppercase font-black text-[10px] tracking-widest">
                <Terminal size={14} /> System Live Output
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] custom-scrollbar scroll-smooth pr-2">
                {logs.map((log, idx) => (
                    <div key={idx} className={`flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300 ${log.type === 'success' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}>
                        <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <span>{log.msg}</span>
                    </div>
                ))}
                {!isFinished && (
                    <div className="flex items-center gap-2 opacity-50">
                        <Loader2 size={12} className="text-blue-500 animate-spin" />
                        <span className="text-blue-500 text-[10px]">Processing data stream...</span>
                    </div>
                )}
                <div ref={logEndRef} />
            </div>
        </div>

        {/* 4. 액션 버튼 */}
        <button 
            onClick={onComplete}
            disabled={!isFinished}
            className={`px-20 py-5 rounded-2xl font-black tracking-[0.2em] transition-all text-sm
                ${isFinished 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-gray-700 border border-white/5 cursor-not-allowed'
                }`}
        >
            {isFinished ? "OPEN PROJECT LIBRARY" : "GENERATING..."}
        </button>

      </div>
    </div>
  );
};

export default ProcessingView;