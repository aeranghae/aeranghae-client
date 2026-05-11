import React, { useState } from 'react';
import { Cpu, Layout, HardDrive, Save, CheckCircle2, Sparkles, BrainCircuit, BotMessageSquare, Brain, Trash2, Bell } from 'lucide-react';

const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: <Sparkles size={22} />, description: '속도와 품질의 완벽한 밸런스' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5', provider: 'Anthropic', icon: <BrainCircuit size={22} />, description: '코딩 및 논리 추론 특화' },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: <BotMessageSquare size={22} />, description: '대규모 컨텍스트 처리' },
  { id: 'llama-3-1', name: 'Llama 3.1', provider: 'Meta', icon: <Brain size={22} />, description: '강력한 오픈소스 모델' },
];

const Settings: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o');
  const storedName = localStorage.getItem('aeranghae_user_name') || 'Guest';
  const [userName, setUserName] = useState(storedName);

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-700">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-400 text-sm">시스템 환경 및 AI 생성 규칙을 관리합니다.</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
        <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col min-h-0">
          <h3 className="text-base font-bold flex items-center gap-2 mb-4 shrink-0">
            <Cpu size={20} className="text-purple-400" /> AI Engine Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto pr-1">
            {AI_MODELS.map((model) => (
              <button key={model.id} onClick={() => setSelectedModelId(model.id)} className={`flex items-center gap-4 p-4 rounded-[22px] border transition-all ${selectedModelId === model.id ? 'bg-blue-600/15 border-blue-500 shadow-md' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                <div className={`p-2.5 rounded-xl shrink-0 ${selectedModelId === model.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>{model.icon}</div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-sm">{model.name}</h4>
                  <p className="text-[11px] text-gray-500">{model.provider}</p>
                </div>
                {selectedModelId === model.id && <CheckCircle2 size={18} className="text-blue-400 ml-2" />}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6 shrink-0">
          <section className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2"><Layout size={20} className="text-blue-400" /> Project Defaults</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Current User</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500/50" />
              </div>
              <div className="flex items-center justify-between p-2 bg-black/20 rounded-xl">
                <span className="text-xs text-gray-300 ml-1 flex items-center gap-2"><Bell size={14}/> Completion Sound</span>
                <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between">
            <h3 className="text-base font-bold mb-2 flex items-center gap-2"><HardDrive size={20} className="text-orange-400" /> Maintenance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div><p className="text-2xl font-bold">128 MB</p><p className="text-[10px] text-gray-500 uppercase">AI Logs & Cache</p></div>
                <button className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
              </div>
              <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                <Save size={16} fill="white" /> Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;