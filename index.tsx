import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// React 초기화 중 발생하는 치명적인 오류를 잡아내기 위한 안전장치
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Fatal React Render Error:", error);
  rootElement.innerHTML = `
    <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f2f2f7; color: #333; text-align: center; padding: 20px;">
      <h2 style="margin-bottom: 10px;">앱 실행 오류</h2>
      <p style="color: #666;">보안 정책으로 인해 앱을 로드할 수 없습니다.<br/>(Storage Access Denied)</p>
    </div>
  `;
}