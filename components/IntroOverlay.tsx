
import React, { useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const introSteps = [
    { text: "큰일 났어! 이번 달 관리비 고지서 봤어?", icon: "🧾" },
    { text: "전기 요금이 평소보다 2배나 많이 나왔어...", icon: "💸" },
    { text: "하지만 걱정 마! 우리에겐 SmartThings가 있잖아!", icon: "🏠" },
    { text: "집 안의 기기들을 연결하면 에너지를 아낄 수 있어.", icon: <Zap color="#ffcc00" fill="currentColor" size={40} /> },
    { text: "나랑 같이 집 안을 돌아다니며 기기들을 찾아보자!", icon: "🏃" }
  ];

  const handleNext = () => {
    if (step < introSteps.length - 1) setStep(prev => prev + 1);
    else onComplete();
  };

  const currentStep = introSteps[step];

  return (
    <div className="modal-overlay" onClick={handleNext}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 360, overflow: 'hidden' }}>
        <div style={{ height: 160, background: '#f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
           {currentStep.icon}
        </div>
        <div style={{ padding: 24, position: 'relative' }}>
          <span style={{ position: 'absolute', top: -12, left: 24, background: '#007aff', color: 'white', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 'bold' }}>블루밍</span>
          <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, color: '#333' }}>{currentStep.text}</p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', color: '#8e8e93', fontSize: 12, alignItems: 'center' }}>
            터치해서 계속 <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
