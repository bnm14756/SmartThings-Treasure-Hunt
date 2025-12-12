import React, { useState } from 'react';
import { Device } from '../types';
import { X, Power, ChevronUp, ChevronDown, CheckCircle2, Loader2, Smartphone, Wifi, Plus, Lock } from 'lucide-react';

interface DeviceControlModalProps {
  device: Device;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Device>) => void;
}

export const DeviceControlModal: React.FC<DeviceControlModalProps> = ({ device, onClose, onUpdate }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if device is a refrigerator
  const isFridge = device.type === 'refrigerator';

  const handleConnect = () => {
      setIsConnecting(true);
      setTimeout(() => {
          onUpdate(device.id, { isConnected: true });
          setIsConnecting(false);
      }, 1500);
  };

  const handlePowerClick = () => {
    if (isFridge) {
        alert("냉장고 전원을 끄면 음식이 상할 수 있습니다!\n스마트싱스 에너지 관리로 효율만 높여보세요.");
        return;
    }

    setIsToggling(true);
    // Reduced latency to 300ms for snappier feel
    setTimeout(() => { 
        onUpdate(device.id, { isOn: !device.isOn }); 
        setIsToggling(false); 
    }, 300);
  };

  const changeValue = (delta: number) => {
    if (!device.isOn) return;
    if (typeof device.value === 'number') onUpdate(device.id, { value: device.value + delta });
  };

  // State 1: Not Connected -> Show "Add Device" UI
  if (!device.isConnected) {
      return (
        <div className="modal-overlay">
            <div className="modal-content text-center p-4">
                 <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 80, height: 80, background: '#f2f2f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={40} color="#8e8e93" />
                    </div>
                    <h2 className="section-title" style={{ marginBottom: 4 }}>새로운 기기 발견</h2>
                    <p style={{ color: '#8e8e93', fontSize: 14 }}>{device.name}이(가) 근처에 있습니다.<br/>SmartThings에 추가하시겠습니까?</p>
                    
                    <button 
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="btn btn-primary w-full mt-4"
                        style={{ justifyContent: 'center' }}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> 연결 중...
                            </>
                        ) : (
                            <>
                                <Plus size={20} /> 기기 추가하기
                            </>
                        )}
                    </button>
                    <button onClick={onClose} className="btn btn-secondary w-full" style={{ border: 'none' }}>
                        나중에 하기
                    </button>
                 </div>
            </div>
        </div>
      );
  }

  // State 2: Connected -> Control UI
  // Define clear styles for ON/OFF states
  const headerBg = device.isOn ? '#007aff' : '#1c1c1e'; // Darker gray for OFF
  const buttonBg = isFridge ? '#f2f2f7' : (device.isOn ? 'white' : '#3a3a3c');
  const buttonIconColor = isFridge ? '#8e8e93' : (device.isOn ? '#007aff' : '#8e8e93');
  const buttonShadow = !isFridge && device.isOn ? '0 10px 20px rgba(0,122,255,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.2)';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ background: headerBg, padding: '24px', color: 'white', transition: 'background 0.3s ease' }}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2" style={{ opacity: 0.8, fontSize: 10, textTransform: 'uppercase' }}>
                        <Wifi size={12} /> SmartThings Connected
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>{device.name}</h2>
                    <p style={{ opacity: 0.8, fontSize: 12 }}>{device.room} • {device.isOn ? '작동 중' : '대기 중'}</p>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', color: 'white' }}>
                    <X size={20} />
                </button>
            </div>
        </div>

        <div style={{ padding: '32px', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div className="text-center">
                <button 
                    onClick={handlePowerClick}
                    disabled={isToggling}
                    style={{ 
                        width: 100, height: 100, borderRadius: '50%', border: 'none', 
                        background: buttonBg,
                        color: buttonIconColor,
                        boxShadow: buttonShadow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        cursor: isFridge ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isToggling ? 'scale(0.95)' : 'scale(1)',
                        position: 'relative'
                    }}
                >
                    {isToggling ? <Loader2 className="animate-spin" /> : <Power size={40} strokeWidth={2.5} />}
                    {isFridge && (
                        <div style={{ position: 'absolute', bottom: -10, background: '#8e8e93', borderRadius: '50%', padding: 4, color: 'white' }}>
                            <Lock size={12} />
                        </div>
                    )}
                </button>
                <p style={{ marginTop: 12, fontWeight: 'bold', fontSize: 18, color: device.isOn ? '#007aff' : '#8e8e93', transition: 'color 0.3s' }}>
                    {device.isOn ? '켜짐' : '꺼짐'}
                </p>
                {isFridge && <p style={{ fontSize: 11, color: '#8e8e93', marginTop: 4 }}>상시 전원 기기</p>}
            </div>

            {device.isOn && !isToggling && (
                <div className="w-full card animate-fade-in" style={{ padding: 16 }}>
                    {device.type === 'tv' && (
                        <div className="flex justify-between items-center">
                            <span style={{ fontWeight: 'bold', color: '#8e8e93' }}>CH</span>
                            <span style={{ fontSize: 24, fontWeight: 'bold' }}>{device.value}</span>
                            <div className="flex gap-2">
                                <button onClick={() => changeValue(-1)} className="btn btn-secondary" style={{ padding: 8 }}><ChevronDown /></button>
                                <button onClick={() => changeValue(1)} className="btn btn-secondary" style={{ padding: 8 }}><ChevronUp /></button>
                            </div>
                        </div>
                    )}
                    {device.type === 'ac' && (
                         <div className="flex justify-between items-center">
                             <span style={{ fontWeight: 'bold', color: '#8e8e93' }}>TEMP</span>
                             <span style={{ fontSize: 24, fontWeight: 'bold' }}>{device.value}°C</span>
                         </div>
                    )}
                    {device.type === 'refrigerator' && (
                         <div className="flex justify-between items-center">
                             <span style={{ fontWeight: 'bold', color: '#8e8e93' }}>TEMP</span>
                             <span style={{ fontSize: 24, fontWeight: 'bold' }}>{device.value}°C</span>
                         </div>
                    )}
                    {device.type === 'washer' && (
                        <div className="text-center">
                            <p>남은 시간: <strong style={{ color: '#007aff' }}>{device.value}분</strong></p>
                            {device.value === 0 && (
                                <button onClick={() => { onUpdate(device.id, { status: 'Empty', isOn: false }); onClose(); }} className="btn btn-primary w-full mt-4">
                                    완료하기
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};