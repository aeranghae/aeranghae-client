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