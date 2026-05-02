import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');

  const handleLoginSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;
    try {
      const response = await axios.post('http://localhost:8080/api/auth/google', {
        credential: googleToken
      });
      const { accessToken, name } = response.data;
      localStorage.setItem('aeranghae_token', accessToken);
      
      setUserName(name);
      setIsLoggedIn(true);
      alert(`${name}님 환영합니다!`);
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  const handleSignupSubmit = async () => {
    const token = localStorage.getItem('aeranghae_token');
    try {
      await axios.post(
        'http://localhost:8080/api/user/signup',
        { nickname: nicknameInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("설정 완료!");
      // 여기서 원래는 Dashboard로 이동하는 로직이 들어갈 예정입니다.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      {!isLoggedIn ? (
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => {}} />
      ) : (
        <div>
          <h2>{userName}님 환영합니다!</h2>
          <input 
            value={nicknameInput} 
            onChange={(e) => setNicknameInput(e.target.value)} 
            placeholder="닉네임 입력" 
          />
          <button onClick={handleSignupSubmit}>설정하기</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;