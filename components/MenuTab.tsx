import React, { useState } from 'react';
import { Copy, Download, Upload, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { generateSaveCode, parseSaveCode } from '../utils/storage';

interface MenuTabProps {
  currentState: any;
  onLoadGame: (state: any) => void;
  onResetGame: () => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({ currentState, onLoadGame, onResetGame }) => {
  const [saveCode, setSaveCode] = useState('');
  const [loadInput, setLoadInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleGenerateCode = () => {
    const code = generateSaveCode(currentState);
    setSaveCode(code);
    setCopySuccess(false);
  };

  const handleCopy = () => {
    if (!saveCode) return;
    navigator.clipboard.writeText(saveCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleLoad = () => {
    if (!loadInput.trim()) return;
    const state = parseSaveCode(loadInput.trim());
    if (state) {
      if (confirm('현재 진행 상황을 덮어쓰고 불러오시겠습니까?')) {
        onLoadGame(state);
        setLoadInput('');
        setLoadError(false);
        alert('게임이 성공적으로 로드되었습니다!');
      }
    } else {
      setLoadError(true);
    }
  };

  const handleReset = () => {
    if (confirm('정말로 게임을 처음부터 다시 시작하시겠습니까?\n모든 진행 상황이 삭제됩니다.')) {
      onResetGame();
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">메뉴</h2>

      {/* Save Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Download size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">게임 저장 (코드 발급)</h3>
            <p className="text-xs text-gray-500">현재 상태를 코드로 저장하여 보관하세요.</p>
          </div>
        </div>

        {saveCode ? (
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">아래 코드를 복사해서 보관하세요:</p>
            <div className="bg-white p-2 rounded border border-gray-100 text-[10px] font-mono break-all max-h-24 overflow-y-auto mb-2 text-gray-600">
              {saveCode}
            </div>
            <button 
              onClick={handleCopy}
              className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                copySuccess ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {copySuccess ? <><Check size={16} /> 복사 완료!</> : <><Copy size={16} /> 코드 복사하기</>}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGenerateCode}
            className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors"
          >
            저장 코드 생성하기
          </button>
        )}
      </div>

      {/* Load Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Upload size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">이어하기 (코드 입력)</h3>
            <p className="text-xs text-gray-500">보관해둔 코드를 입력하여 복구합니다.</p>
          </div>
        </div>

        <textarea 
          value={loadInput}
          onChange={(e) => {
            setLoadInput(e.target.value);
            setLoadError(false);
          }}
          placeholder="여기에 저장 코드를 붙여넣으세요..."
          className={`w-full h-24 p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all ${
            loadError ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-purple-200 bg-gray-50'
          }`}
        />
        
        {loadError && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertTriangle size={12} /> 올바르지 않은 코드입니다.
          </p>
        )}

        <button 
          onClick={handleLoad}
          disabled={!loadInput.trim()}
          className="w-full mt-3 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          게임 불러오기
        </button>
      </div>

      {/* Reset Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <RefreshCw size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">게임 초기화</h3>
            <p className="text-xs text-gray-500">처음부터 다시 시작합니다.</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="w-full py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        SmartThings Treasure Hunt v1.0<br/>
        Browser Storage Mode: In-Memory (Secure)
      </div>
    </div>
  );
};