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
  },

  //유저 이름 변경(PATCH)
  updateNickname: async (nickname: string) => {
    try {
      //두 번째 인자로 Body 데이터({ nickname })를 넘겨줌
      const response = await API.patch('/api/user/nickname', { nickname });
      return response.data;
    } catch (error) {
      console.error("닉네임 변경 API 에러:", error);
      throw error;
    }
  }
};