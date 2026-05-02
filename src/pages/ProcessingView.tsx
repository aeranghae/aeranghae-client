import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, Loader2, Cpu } from 'lucide-react';

// TypeScript 인터페이스 정의: Props로 전달받는 함수의 타입을 명시합니다.
interface ProcessingViewProps {
  onComplete: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([
    { msg: "Initializing AI Agent...", status: 'success' },
    { msg: "Analyzing requirements...", status: 'success' },
  ]);

  // 완료 상태 확인 변수
  const isFinished = progress === 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // 특정 구간마다 랜덤 로그 생성 (가짜 데이터)
        if (prev % 15 === 0) {
            setLogs(prevLogs => [
                ...prevLogs, 
                { msg: `Generating module segment [${Math.floor(Math.random() * 9999)}]...`, status: 'success' },
                { msg: "Verifying syntax integrity...", status: 'success' }
            ]);
        }
        return prev + 1;
      });
    }, 50); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 p-8 flex flex-col h-full relative overflow-hidden">
      {/* 배경 글로우 효과 */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 
        ${isFinished ? 'bg-green-500/10' : 'bg-blue-500/10 animate-pulse'}`} 
      />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8">
        
        {/* 1. 중앙 애니메이션 서클 */}
        <div className="relative transition-all duration-700">
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-700
            ${isFinished 
                ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                : 'border-blue-500/30 animate-[spin_10s_linear_infinite]' 
            }`}>
            <div className={`w-24 h-24 rounded-full border-t-4 flex items-center justify-center transition-all duration-700
                ${isFinished 
                    ? 'border-green-400' 
                    : 'border-blue-400 animate-[spin_3s_linear_infinite_reverse]' 
                }`} 
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             {isFinished ? (
                 <CheckCircle2 size={40} className="text-green-400 animate-in zoom-in duration-300" />
             ) : (
                 <Cpu size={40} className="text-white animate-pulse" />
             )}
          </div>
        </div>

        {/* 2. 상태 텍스트 */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white transition-all">
            {isFinished ? "Generation Complete" : "Generating Software..."}
          </h2>
          <p className="text-gray-400">
            {isFinished ? "Project is ready to launch." : "AI Architect is building your structure."}
          </p>
        </div>

        {/* 3. 프로그레스 바 */}
        <div className="w-full max-w-lg space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className={isFinished ? "text-green-400" : "text-blue-300"}>Progress</span>
            <span className={isFinished ? "text-green-400" : "text-blue-300"}>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-300 relative ${isFinished ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
              style={{ width: `${progress}%` }}
            >
                {!isFinished && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* 4. 터미널 로그 창 */}
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-56 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4 text-gray-400 border-b border-white/5 pb-2 shrink-0">
                <Terminal size={16} />
                <span className="text-xs font-mono">System Output</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm custom-scrollbar scroll-smooth">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        {log.status === 'success' ? 
                            <CheckCircle2 size={14} className="text-green-500 shrink-0" /> : 
                            <Loader2 size={14} className="text-blue-500 animate-spin shrink-0" />
                        }
                        <span className="text-gray-300 text-xs">
                            <span className="text-blue-500/50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {log.msg}
                        </span>
                    </div>
                ))}
                
                {!isFinished && (
                    <div className="flex items-center gap-3 opacity-50">
                        <Loader2 size={14} className="text-gray-500 animate-spin shrink-0" />
                        <span className="text-gray-500 text-xs">Processing...</span>
                    </div>
                )}
            </div>
        </div>

        {/* 5. 하단 액션 버튼 */}
        <div className="flex gap-4 mt-2">
            <button 
                onClick={onComplete}
                disabled={!isFinished}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                    ${isFinished 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 text-white cursor-pointer' 
                        : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                    }`}
            >
                {isFinished ? <CheckCircle2 size={18} /> : <Loader2 size={18} className="animate-spin" />}
                Open Project
            </button>

            <button 
                onClick={onComplete} 
                className="px-8 py-3 rounded-xl font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-all active:scale-95 hover:text-white"
            >
                Cancel
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProcessingView;