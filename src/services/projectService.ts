import axios from 'axios';

//DTO 규격에 맞춘 타입 정의
export interface ProjectCreateRequestDto {
  projectName: string;
  framework: string;
  language: string;
  license: string;
  model: string;
  prompt: string;
}

//서버 주소
const BACKEND_URL = 'https://oxxultus.cloud'; 

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//요청 보내기 직전에 토큰을 헤더에 삽입
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('aeranghae_token'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const projectService = {
  /*프로젝트 생성 요청*/
  generateProject: async (data: ProjectCreateRequestDto) => {
    try {
      const response = await API.post('/api/project/projects/generate', data);
      return response.data;
    } catch (error) {
      console.error("프로젝트 생성 API 에러:", error);
      throw error;
    }
  }
};