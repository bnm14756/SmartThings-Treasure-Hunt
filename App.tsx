
import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNavigation } from './components/BottomNavigation';
import { VirtualMap } from './components/VirtualMap';
import { DeviceControlModal } from './components/DeviceControlModal';
import { BloomingGuide } from './components/BloomingGuide';
import { IntroOverlay } from './components/IntroOverlay';
import { LifeTab, AutomationTab, DeviceListTab } from './components/DashboardTabs';
import { MenuTab } from './components/MenuTab';
import { INITIAL_DEVICES, MISSIONS, ROUTINES } from './constants';
import { Device, TabType, Position } from './types';
import { Trophy, Link, Zap } from 'lucide-react';
import { clearGameState } from './utils/storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES.map(d => ({...d})));
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isGameClear, setIsGameClear] = useState(false);
  const [avatarPosition, setAvatarPosition] = useState<Position>({ x: 50, y: 80 });
  const [nearbyDevice, setNearbyDevice] = useState<Device | null>(null);

  const currentMission = MISSIONS[currentMissionIndex];
  const totalPower = devices.reduce((acc, d) => acc + (d.isOn ? d.powerConsumption : 0), 0);
  const SAFE_POWER_THRESHOLD = 300;

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'home' || showIntro || selectedDevice || showSuccessModal || isGameClear) return;
      setAvatarPosition(prev => {
        const step = 2.5; 
        let newX = prev.x;
        let newY = prev.y;
        switch(e.key) {
            case 'ArrowUp': newY -= step; break;
            case 'ArrowDown': newY += step; break;
            case 'ArrowLeft': newX -= step; break;
            case 'ArrowRight': newX += step; break;
            default: return prev; 
        }
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
        return { x: newX, y: newY };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, showIntro, selectedDevice, showSuccessModal, isGameClear]);

  useEffect(() => {
      if (!isGameClear && !showIntro && totalPower <= SAFE_POWER_THRESHOLD) {
          if (currentMissionIndex >= 2) {
              setTimeout(() => setIsGameClear(true), 1000);
          }
      }
  }, [totalPower, isGameClear, showIntro, currentMissionIndex]);

  useEffect(() => {
    if (isGameClear) return;
    if (currentMission.successCondition(devices)) {
      setTimeout(() => setShowSuccessModal(true), 500);
    }
  }, [devices, currentMission, isGameClear]);

  useEffect(() => {
      if (activeTab !== 'home') return;
      const threshold = 15; 
      let found: Device | null = null;
      let minDist = Infinity;
      devices.forEach(d => {
          const dx = d.x - avatarPosition.x;
          const dy = d.y - avatarPosition.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < threshold && dist < minDist) {
              minDist = dist;
              found = d;
          }
      });
      setNearbyDevice(found);
  }, [avatarPosition, devices, activeTab]);

  const handleDeviceUpdate = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleMapClick = (x: number, y: number) => {
      setAvatarPosition({ x, y });
  };

  const handleWalkToDevice = (device: Device) => {
      setAvatarPosition({ x: device.x, y: device.y + 5 });
  };

  const handleConnectClick = () => {
      if (nearbyDevice) setSelectedDevice(nearbyDevice);
  };

  const runRoutine = (routineId: string) => {
    const routine = ROUTINES.find(r => r.id === routineId);
    if (!routine) return;
    if (routineId === 'routine-1') { 
         setDevices(prev => prev.map(d => {
             if (d.type === 'refrigerator') return d; 
             return { ...d, isOn: false };
         }));
    } else if (routineId === 'routine-2') { 
        setDevices(prev => prev.map(d => {
            if (d.type === 'ac') return { ...d, value: 27, status: 'Fan Only', isOn: true };
            if (d.type === 'light') return { ...d, isOn: false };
            if (d.type === 'tv') return { ...d, isOn: false };
            return d;
        }));
    }
    alert(`[SmartThings] ${routine.name} 실행됨`);
  };

  const nextMission = () => {
    setShowSuccessModal(false);
    if (currentMissionIndex < MISSIONS.length - 1) {
      setCurrentMissionIndex(prev => prev + 1);
      setActiveTab('home'); 
      setAvatarPosition({ x: 50, y: 50 });
    }
  };

  const resetGame = () => {
      setDevices(INITIAL_DEVICES.map(d => ({...d})));
      setCurrentMissionIndex(0);
      setActiveTab('home');
      setAvatarPosition({ x: 50, y: 80 });
      setIsGameClear(false);
      setShowSuccessModal(false);
      setSelectedDevice(null);
      setShowIntro(true); 
      setNearbyDevice(null);
  };

  const renderContent = () => {
    if (isGameClear) {
        return (
            <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
                <div style={{ background: '#dcfce7', borderRadius: '50%', padding: '30px', marginBottom: '20px' }}>
                    <Zap size={64} color="#16a34a" fill="currentColor" />
                </div>
                <h1 className="section-title" style={{ fontSize: '28px', color: '#15803d' }}>에너지 절약 대성공!</h1>
                <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '20px' }}>전기 요금 안전 구간 달성</p>
                <div className="card" style={{ display: 'inline-block', minWidth: '200px' }}>
                    <p className="text-center" style={{ color: '#888' }}>최종 소비 전력</p>
                    <p className="text-center" style={{ fontSize: '40px', fontWeight: 'bold', color: '#16a34a' }}>{totalPower}W</p>
                </div>
                <button onClick={resetGame} className="btn btn-primary" style={{ marginTop: '20px' }}>처음부터 다시하기</button>
            </div>
        )
    }

    switch (activeTab) {
      case 'home':
        return <VirtualMap devices={devices} avatarPosition={avatarPosition} onMapClick={handleMapClick} onDeviceClick={handleWalkToDevice} />;
      case 'devices':
        return <DeviceListTab devices={devices} onDeviceClick={(d) => { setActiveTab('home'); handleWalkToDevice(d); }} />;
      case 'life':
        return <LifeTab devices={devices} onDeviceToggle={(id, isOn) => handleDeviceUpdate(id, { isOn })} />;
      case 'automation':
        return <AutomationTab routines={ROUTINES} onRunRoutine={runRoutine} />;
      case 'menu':
        return <MenuTab currentState={null} onLoadGame={() => {}} onResetGame={resetGame} />;
      default:
        return <div className="p-4 text-center">준비 중인 메뉴입니다.</div>;
    }
  };

  return (
    <div className="app-container">
      <TopBar />
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
      
      <main className="main-content">
        {renderContent()}
        {activeTab === 'home' && nearbyDevice && !selectedDevice && !showSuccessModal && !showIntro && !isGameClear && (
             <button onClick={handleConnectClick} className="btn btn-primary btn-floating animate-bounce">
                {nearbyDevice.isConnected ? (
                    <> <Trophy size={20} /> <span>{nearbyDevice.name} 제어하기</span> </>
                ) : (
                    <> <Link size={20} /> <span>SmartThings 연결하기</span> </>
                )}
             </button>
        )}
      </main>

      {!isGameClear && !showIntro && activeTab === 'home' && (
          <BloomingGuide lines={currentMission.guideText} onClick={() => {}} />
      )}

      {selectedDevice && (
        <DeviceControlModal device={selectedDevice} onClose={() => setSelectedDevice(null)} onUpdate={handleDeviceUpdate} />
      )}

      {showSuccessModal && !isGameClear && (
        <div className="modal-overlay">
            <div className="modal-content" style={{ padding: '30px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '20px', background: '#dcfce7', borderRadius: '50%', marginBottom: '20px' }}>
                    <Trophy size={32} color="#16a34a" />
                </div>
                <h2 className="section-title">미션 성공!</h2>
                <p className="mb-4 text-sub">{currentMission.title}을(를) 완수했습니다.</p>
                <button onClick={nextMission} className="btn btn-primary w-full">다음 미션으로</button>
            </div>
        </div>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
export default App;
