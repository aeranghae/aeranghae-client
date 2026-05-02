import React, { useState } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  // 로그인 단계 관리: 'login' (구글 버튼) -> 'signup' (닉네임 입력)
  const [step, setStep] = useState<'login' | 'signup'>('login');
  const [userData, setUserData] = useState({ name: '', nickname: '' });

  // 1. 구글 로그인 핸들러 (팀원 코드의 handleLoginSuccess 로직)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 주의: 팀원 코드는 @react-oauth/google의 기본 버튼(credential) 기준이었으나, 
        // 커스텀 버튼(useGoogleLogin)은 access_token을 넘겨주는 경우가 많습니다. 
        // 백엔드 엔드포인트에 맞게 전달 데이터를 확인하세요.
        const response = await axios.post('http://localhost:8080/api/auth/google', {
          accessToken: tokenResponse.access_token
        });

        const { accessToken, name } = response.data;
        localStorage.setItem('aeranghae_token', accessToken);
        
        setUserData({ ...userData, name });
        setStep('signup'); // 닉네임 입력 단계로 전환
      } catch (error) {
        console.error("로그인 에러:", error);
        alert("로그인 중 오류가 발생했습니다.");
      }
    },
    onError: () => console.error('Google Login Failed'),
  });

  // 2. 닉네임 설정 핸들러 (팀원 코드의 handleSignupSubmit 로직)
  const handleSignupSubmit = async () => {
    const token = localStorage.getItem('aeranghae_token');
    try {
      await axios.post(
        'http://localhost:8080/api/user/signup',
        { nickname: userData.nickname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`${userData.name}님, 설정이 완료되었습니다!`);
      onClose();
      window.location.reload(); // 대시보드로 진입하기 위해 새로고침
    } catch (error) {
      console.error("가입 에러:", error);
      alert("닉네임 설정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      
      <div className="relative w-[768px] h-[480px] bg-[#1C1C1E] rounded-[30px] overflow-hidden shadow-2xl shadow-black/50 border border-white/5 flex">
        
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all">
          <X size={20} />
        </button>

        {/* 왼쪽: 브랜드 섹션 (디자인 고정) */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-white">AERANGHAE</h1>
            <p className="text-base opacity-90 leading-relaxed font-medium text-white max-w-[240px]">
              아이디어를 실제 코드로 바꾸는 가장 스마트한 방법
            </p>
            <div className="mt-10 flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 uppercase">
                <Sparkles size={14} /> AI Powered Platform
            </div>
        </div>

        {/* 오른쪽: 로그인/회원가입 액션 섹션 */}
        <div className="flex-1 bg-[#1C1C1E] p-12 flex flex-col justify-center items-center">
          
          {step === 'login' ? (
            <div className="w-full max-w-[280px] text-center animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Welcome</h2>
              <p className="text-gray-400 text-sm mb-10">Google 계정으로 간편하게 시작하세요.</p>

              <button 
                onClick={() => loginWithGoogle()}
                className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-4 font-semibold text-white shadow-xl active:scale-[0.98]"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
                Google로 로그인
              </button>
            </div>
          ) : (
            <div className="w-full max-w-[280px] text-center animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
              <p className="text-gray-400 text-sm mb-8">{userData.name}님, 사용할 닉네임을 알려주세요.</p>

              <div className="space-y-4">
                <input 
                  type="text" 
                  value={userData.nickname}
                  onChange={(e) => setUserData({...userData, nickname: e.target.value})}
                  placeholder="닉네임 입력" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button 
                  onClick={handleSignupSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <CheckCircle size={18} /> 설정 완료하기
                </button>
              </div>
            </div>
          )}

          <p className="absolute bottom-10 text-[10px] text-gray-600 text-center px-12">
            AERANGHAE는 안전한 구글 인증을 사용하며 개인정보를 소중히 다룹니다.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;