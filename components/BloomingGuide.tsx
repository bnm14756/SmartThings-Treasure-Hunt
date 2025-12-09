import React, { useState, useEffect } from 'react';
import { Flower, ChevronRight } from 'lucide-react';

interface BloomingGuideProps {
  lines: string[];
  onClick: () => void;
}

export const BloomingGuide: React.FC<BloomingGuideProps> = ({ lines, onClick }) => {
  const [page, setPage] = useState(0);

  // Reset page when lines change (new mission)
  useEffect(() => {
    setPage(0);
  }, [lines]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page < lines.length - 1) {
      setPage(prev => prev + 1);
    } else {
      // Logic when all pages are read? Currently just stays on last page or triggers parent click if needed
      // For now, we can cycle or just do nothing. Let's create a visual effect.
    }
  };

  return (
    <div 
      className="fixed bottom-20 right-4 z-40 flex flex-col items-end cursor-pointer"
      onClick={handleNext}
    >
      {/* Speech Bubble */}
      <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-lg border border-blue-100 max-w-[260px] mb-2 relative animate-bounce-slow">
         <p className="text-sm text-gray-800 font-medium leading-relaxed min-h-[3rem] flex items-center">
            {lines[page]}
         </p>
         
         {/* Pagination Indicator */}
         <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2">
            <span className="text-[10px] text-gray-400 font-bold">
                {page + 1} / {lines.length}
            </span>
            {page < lines.length - 1 && (
                <div className="text-[10px] text-blue-500 flex items-center animate-pulse">
                    다음 <ChevronRight size={10} />
                </div>
            )}
         </div>

         {/* Tail */}
         <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-b border-r border-blue-100"></div>
      </div>

      {/* Blueming Character */}
      <div className="relative w-16 h-16 flex items-center justify-center transform hover:scale-105 transition-transform">
        {/* Flower Body */}
        <Flower className="w-16 h-16 text-blue-500 absolute drop-shadow-md" fill="currentColor" strokeWidth={1.5} />
        
        {/* Face Background */}
        <div className="w-7 h-7 bg-white rounded-full relative z-10 shadow-inner"></div>
        
        {/* Sunglasses */}
        <div className="absolute z-20 flex gap-0.5 top-[38%]">
             <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border border-orange-300 shadow-sm"></div>
             <div className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border border-orange-300 shadow-sm"></div>
        </div>
        
        {/* Smile */}
        <div className="absolute z-20 w-3 h-1.5 border-b-2 border-gray-400 rounded-full bottom-[35%]"></div>
      </div>
    </div>
  );
};