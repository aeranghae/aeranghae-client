import React from 'react';
import { Play, Code, Clock, BarChart3, ChevronRight, Layout, Cpu, Zap, BookOpenText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardProps {
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveMenu }) => {
  // 통계 데이터
  const stats = [
    { label: '전체 프로젝트', value: '12', icon: <Layout size={18} />, color: 'text-blue-400' },
    { label: '시스템 상태', value: '정상', icon: <Cpu size={18} />, color: 'text-green-400' },
  ];

  // 기술 스택 데이터
  const techStackData = [
    { name: 'Node.js', value: 10, color: '#8b5cf6' },
    { name: 'Python', value: 15, color: '#f59e0b' },
    { name: 'React', value: 45, color: '#3b82f6' },
    { name: 'Spring Boot', value: 30, color: '#10b981' },
  ];

  const recentProjects = [
    { id: 1, name: '지능형 이커머스 플랫폼', tech: 'React, Spring Boot', date: '2시간 전' },
    { id: 2, name: 'AI 이미지 분석 엔진', tech: 'Python, FastAPI', date: '어제' },
    { id: 3, name: '사내 관리자 대시보드', tech: 'React, Node.js', date: '3일 전' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-700 select-none">
      
      {/* 1. 상단 영역 (순서: 프로젝트 -> 상태 -> 기술 스택 확장) */}
      <div className="grid grid-cols-12 gap-6 mb-8 shrink-0">
        
        {/* 첫 번째: 전체 프로젝트 (3칸 차지) */}
        <div className="col-span-3 bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-md flex items-center justify-between group hover:bg-white/[0.07] transition-all h-[140px]">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{stats[0].label}</p>
            <h3 className="text-2xl font-black tracking-tight">{stats[0].value}</h3>
          </div>
          <div className={`p-3 rounded-2xl bg-white/5 ${stats[0].color}`}>{stats[0].icon}</div>
        </div>

        {/* 두 번째: 시스템 상태 (3칸 차지) */}
        <div className="col-span-3 bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-md flex items-center justify-between group hover:bg-white/[0.07] transition-all h-[140px]">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{stats[1].label}</p>
            <h3 className="text-2xl font-black tracking-tight">{stats[1].value}</h3>
          </div>
          <div className={`p-3 rounded-2xl bg-white/5 ${stats[1].color}`}>{stats[1].icon}</div>
        </div>

        {/* 세 번째: [크기 확장] 기술 스택 분포 (6칸 차지 - 2배 넓음) */}
        <div className="col-span-6 bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-md flex items-center shadow-xl h-[140px]">
          <div className="shrink-0 flex flex-col gap-1 ml-2 mr-8">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BookOpenText size={16} className="text-purple-400" /> 기술 스택 분포
            </h3>
            <p className="text-[10px] text-gray-500 font-medium">최근 프로젝트 사용 비율</p>
          </div>
          
          <div className="flex-1 h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={techStackData} 
                  cx="50%" cy="50%" 
                  innerRadius={35} 
                  outerRadius={48} 
                  paddingAngle={5} 
                  dataKey="value" 
                  cornerRadius={6}
                >
                  {techStackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="circle" 
                  iconSize={8} 
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingLeft: '30px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            {/* 차트 중앙 텍스트 */}
            <div className="absolute top-1/2 left-[39%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[11px] font-black text-blue-400">React</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* 2. 최근 프로젝트 목록 (왼쪽) */}
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="flex justify-between items-end mb-5 px-1">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">최근 프로젝트</h3>
              <p className="text-xs text-gray-500 mt-1">최근에 작업한 AI 설계 내역입니다.</p>
            </div>
            <button onClick={() => setActiveMenu('create')} className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-xs font-bold transition-all active:scale-95">
              + 새 프로젝트 생성
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {recentProjects.map((project) => (
              <div key={project.id} className="bg-white/5 border border-white/5 p-5 rounded-[24px] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                    <Code size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{project.tech} <span className="mx-2 text-white/10">|</span> {project.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">열기</span>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 활동 피드 (오른쪽) */}
        <div className="col-span-4 flex flex-col min-h-0">
          <div className="mb-5 px-1">
            <h3 className="text-xl font-bold flex items-center gap-2">활동 피드</h3>
            <p className="text-xs text-gray-500 mt-1">AI 에이전트의 작업 로그</p>
          </div>
          
          <div className="flex-1 bg-black/20 border border-white/10 rounded-[32px] p-6 overflow-hidden flex flex-col shadow-inner">
            <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
              {[
                { text: "AI 에이전트가 **인증 모듈** 생성을 성공적으로 완료했습니다.", time: "14:20:05", type: "success" },
                { text: "프로젝트 **'이미지 분석 엔진'**의 의존성 라이브러리를 업데이트했습니다.", time: "13:45:12", type: "info" },
                { text: "새로운 기술 스택 **FastAPI**가 시스템에 추가되었습니다.", time: "11:30:00", type: "system" },
                { text: "사용자 **Hyoju**님이 새로운 프로젝트 설계를 시작했습니다.", time: "09:15:22", type: "user" },
                { text: "데이터베이스 스키마 자동 설계가 완료되었습니다.", time: "어제", type: "success" }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)] ${
                    log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-[12px] text-gray-300 leading-relaxed font-medium">
                      {log.text.split('**').map((part, index) => 
                        index % 2 === 1 ? <b key={index} className="text-blue-400 font-bold">{part}</b> : part
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-600 font-mono tracking-tighter">{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;