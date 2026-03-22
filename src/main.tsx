import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
//import './assets/index.css'

// 💡 주의: 스프링 부트 yml에 있던 본인의 구글 클라이언트 ID를 꼭 넣어주세요!
const GOOGLE_CLIENT_ID = "986758242108-u1hbuduva42pe8oqtv60f8hi9s48dolm.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 앱 전체를 GoogleOAuthProvider로 감싸줍니다 */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)