import React, { useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const introSteps = [
    {
      text: "큰일 났어! 이번 달 관리비 고지서 봤어?",
      bgColor: "bg-red-50",
      icon: <span className="text-4xl">🧾</span>,
      highlight: true
    },
    {
      text: "전기 요금이 평소보다 2배나 많이 나왔어... 에너지를 너무 낭비했나 봐.",
      bgColor: "bg-gray-50",
      icon: <span className="text-4xl">💸</span>,
      highlight: false
    },
    {
      text: "하지만 걱정 마! 우리에겐 SmartThings가 있잖아!",
      bgColor: "bg-blue-50",
      icon: <span className="text-4xl">🏠</span>,
      highlight: false
    },
    {
      text: "집 안의 기기들을 SmartThings에 연결하면 에너지 사용량을 확인하고 자동으로 제어할 수 있어.",
      bgColor: "bg-blue-50",
      icon: <Zap className="w-10 h-10 text-yellow-500 fill-current" />,
      highlight: false
    },
    {
      text: "나랑 같이 집 안을 돌아다니며 기기들을 찾아 연결해보자! 준비됐어?",
      bgColor: "bg-green-50",
      icon: <span className="text-4xl">🏃</span>,
      highlight: false
    }
  ];

  const handleNext = () => {
    if (step < introSteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = introSteps[step];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
      onClick={handleNext}
    >
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-pop-in cursor-pointer relative">
        {/* Visual Header */}
        <div className={`h-40 ${currentStep.bgColor} flex items-center justify-center flex-col gap-4 border-b border-gray-100 transition-colors duration-500`}>
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md text-5xl transform hover:scale-110 transition-transform">
             {currentStep.icon}
           </div>
           {step === 0 && (
             <div className="absolute top-8 right-12 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75"></div>
           )}
        </div>

        {/* Content Body */}
        <div className="p-8 pb-12 relative">
          {/* Character Label */}
          <div className="absolute -top-6 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
            블루밍(bluememing)
          </div>
          
          <p className="text-lg text-gray-800 font-medium leading-relaxed mt-4 min-h-[5rem]">
            {currentStep.text}
          </p>
          
          {/* Tap Hint */}
          <div className="absolute bottom-4 right-6 flex items-center text-gray-400 text-sm animate-pulse">
            <span>터치해서 계속</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};