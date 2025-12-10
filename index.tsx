import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  // Clear loading fallback explicitly
  rootElement.innerHTML = '';
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    
    // Slight delay to allow any pending promises/microtasks to settle
    // which might help bypass race conditions with storage shims.
    setTimeout(() => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }, 100);
    
  } catch (error) {
    console.error("Fatal React Initialization Error:", error);
    renderFatalError(rootElement);
  }
}

function renderFatalError(el: HTMLElement) {
  el.innerHTML = `
    <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f2f2f7; color: #333; text-align: center; padding: 20px; font-family: sans-serif;">
      <h2 style="margin-bottom: 10px; font-weight: bold;">앱 실행 오류</h2>
      <p style="color: #666; margin-bottom: 20px;">브라우저 환경 문제로 앱을 로드할 수 없습니다.<br/>(Storage Access Denied)</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007aff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
        다시 시도
      </button>
    </div>
  `;
}
