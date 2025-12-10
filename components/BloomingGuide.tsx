
import React, { useState, useEffect } from 'react';
import { Flower, ChevronRight } from 'lucide-react';

interface BloomingGuideProps {
  lines: string[];
  onClick: () => void;
}

export const BloomingGuide: React.FC<BloomingGuideProps> = ({ lines }) => {
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [lines]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page < lines.length - 1) setPage(prev => prev + 1);
  };

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 16, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', cursor: 'pointer' }} onClick={handleNext}>
      <div className="card animate-bounce" style={{ padding: 12, marginBottom: 8, maxWidth: 240, borderBottomRightRadius: 4, position: 'relative' }}>
         <p style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>{lines[page]}</p>
         <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid #f2f2f7' }}>
            <span style={{ fontSize: 10, color: '#8e8e93' }}>{page + 1} / {lines.length}</span>
            {page < lines.length - 1 && <ChevronRight size={12} color="#007aff" />}
         </div>
      </div>

      <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Flower size={60} color="#007aff" fill="currentColor" strokeWidth={1.5} />
        <div style={{ width: 28, height: 28, background: 'white', borderRadius: '50%', position: 'absolute', zIndex: 10 }}></div>
        <div style={{ position: 'absolute', zIndex: 20, top: '38%', display: 'flex', gap: 2 }}>
             <div style={{ width: 10, height: 10, background: '#ffcc00', borderRadius: '50%' }}></div>
             <div style={{ width: 10, height: 10, background: '#ffcc00', borderRadius: '50%' }}></div>
        </div>
      </div>
    </div>
  );
};
