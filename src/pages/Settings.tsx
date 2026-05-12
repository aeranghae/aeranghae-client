import React, { useState } from 'react';
import axios from 'axios';
import { Cpu, Layout, HardDrive, Save, CheckCircle2, Sparkles, BrainCircuit, BotMessageSquare, Bell, Trash2 } from 'lucide-react';

const AI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: <Sparkles size={22} /> },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5', provider: 'Anthropic', icon: <BrainCircuit size={22} /> },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: <BotMessageSquare size={22} /> },
];

const Settings: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o');
  const [userName, setUserName] = useState(localStorage.getItem('aeranghae_user_name') || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('aeranghae_token');
    if (!token) return alert("로그인이 필요한 기능입니다.");
    if (!userName.trim()) return alert("닉네임을 입력해주세요.");

    setIsSaving(true);
    try {
      // 
      await axios.patch('https://oxxultus.cloud/api/user/nickname', 
        { nickname: userName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 최신 정보 동기화 요청
      const res = await axios.get('https://oxxultus.cloud/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedName = res.data.name || res.data.nickname;
      if (updatedName) {
        localStorage.setItem('aeranghae_user_name', updatedName);
        alert("설정이 정식으로 저장되었습니다! 🎉");
        window.location.href = "/"; // 메인으로 이동하며 사이드바 등 전체 갱신
      }
    } catch (error: any) {
      console.error("PATCH 요청 에러:", error.response?.data);
      alert("변경에 실패했습니다. (CORS 또는 서버 오류 확인 필요)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-700 font-sans text-white">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Settings</h1>
        <p className="text-gray-400 text-sm">시스템 환경 및 사용자 프로필을 관리합니다.</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
        {/* AI 엔진 섹션 */}
        <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col min-h-0">
          <h3 className="text-base font-bold flex items-center gap-2 mb-4 shrink-0">
            <Cpu size={20} className="text-purple-400" /> AI Engine
          </h3>
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            {AI_MODELS.map((model) => (
              <button 
                key={model.id} 
                onClick={() => setSelectedModelId(model.id)} 
                className={`flex items-center gap-4 p-4 rounded-[22px] border transition-all ${
                  selectedModelId === model.id 
                  ? 'bg-blue-600/15 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                  : 'bg-black/20 border-white/5 hover:bg-white/5'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${selectedModelId === model.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {model.icon}
                </div>
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
          {/* 유저 프로필 섹션 */}
          <section className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Layout size={20} className="text-blue-400" /> User Profile
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Nickname</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600" 
                />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl opacity-50 select-none">
                <span className="text-xs text-gray-300 ml-1 flex items-center gap-2">
                  <Bell size={14}/> Sound Alerts
                </span>
                <div className="w-8 h-4 bg-gray-600 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/50 rounded-full" />
                </div>
              </div>
            </div>
          </section>

          {/* 메인터넌스 및 저장 버튼 섹션 */}
          <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between">
            <h3 className="text-base font-bold mb-2 flex items-center gap-2">
              <HardDrive size={20} className="text-orange-400" /> Maintenance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold tracking-tight">128 MB</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">AI Cache Memory</p>
                </div>
                <button className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  isSaving 
                  ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-600/20'
                }`}
              >
                <Save size={16} fill="currentColor" />
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;