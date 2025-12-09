import React, { useState, useEffect } from 'react';
import { Device } from '../types';
import { X, Power, ChevronUp, ChevronDown, CheckCircle2, Loader2, Smartphone, Wifi } from 'lucide-react';

interface DeviceControlModalProps {
  device: Device;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Device>) => void;
}

export const DeviceControlModal: React.FC<DeviceControlModalProps> = ({ device, onClose, onUpdate }) => {
  const [connectionStep, setConnectionStep] = useState<'connecting' | 'connected' | 'control'>('control');
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!device.isConnected) {
        setConnectionStep('connecting');
        
        // Simulate Connection Delay
        const timer1 = setTimeout(() => {
            setConnectionStep('connected');
            onUpdate(device.id, { isConnected: true });
        }, 1500);

        const timer2 = setTimeout(() => {
            setConnectionStep('control');
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }
  }, [device.id]);

  const handlePowerClick = () => {
    setIsToggling(true);
    // Simulate SmartThings Cloud Latency
    setTimeout(() => {
        onUpdate(device.id, { isOn: !device.isOn });
        setIsToggling(false);
    }, 800);
  };

  const changeValue = (delta: number) => {
    if (!device.isOn) return;
    if (typeof device.value === 'number') {
        onUpdate(device.id, { value: device.value + delta });
    }
  };

  const finishWasher = () => {
      onUpdate(device.id, { status: 'Empty', isOn: false }); // Auto turn off when finished
      onClose();
  };

  // --- Rendering Connection Steps ---

  if (connectionStep === 'connecting') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center animate-fade-in shadow-2xl">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Wifi className="text-blue-600 w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">SmartThings 연결 중...</h2>
                <p className="text-gray-500 text-sm">기기를 클라우드에 등록하고 있습니다.</p>
            </div>
        </div>
      );
  }

  if (connectionStep === 'connected') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center animate-pop-in shadow-2xl">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">연결 완료!</h2>
                <p className="text-gray-500 text-sm">이제 언제 어디서나<br/>SmartThings로 제어할 수 있습니다.</p>
            </div>
        </div>
      );
  }

  // --- Control UI (Default) ---

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        {/* Header - Changes color based on state */}
        <div className={`${device.isOn ? 'bg-blue-600' : 'bg-slate-700'} p-4 pb-6 relative overflow-hidden transition-colors duration-500`}>
             {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col text-white">
                    <div className="flex items-center gap-1 mb-1 opacity-90">
                        <Smartphone size={12} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">SmartThings Control</span>
                    </div>
                    <h2 className="text-2xl font-bold">{device.name}</h2>
                    <p className={`text-xs mt-1 ${device.isOn ? 'text-blue-100' : 'text-gray-400'}`}>
                        {device.room} • {device.isConnected ? '온라인' : '오프라인'}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center gap-8 bg-gray-50 min-h-[300px]">
          
            {/* Power Button */}
            <div className="flex flex-col items-center gap-4">
                <button 
                    onClick={handlePowerClick}
                    disabled={isToggling}
                    className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all transform active:scale-95 border-4 ${
                        isToggling ? 'bg-gray-100 border-gray-300 scale-95' :
                        device.isOn 
                            ? 'bg-blue-600 border-blue-400 shadow-blue-300 text-white' 
                            : 'bg-white border-gray-200 text-gray-300'
                    }`}
                >
                    {isToggling ? (
                        <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                    ) : (
                        <Power className="w-12 h-12" />
                    )}
                </button>
                <div className="text-center">
                    <p className={`text-xl font-bold ${device.isOn ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isToggling ? '제어 신호 전송 중...' : (device.isOn ? '켜짐' : '꺼짐')}
                    </p>
                    {isToggling && (
                        <p className="text-xs text-blue-500 mt-1 font-medium animate-pulse">SmartThings Cloud</p>
                    )}
                </div>
            </div>

            {/* Device Specific Controls */}
            {device.isOn && !isToggling && (
                <div className="w-full animate-fade-in-up">
                    {device.type === 'tv' && (
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Channel</label>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-800">{device.value}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => changeValue(-1)} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"><ChevronDown /></button>
                                    <button onClick={() => changeValue(1)} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"><ChevronUp /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {device.type === 'ac' && (
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Temperature</label>
                             <div className="flex items-center justify-between">
                                 <span className="text-3xl font-bold text-gray-800">{device.value}°C</span>
                                 <div className="text-xs text-blue-500 font-medium px-3 py-1 bg-blue-50 rounded-full">
                                     냉방 모드 동작 중
                                 </div>
                             </div>
                         </div>
                    )}
                </div>
            )}

            {/* Washer Special Case */}
             {device.type === 'washer' && device.isOn && !isToggling && (
                <div className="w-full bg-white p-4 rounded-xl shadow-sm flex flex-col gap-4 text-center border border-gray-100">
                    <div className="text-gray-600">
                        남은 시간: <span className="font-bold text-blue-600 text-xl">{device.value}분</span>
                    </div>
                    {device.value === 0 && (
                         <button 
                            onClick={finishWasher}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 animate-bounce"
                        >
                            빨래 꺼내기 & 전원 끄기
                        </button>
                    )}
                </div>
            )}
            
            {/* Energy Hint */}
            <div className="mt-auto flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                <Wifi size={12} />
                <span>SmartThings Energy 모니터링 동작 중</span>
            </div>
        </div>
      </div>
    </div>
  );
};