import React from 'react';
import { Home, Grid, HeartPulse, PlayCircle, Menu } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home className="w-6 h-6" /> },
    { id: 'devices', label: '기기', icon: <Grid className="w-6 h-6" /> },
    { id: 'life', label: '라이프', icon: <HeartPulse className="w-6 h-6" /> },
    { id: 'automation', label: '자동화', icon: <PlayCircle className="w-6 h-6" /> },
    { id: 'menu', label: '메뉴', icon: <Menu className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50 pb-safe">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};