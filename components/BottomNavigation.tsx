
import React from 'react';
import { Home, Grid, HeartPulse, PlayCircle, Menu } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home size={24} /> },
    { id: 'devices', label: '기기', icon: <Grid size={24} /> },
    { id: 'life', label: '라이프', icon: <HeartPulse size={24} /> },
    { id: 'automation', label: '자동화', icon: <PlayCircle size={24} /> },
    { id: 'menu', label: '메뉴', icon: <Menu size={24} /> },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.icon}
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
