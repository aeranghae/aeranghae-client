import axios from 'axios';


const BASE_URL = 'https://oxxultus.cloud';

//타입스크립트 인터페이스 정의 (ProjectDetail에서 깨지지 않게 규격 유지)
export interface ProjectNode {
  name: string;
  type: 'DIRECTORY' | 'FILE';
  path?: string;
  children?: ProjectNode[];
}

export const storageService = {
  
  /**
   * 1. 특정 프로젝트의 1차원 파일 트리 구조 가져오기 (GET)
   * URL 규격: GET https://oxxultus.cloud/api/storage/projects/{projectUuid}/tree
   */
  getProjectTree: async (projectUuid: string): Promise<any[]> => {
    // 로컬 주머니에서 싱싱한 토큰 꺼내기
    const token = localStorage.getItem('aeranghae_token');
    const requestUrl = `${BASE_URL}/api/storage/projects/${projectUuid}/tree`;
    
    //  ===== 디버그 로그 START =====
    console.group("🔍 [storageService.getProjectTree] 디버그 정보");
    console.log("📍 요청 URL:", requestUrl);
    console.log("🆔 Project UUID:", projectUuid);
    console.log("🔑 토큰 존재 여부:", token ? "✅ 있음" : "❌ 없음");
    if (token) {
      console.log("🔑 토큰 미리보기:", `${token.substring(0, 30)}...${token.substring(token.length - 10)}`);
      console.log("🔑 토큰 전체 길이:", token.length);
      
      // JWT 형식이면 payload 디코딩 시도 (만료 시간 등 확인용)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("📦 JWT Payload 디코딩:", payload);
          
          if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            const isExpired = expDate < now;
            console.log("⏰ 토큰 만료 시각:", expDate.toLocaleString());
            console.log("⏰ 현재 시각:", now.toLocaleString());
            console.log(isExpired ? "🚨 토큰 만료됨!" : "✅ 토큰 유효함");
          }
        } else {
          console.log("ℹ️ JWT 형식이 아닌 토큰 (segment 수:", parts.length, ")");
        }
      } catch (decodeErr) {
        console.log("⚠️ JWT 디코딩 실패 (JWT가 아닐 수 있음):", decodeErr);
      }
    }
    console.log("👤 저장된 사용자 이름:", localStorage.getItem('aeranghae_user_name') || "❌ 없음");
    console.groupEnd();
    // 🔍 ===== 디버그 로그 END =====
    
    try {
      //무한 Retry 인터셉터나 재시도 함수 없이, 깔끔하게 단발성으로 딱 한 번만 요청
      const response = await axios.get(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // ===== 성공 응답 디버그 START =====
      console.group("✅ [storageService.getProjectTree] 응답 성공");
      console.log("📊 Status:", response.status);
      console.log("📊 Status Text:", response.statusText);
      console.log("📦 Response Headers:", response.headers);
      console.log("📦 Response Data 타입:", Array.isArray(response.data) ? "Array" : typeof response.data);
      console.log("📦 Response Data 길이:", Array.isArray(response.data) ? response.data.length : "N/A");
      console.log("📦 Response Data 전체:", response.data);
      
      // 데이터 샘플 출력 (처음 3개만)
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("📦 Data 샘플 (처음 3개):", response.data.slice(0, 3));
      }
      console.groupEnd();
      // 🔍 ===== 성공 응답 디버그 END =====
      
      // 서버가 준 순수 flat 배열 데이터를 그대로 리턴
      return response.data;
      
    } catch (error: any) {
      // 🔍 ===== 에러 상세 디버그 START =====
      console.group(`❌ [storageService.getProjectTree] 요청 실패 (UUID: ${projectUuid})`);
      console.error("💥 에러 메시지:", error.message);
      console.error("💥 에러 코드:", error.code);
      
      if (error.response) {
        // 서버가 응답은 했지만 에러 상태코드인 경우 (가장 흔한 케이스)
        console.error("📊 응답 Status:", error.response.status);
        console.error("📊 응답 StatusText:", error.response.statusText);
        console.error("📦 응답 Headers:", error.response.headers);
        console.error("📦 응답 Body (백엔드가 보낸 에러 메시지):", error.response.data);
        
        // 백엔드 에러 메시지가 객체면 더 자세히 까보기
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          console.error("📦 응답 Body (JSON):", JSON.stringify(error.response.data, null, 2));
        }
        
        // 상태코드별 친절한 해설
        switch (error.response.status) {
          case 400:
            console.error("💡 해석: 잘못된 요청 - URL 형식이나 파라미터를 확인하세요.");
            break;
          case 401:
            console.error("💡 해석: 인증 실패 - 토큰이 없거나 만료/위조되었습니다.");
            break;
          case 403:
            console.error("💡 해석: 권한 없음 - 토큰은 유효하지만 이 리소스에 접근할 권한이 없습니다.");
            console.error("💡 체크: 이 프로젝트 UUID가 현재 로그인 유저 소유인지 백엔드에서 확인 필요.");
            break;
          case 404:
            console.error("💡 해석: 리소스 없음 - 이 UUID의 프로젝트가 DB에 존재하지 않습니다.");
            break;
          case 500:
            console.error("💡 해석: 서버 내부 오류 - 백엔드 로그를 확인해야 합니다.");
            break;
        }
      } else if (error.request) {
        // 요청은 보냈는데 응답이 없는 경우 (네트워크/CORS 등)
        console.error("📡 요청은 전송됐으나 응답을 받지 못함 (네트워크 또는 CORS 의심)");
        console.error("📡 Request:", error.request);
      } else {
        // 요청 자체를 못 만든 경우
        console.error("⚙️ 요청 객체 생성 실패");
      }
      
      // 요청 시 실제로 어떤 헤더가 나갔는지 확인 (Authorization 헤더 검증용)
      if (error.config) {
        console.error("📤 실제 요청에 사용된 설정:");
        console.error("   - URL:", error.config.url);
        console.error("   - Method:", error.config.method);
        console.error("   - Headers:", error.config.headers);
        
        // Authorization 헤더가 실제로 실렸는지 확인
        const authHeader = error.config.headers?.Authorization;
        if (authHeader) {
          console.error("   - Authorization 헤더 길이:", authHeader.length);
          console.error("   - Authorization 미리보기:", `${authHeader.substring(0, 30)}...`);
        } else {
          console.error("   - 🚨 Authorization 헤더가 누락되었습니다!");
        }
      }
      console.groupEnd();
      // 🔍 ===== 에러 상세 디버그 END =====
      
      throw error; 
    }
  },

