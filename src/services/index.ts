import axios from 'axios';

const BACKEND_URL = 'https://oxxultus.cloud'; 

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 보내기 직전에 토큰을 헤더에 삽입 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('aeranghae_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; //다른 서비스들이 가져다 쓸 수 있도록 내보내기 