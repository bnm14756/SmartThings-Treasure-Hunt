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
        setTimeout(() => { setConnectionStep('connected'); onUpdate(device.id, { isConnected: true }); }, 1500);
        setTimeout(() => { setConnectionStep('control'); }, 2500);
    }
  }, [device.id]);

  const handlePowerClick = () => {
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

  if (connectionStep === 'connecting' || connectionStep === 'connected') {
      return (
        <div className="modal-overlay">
            <div className="modal-content text-center p-4">
                <div style={{ padding: 40 }}>
                    {connectionStep === 'connecting' ? (
                        <Wifi size={48} className="text-primary animate-bounce" />
                    ) : (
                        <CheckCircle2 size={48} className="text-success" />
                    )}
                    <h2 className="section-title mt-4">{connectionStep === 'connecting' ? '연결 중...' : '연결 완료!'}</h2>
                    <p style={{ color: '#8e8e93' }}>SmartThings Cloud 통신 중</p>
                </div>
            </div>
        </div>
      );
  }

  // Define clear styles for ON/OFF states
  const headerBg = device.isOn ? '#007aff' : '#1c1c1e'; // Darker gray for OFF
  const buttonBg = device.isOn ? 'white' : '#3a3a3c';
  const buttonIconColor = device.isOn ? '#007aff' : '#8e8e93';
  const buttonShadow = device.isOn ? '0 10px 20px rgba(0,122,255,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.2)';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ background: headerBg, padding: '24px', color: 'white', transition: 'background 0.3s ease' }}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2" style={{ opacity: 0.8, fontSize: 10, textTransform: 'uppercase' }}>
                        <Smartphone size={12} /> SmartThings Control
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isToggling ? 'scale(0.95)' : 'scale(1)'
                    }}
                >
                    {isToggling ? <Loader2 className="animate-spin" /> : <Power size={40} strokeWidth={2.5} />}
                </button>
                <p style={{ marginTop: 12, fontWeight: 'bold', fontSize: 18, color: device.isOn ? '#007aff' : '#8e8e93', transition: 'color 0.3s' }}>
                    {device.isOn ? '켜짐' : '꺼짐'}
                </p>
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