//   /**
//    * 📄 2. 특정 파일 내용 실시간 조회 (GET)
//    * URL 규격: GET https://oxxultus.cloud/api/storage/projects/{uuid}/file-content?path=src/Main.java
//    */
//   getFileContent: async (projectUuid: string, path: string): Promise<string> => {
//     const token = localStorage.getItem('aeranghae_token');
//     const requestUrl = `${BASE_URL}/api/storage/projects/${projectUuid}/file-content`;
    
//     // 🔍 디버그 로그
//     console.group("🔍 [storageService.getFileContent] 디버그 정보");
//     console.log("📍 요청 URL:", requestUrl);
//     console.log("📂 파일 경로:", path);
//     console.log("🆔 Project UUID:", projectUuid);
//     console.log("🔑 토큰 존재 여부:", token ? "✅ 있음" : "❌ 없음");
//     console.groupEnd();
    
//     try {
//       const response = await axios.get(requestUrl, {
//         params: { path: path },
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         responseType: 'text' // 백엔드가 JSON이 아닌 생 텍스트(String)를 주므로 text 타입으로 가로챕니다.
//       });
      
//       // 🔍 성공 로그
//       console.group("✅ [storageService.getFileContent] 응답 성공");
//       console.log("📊 Status:", response.status);
//       console.log("📦 응답 데이터 길이:", typeof response.data === 'string' ? response.data.length : "N/A");
//       console.log("📦 응답 데이터 미리보기:", typeof response.data === 'string' ? response.data.substring(0, 200) : response.data);
//       console.groupEnd();
      
//       return response.data;
      
//     } catch (error: any) {
//       // 🔍 에러 로그
//       console.group(`❌ [storageService.getFileContent] 요청 실패 (Path: ${path})`);
//       console.error("💥 에러 메시지:", error.message);
      
//       if (error.response) {
//         console.error("📊 응답 Status:", error.response.status);
//         console.error("📦 응답 Body:", error.response.data);
//       }
      
//       if (error.config) {
//         console.error("📤 실제 요청에 사용된 헤더:", error.config.headers);
//       }
//       console.groupEnd();
      
//       throw error;
//     }
//   }
};