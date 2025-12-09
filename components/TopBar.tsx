import React from 'react';
import { Menu, X } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="w-full h-14 bg-white shadow-sm flex items-center justify-between px-4 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <X className="w-6 h-6 text-gray-500" />
      </div>
      <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        virtual.smartthings.com
      </div>
      <Menu className="w-6 h-6 text-gray-800" />
    </div>
  );
};