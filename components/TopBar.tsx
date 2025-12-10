
import React from 'react';
import { Menu, X } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div style={{ display: 'flex', gap: '8px' }}>
        <X size={24} color="#8e8e93" />
      </div>
      <div style={{ fontSize: '12px', fontWeight: '500', color: '#8e8e93', background: '#f2f2f7', padding: '4px 12px', borderRadius: '12px' }}>
        virtual.smartthings.com
      </div>
      <Menu size={24} color="#1c1c1e" />
    </div>
  );
};
