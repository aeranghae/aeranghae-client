import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react'; // 아이콘 추가
import { GoogleLogin } from '@react-oauth/google'; 
import axios from 'axios';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [step, setStep] = useState<'login' | 'signup' | 'already_logged_in'>('login');
  const [userData, setUserData] = useState({ name: '', nickname: '' });

  const API_BASE_URL = 'https://oxxultus.cloud'; 

  // 컴포넌트 로드 시 로그인 상태 체크 (자동 이동 제거)
  useEffect(() => {
    const token = localStorage.getItem('aeranghae_token');
    const userName = localStorage.getItem('aeranghae_user_name');

    if (token && userName) {
      setUserData(prev => ({ ...prev, nickname: userName }));
      setStep('already_logged_in');
      
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });

      const { accessToken, name, nickname, isNewUser } = response.data;
      localStorage.setItem('aeranghae_token', accessToken);

      /* 백엔드 필드 추가 시 주석 해제 로직
      if (nickname || isNewUser === false) {
        localStorage.setItem('aeranghae_user_name', nickname || name);
        setUserData({ ...userData, nickname: nickname || name });
        setStep('already_logged_in');
        return;
      }
      */

      localStorage.setItem('aeranghae_user_name', name);
      setUserData({ ...userData, name });
      setStep('signup'); 
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("인증에 실패했습니다.");
    }
  };

  const handleSignupSubmit = async () => {
    const token = localStorage.getItem('aeranghae_token');
    if (!userData.nickname.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/api/user/signup`, 
        { nickname: userData.nickname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.setItem('aeranghae_user_name', userData.nickname);
      alert(`${userData.nickname}님, 환영합니다!`);
      onClose();
      window.location.reload(); 
    } catch (error) {
      alert("닉네임 설정 중 오류 발생");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none font-sans text-white">
      <div className="relative w-[768px] h-[480px] bg-[#1C1C1E] rounded-[30px] overflow-hidden shadow-2xl border border-white/5 flex">
        
        {/* 우측 상단 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all">
          <X size={20} />
        </button>

        {/* 왼쪽 섹션 */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-[32px]">AERANGHAE</h1>
            <p className="text-base opacity-90 leading-relaxed font-medium max-w-[240px]">아이디어를 실제 코드로 바꾸는 가장 스마트한 방법</p>
            <div className="mt-10 flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 uppercase">
                <Sparkles size={14} /> AI Powered Platform
            </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="flex-1 bg-[#1C1C1E] p-12 flex flex-col justify-center items-center">
          
          {step === 'already_logged_in' ? (
            /* ✅ 이미 로그인된 상태 UI (수동 클릭 방식) */
            <div className="w-full max-w-[280px] text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                <ShieldCheck size={40} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                현재 <span className="text-white font-bold">{userData.nickname}</span>님으로<br/>로그인되어 있습니다.
              </p>
              
              {/* 사용자가 직접 눌러서 닫을 수 있는 버튼 */}
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl"
              >
                대시보드로 입장하기 <ArrowRight size={18} className="text-blue-400" />
              </button>
            </div>
          ) : step === 'login' ? (
            /* 로그인 버튼 UI */
            <div className="w-full max-w-[280px] text-center animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Welcome</h2>
              <p className="text-gray-400 text-sm mb-10">Google 계정으로 간편하게 시작하세요.</p>
              <div className="flex justify-center scale-110">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert("인증 실패")} theme="filled_black" shape="pill" />
              </div>
            </div>
          ) : (
            /* 닉네임 설정 UI */
            <div className="w-full max-w-[280px] text-center animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2 text-white font-sans">Almost Done!</h2>
              <p className="text-gray-400 text-sm mb-8">{userData.name}님, 사용할 닉네임을 알려주세요.</p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={userData.nickname}
                  onChange={(e) => setUserData({...userData, nickname: e.target.value})}
                  placeholder="닉네임 입력" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button onClick={handleSignupSubmit} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  <CheckCircle size={18} /> 설정 완료하기
                </button>
              </div>
            </div>
          )}
          
          <p className="absolute bottom-10 text-[10px] text-gray-600 text-center px-12 leading-tight">AERANGHAE는 안전한 구글 인증을 사용하며 개인정보를 소중히 다룹니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;