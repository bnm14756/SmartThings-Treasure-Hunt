
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface MenuTabProps {
  currentState: any;
  onLoadGame: (state: any) => void;
  onResetGame: () => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({ onResetGame }) => {
  const handleReset = () => {
    if (confirm('정말로 게임을 처음부터 다시 시작하시겠습니까?')) {
      onResetGame();
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">메뉴</h2>

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
        Virtual Experience
      </div>
    </div>
  );
};
