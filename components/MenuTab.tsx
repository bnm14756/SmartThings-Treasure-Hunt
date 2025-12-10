
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface MenuTabProps {
  currentState: any;
  onLoadGame: (state: any) => void;
  onResetGame: () => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({ onResetGame }) => {
  return (
    <div className="page-container">
      <h2 className="section-title">메뉴</h2>
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={20} />
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold' }}>게임 초기화</h3>
            <p style={{ fontSize: 12, color: '#8e8e93' }}>처음부터 다시 시작합니다.</p>
          </div>
        </div>
        <button 
          onClick={() => confirm('정말 초기화하시겠습니까?') && onResetGame()}
          className="btn w-full"
          style={{ border: '1px solid #fee2e2', color: '#dc2626', background: 'white' }}
        >
          초기화
        </button>
      </div>
      <div className="text-center" style={{ marginTop: 40, color: '#c7c7cc', fontSize: 12 }}>
        SmartThings Treasure Hunt v1.0
      </div>
    </div>
  );
};
