# AERANGHAE-CLIENT 
자연어 프롬프트와 기술 스택 선택을 통해 프로젝트 뼈대 코드를 자동 생성하는 플랫폼

---

### ⚙️ Tech Stack
* **Core**: React, TypeScript, Vite
* **Desktop**: Electron
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide-React
* **Auth**: Google OAuth 2.0 (`@react-oauth/google`)
* **API**: Axios (Connect to Port 8080)

---

### 📂 Directory Structure
```text
aeranghae-client/
├── electron/
│   └── main.ts         # Electron 메인 프로세스 (창 크기 1280x850 고정)
├── src/
│   ├── assets/         # CSS(index.css) 및 정적 자원
│   ├── components/
│   │   └── Sidebar.tsx # 공통 사이드바 내비게이션
│   ├── pages/
│   │   ├── Dashboard.tsx      # 프로젝트 대시보드
│   │   ├── CreateProject.tsx  # AI 프로젝트 생성 인터페이스
│   │   ├── Library.tsx        # 생성된 프로젝트 목록
│   │   ├── Login.tsx          # 구글 로그인 및 닉네임 설정
│   │   ├── Settings.tsx       # 시스템 설정
│   │   └── ProcessingView.tsx # 코드 생성 대기 화면
│   └── App.tsx         # 전체 레이아웃 및 배경 애니메이션 제어
