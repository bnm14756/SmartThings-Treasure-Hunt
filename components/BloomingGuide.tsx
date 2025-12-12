import React, { useState, useEffect } from 'react';
import { Flower, ChevronRight, ChevronLeft } from 'lucide-react';

interface BloomingGuideProps {
  lines: string[];
  onClick: () => void;
  onInteract?: () => void; // New prop to signal interaction
}

export const BloomingGuide: React.FC<BloomingGuideProps> = ({ lines, onInteract }) => {
  const [page, setPage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => { 
      setPage(0); 
      setIsVisible(true);
  }, [lines]);

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page < lines.length - 1) {
        setPage(prev => prev + 1);
    } else {
        // Close when finished reading
        setIsVisible(false);
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page > 0) {
        setPage(prev => prev - 1);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(prev => !prev);
    if (onInteract) {
        onInteract();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 16, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isVisible && (
          <div 
            className="card animate-bounce" 
            style={{ 
                padding: 12, 
                marginBottom: 8, 
                maxWidth: 240, 
                borderBottomRightRadius: 4, 
                position: 'relative', 
                cursor: 'pointer' 
            }}
            onClick={handleNextClick}
          >
             <p style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>{lines[page]}</p>
             <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid #f2f2f7' }}>
                <span style={{ fontSize: 10, color: '#8e8e93' }}>{page + 1} / {lines.length}</span>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {/* Previous Button */}
                    <div 
                        onClick={handlePrevClick}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            color: page > 0 ? '#007aff' : '#d1d1d6',
                            cursor: page > 0 ? 'pointer' : 'default',
                            padding: 4
                        }}
                    >
                         <ChevronLeft size={16} />
                    </div>

                    {/* Next Indicator / Button */}
                    {page < lines.length - 1 ? (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#007aff', padding: 4 }}>
                             <ChevronRight size={16} />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#007aff', fontWeight: 'bold', padding: 4 }}>
                            확인
                        </div>
                    )}
                </div>
             </div>
          </div>
      )}

      <div 
        style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleAvatarClick}
      >
        <Flower size={60} color={isVisible ? "#007aff" : "#c7c7cc"} fill="currentColor" strokeWidth={1.5} />
        <div style={{ width: 28, height: 28, background: 'white', borderRadius: '50%', position: 'absolute', zIndex: 10 }}></div>
        <div style={{ position: 'absolute', zIndex: 20, top: '38%', display: 'flex', gap: 2 }}>
             <div style={{ width: 10, height: 10, background: '#ffcc00', borderRadius: '50%' }}></div>
             <div style={{ width: 10, height: 10, background: '#ffcc00', borderRadius: '50%' }}></div>
        </div>
      </div>
    </div>
  );
};