import axios from 'axios';

//ProjectCreateRequestDto 규격에 맞춘 타입 정의
export interface ProjectCreateRequestDto {
  projectName: string;
  framework: string;
  language: string;
  license: string;
  model: string;
  prompt: string;
}

//ProjectResponseDto 규격에 맞춘 타입 정의
export interface ProjectResponseDto {
  projectName: string;
  uuid: string;
  model: string;
  createdAt: string;
  lastModified: string;
  size: number;
  fileCount: number;
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
  },

  //프로젝트 전체 목록 조회 (GET)
  getProjects: async (): Promise<ProjectResponseDto[]> => {
    try {
      const response = await API.get('/api/storage/projects');
      return response.data; // List<ProjectResponseDto> 형태의 배열 데이터 반환
    } catch (error) {
      console.error("프로젝트 목록 조회 에러:", error);
      throw error;
    }
  },

  //프로젝트 이름 변경(PATCH)
  updateProjectName: async (uuid: string, newName: string) => {
    try {
      // URL 경로에 uuid를 넣고, Body에 newName을 JSON으로 전달
      const response = await API.patch(`/api/storage/projects/${uuid}`, {
        newName: newName
      });
      return response.data;
    } catch (error) {
      console.error("프로젝트 이름 변경 API 에러:", error);
      throw error;
    }
  },

  //프로젝트 삭제(DELETE)
  deleteProject: async (uuid: string) => {
    try {
      // URL 경로에 uuid를 실어서 DELETE 요청을 보냅니다. Body 데이터는 필요 없습니다.
      const response = await API.delete(`/api/storage/projects/${uuid}`);
      return response.data;
    } catch (error) {
      console.error("프로젝트 삭제 API 에러:", error);
      throw error;
    }
  }
};
