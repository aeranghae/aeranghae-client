import API from './index';

export const userService = {
  //개인 저장소 사용량 조회 (GET)
  getStorageUsage: async () => {
    try {
      const response = await API.get('/api/storage/usage');
      return response.data;
    } catch (error) {
      console.error("저장소 용량 조회 API 에러:", error);
      throw error;
    }
  }
};