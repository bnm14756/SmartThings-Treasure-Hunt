import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNavigation } from './components/BottomNavigation';
import { VirtualMap } from './components/VirtualMap';
import { DeviceControlModal } from './components/DeviceControlModal';
import { BloomingGuide } from './components/BloomingGuide';
import { IntroOverlay } from './components/IntroOverlay';
import { LifeTab, AutomationTab, DeviceListTab } from './components/DashboardTabs';
import { INITIAL_DEVICES, MISSIONS, ROUTINES } from './constants';
import { Device, TabType, Position } from './types';
import { Trophy, Link, Zap, SaveOff } from 'lucide-react';
import { saveGameState, loadGameState, clearGameState } from './utils/storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  // Initialize with a fresh copy of INITIAL_DEVICES
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES.map(d => ({...d})));
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Game State
  const [isGameClear, setIsGameClear] = useState(false);

  // Avatar State
  const [avatarPosition, setAvatarPosition] = useState<Position>({ x: 50, y: 80 });
  const [nearbyDevice, setNearbyDevice] = useState<Device | null>(null);

  const currentMission = MISSIONS[currentMissionIndex];
  
  // Calculate Total Energy
  const totalPower = devices.reduce((acc, d) => acc + (d.isOn ? d.powerConsumption : 0), 0);
  const SAFE_POWER_THRESHOLD = 300;

  // --- Storage & Initialization Logic ---
  
  // Handle Intro Completion
  const handleIntroComplete = () => {
    try {
        // Try to load state (Lazy load, safe from errors)
        const savedState = loadGameState();
        if (savedState) {
            console.log("Restoring saved game state...");
            if (savedState.devices) setDevices(savedState.devices);
            if (savedState.currentMissionIndex !== undefined) setCurrentMissionIndex(savedState.currentMissionIndex);
            if (savedState.isGameClear !== undefined) setIsGameClear(savedState.isGameClear);
            if (savedState.avatarPosition) setAvatarPosition(savedState.avatarPosition);
        }
    } catch (e) {
        // Fallback silently
        console.log("Starting fresh session.");
    }

    setShowIntro(false);
  };

  // Auto-Save Effect
  useEffect(() => {
    if (!showIntro) {
        const stateToSave = {
            devices,
            currentMissionIndex,
            isGameClear,
            avatarPosition
        };
        saveGameState(stateToSave);
    }
  }, [devices, currentMissionIndex, isGameClear, showIntro, avatarPosition]);


  // --- Game Logic ---

  // Keyboard Movement
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

  // Check Game Clear Condition (Energy Goal)
  useEffect(() => {
      if (!isGameClear && !showIntro && totalPower <= SAFE_POWER_THRESHOLD) {
          if (currentMissionIndex >= 2) {
              setTimeout(() => {
                  setIsGameClear(true);
              }, 1000);
          }
      }
  }, [totalPower, isGameClear, showIntro, currentMissionIndex]);

  // Check Standard Mission Success
  useEffect(() => {
    if (isGameClear) return;

    if (currentMission.successCondition(devices)) {
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 500);
    }
  }, [devices, currentMission, isGameClear]);

  // Proximity Check
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
      if (nearbyDevice) {
          setSelectedDevice(nearbyDevice);
      }
  };

  const runRoutine = (routineId: string) => {
    const routine = ROUTINES.find(r => r.id === routineId);
    if (!routine) return;

    if (routineId === 'routine-1') { // Eco Mode
         setDevices(prev => prev.map(d => {
             if (d.type === 'refrigerator') return d; 
             return { ...d, isOn: false };
         }));
    } else if (routineId === 'routine-2') { // Away Mode
        setDevices(prev => prev.map(d => {
            if (d.type === 'ac') return { ...d, value: 27, status: 'Fan Only', isOn: true };
            if (d.type === 'light') return { ...d, isOn: false };
            if (d.type === 'tv') return { ...d, isOn: false };
            return d;
        }));
    }
    
    alert(`[SmartThings] ${routine.name}가 실행되었습니다.\n기기 제어 신호가 전송되었습니다.`);
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
      clearGameState(); // Clear storage
      setDevices(INITIAL_DEVICES.map(d => ({...d})));
      setCurrentMissionIndex(0);
      setActiveTab('home');
      setAvatarPosition({ x: 50, y: 80 });
      setIsGameClear(false);
      setShowSuccessModal(false);
      setSelectedDevice(null);
      setShowIntro(true); // Will trigger intro again, but storage is cleared so no load
      setNearbyDevice(null);
  };

  const renderContent = () => {
    if (isGameClear) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-green-50 animate-fade-in">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <Zap size={64} className="text-green-600 fill-current" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">에너지 절약 대성공!</h1>
                <p className="text-xl text-green-600 font-bold mb-6">전기 요금 안전 구간 달성</p>
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 max-w-xs mx-auto">
                    <p className="text-gray-500 mb-1">최종 소비 전력</p>
                    <p className="text-4xl font-bold text-green-600">{totalPower}W</p>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    SmartThings와 함께라면<br/>
                    지구도 지키고 지갑도 지킬 수 있어요!<br/>
                    가상 홈 보물찾기를 완료했습니다.
                </p>
                <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
                >
                    처음부터 다시하기
                </button>
            </div>
        )
    }

    switch (activeTab) {
      case 'home':
        return (
            <VirtualMap 
                devices={devices} 
                avatarPosition={avatarPosition}
                onMapClick={handleMapClick}
                onDeviceClick={handleWalkToDevice} 
            />
        );
      case 'devices':
        return <DeviceListTab devices={devices} onDeviceClick={(d) => { setActiveTab('home'); handleWalkToDevice(d); }} />;
      case 'life':
        return <LifeTab devices={devices} onDeviceToggle={(id, isOn) => handleDeviceUpdate(id, { isOn })} />;
      case 'automation':
        return <AutomationTab routines={ROUTINES} onRunRoutine={runRoutine} />;
      default:
        return <div className="p-8 text-center text-gray-500 mt-20">준비 중인 메뉴입니다.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopBar />
      
      {/* Intro Overlay */}
      {showIntro && (
          <IntroOverlay onComplete={handleIntroComplete} />
      )}
      
      {/* Main Content Area */}
      <main className="flex-1 mt-14 mb-16 relative overflow-y-auto bg-gray-100">
        {renderContent()}
        
        {/* Investigate/Connect Floating Button */}
        {activeTab === 'home' && nearbyDevice && !selectedDevice && !showSuccessModal && !showIntro && !isGameClear && (
             <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 animate-slide-up">
                 <button 
                    onClick={handleConnectClick}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
                 >
                    {nearbyDevice.isConnected ? (
                        <>
                            <Trophy size={20} />
                            <span>{nearbyDevice.name} 제어하기</span>
                        </>
                    ) : (
                        <>
                            <Link size={20} />
                            <span className="font-bold">SmartThings 연결하기</span>
                        </>
                    )}
                 </button>
             </div>
        )}
      </main>

      {/* Guide Character */}
      {!isGameClear && !showIntro && activeTab === 'home' && (
          <BloomingGuide 
            lines={currentMission.guideText} 
            onClick={() => {}}
          />
      )}

      {/* Popups */}
      {selectedDevice && (
        <DeviceControlModal 
          device={selectedDevice} 
          onClose={() => setSelectedDevice(null)} 
          onUpdate={handleDeviceUpdate} 
        />
      )}

      {/* Mission Success Modal */}
      {showSuccessModal && !isGameClear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-pop-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-green-600 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">미션 성공!</h2>
                <p className="text-gray-600 mb-6">{currentMission.title}을(를) 완수했습니다.</p>
                <button 
                    onClick={nextMission}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    다음 미션으로
                </button>
            </div>
        </div>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;