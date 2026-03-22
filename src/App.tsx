import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
  // 화면 상태 관리를 위한 변수들
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');

  // 1️⃣ 구글 로그인 성공 시 실행 (토큰 받아서 저장하기)
  const handleLoginSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    
    try {
      // 스프링 부트로 구글 토큰 전송
      const response = await axios.post('http://localhost:8080/api/auth/google', {
        credential: googleToken
      });

      // 스프링이 돌려준 우리만의 JWT 토큰과 정보들
      const { accessToken, name } = response.data;
      
      // 🌟 핵심: 발급받은 JWT 토큰을 브라우저의 '로컬 스토리지'에 저장합니다!
      localStorage.setItem('aeranghae_token', accessToken);
      
      setUserName(name);
      setIsLoggedIn(true); // 로그인 성공 상태로 화면 변경
      alert(`${name}님 환영합니다! 이제 닉네임을 설정해 보세요.`);
      
    } catch (error) {
      console.error("스프링 서버 통신 에러:", error);
      alert("백엔드 서버 통신에 실패했습니다.");
    }
  };

  // 2️⃣ 닉네임 설정(회원가입 완료) 버튼 클릭 시 실행 (헤더에 토큰 싣기)
  const handleSignupSubmit = async () => {
    // 지갑(로컬 스토리지)에서 토큰을 꺼내옵니다.
    const token = localStorage.getItem('aeranghae_token');

    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      return;
    }

    try {
      // 🌟 핵심: API 요청 시 헤더(headers)에 토큰을 'Bearer ' 방식에 맞춰 실어 보냅니다!
      const response = await axios.post(
        'http://localhost:8080/api/user/signup',
        { nickname: nicknameInput }, // 보낼 데이터 (@RequestBody 부분)
        {
          headers: {
            Authorization: `Bearer ${token}` // 문지기에게 보여줄 통행증!
          }
        }
      );

      if (response.data === 'success') {
        alert("닉네임 설정이 완료되었습니다!");
      } else {
        alert("닉네임 설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 API 에러:", error);
      alert("권한이 없거나 서버에 문제가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>애랑해 (AI-ranghae)</h1>
      
      {/* 로그인하지 않은 상태일 때 보여줄 화면 */}
      {!isLoggedIn ? (
        <>
          <p>서비스를 시작하려면 로그인해주세요.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert("구글 로그인 실패")} />
          </div>
        </>
      ) : (
        /* 로그인 성공 후 보여줄 화면 (닉네임 설정) */
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>🎉 {userName}님, 로그인을 환영합니다!</h2>
          <p>서비스에서 사용할 닉네임을 입력해 주세요.</p>
          
          <input 
            type="text" 
            placeholder="새 닉네임 입력" 
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
          />
          <button 
            onClick={handleSignupSubmit}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            닉네임 설정하기
          </button>
        </div>
      )}
    </div>
  )
}

export default App;