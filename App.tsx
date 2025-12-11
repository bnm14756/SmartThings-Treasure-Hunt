import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
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
import { Trophy, Medal, Hand, Star } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
           <div className="card text-center p-4">
             <h2>앱 실행 중</h2>
             <p>일시적인 오류가 감지되었으나 계속 실행합니다.</p>
             <button 
               className="btn btn-primary mt-4" 
               onClick={() => this.setState({ hasError: false })}
             >
               계속하기
             </button>
           </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showMoveGuide, setShowMoveGuide] = useState(false);
  const [avatarPos, setAvatarPos] = useState<Position>({ x: 50, y: 50 });
  const [guideLines, setGuideLines] = useState<string[]>([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  
  const currentMissionId = MISSIONS.find(m => !completedMissions.includes(m.id))?.id;
  const currentMission = MISSIONS.find(m => m.id === currentMissionId);
  const isGameClear = completedMissions.length === MISSIONS.length;

  useEffect(() => {
    if (showIntro) return;

    if (!showIntro && activeTab === 'home' && !sessionStorage.getItem('hasSeenMoveGuide')) {
        setShowMoveGuide(true);
        sessionStorage.setItem('hasSeenMoveGuide', 'true');
    }

    if (currentMission) {
        setGuideLines(currentMission.guideText);
    } else if (isGameClear) {
        setGuideLines([
            '대단해! 모든 미션을 완료했어! 🎉',
            '에너지 사용량을 안전하게 지켜냈구나.',
            '넌 이제 진정한 SmartThings 에너지 지킴이야!'
        ]);
    }
  }, [currentMissionId, showIntro, isGameClear, activeTab]);

  // Check Mission Success Conditions
  useEffect(() => {
    if (!currentMission) return;

    // Mission 1: Just check the Life Tab to see bad status
    if (currentMission.id === 1) {
        if (activeTab === 'life') {
            completeMission(1);
        }
        return;
    }

    // Mission 4: Check Life Tab AND ensure Energy is safe (Green)
    if (currentMission.id === 4) {
       const totalUsage = devices.filter(d => d.isOn).reduce((acc, curr) => acc + curr.powerConsumption, 0);
       if (activeTab === 'life' && totalUsage <= 300) {
           completeMission(4);
       }
       return;
    }

    // Standard Device Control Missions (2 & 3)
    if (currentMission.successCondition(devices)) {
        completeMission(currentMission.id);
    }
  }, [devices, activeTab, currentMission]);

  const completeMission = (id: number) => {
    if (completedMissions.includes(id)) return;
    
    setCompletedMissions(prev => [...prev, id]);
    
    // Victory handling for final mission
    if (id === MISSIONS[MISSIONS.length - 1].id) {
        setShowVictoryModal(true);
    } else {
        const mission = MISSIONS.find(m => m.id === id);
        alert(`🎉 미션 성공: ${mission?.title}\n\n참 잘했어요! 다음 미션으로 넘어갑니다.`);
    }
  };

  const handleDeviceUpdate = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleMapClick = (x: number, y: number) => {
    setAvatarPos({ x, y });
    if (showMoveGuide) setShowMoveGuide(false);
  };

  const handleDeviceClick = (device: Device) => {
    const distance = Math.sqrt(Math.pow(device.x - avatarPos.x, 2) + Math.pow(device.y - avatarPos.y, 2));
    const PROXIMITY_THRESHOLD = 15;

    if (distance > PROXIMITY_THRESHOLD) {
      alert("⚠️ 기기가 너무 멀리 있습니다!\n\n아바타를 기기 근처로 이동시킨 후 다시 시도해주세요.");
      return;
    }

    setSelectedDeviceId(device.id);
  };

  const handleRunRoutine = (routineId: string) => {
      if (routineId === 'routine-1') {
          const count = devices.filter(d => d.isOn).length;
          setDevices(prev => prev.map(d => ({ ...d, isOn: false, status: 'Off' })));
          alert(`절전 모드 실행 완료!\n${count}개의 기기가 꺼졌습니다.`);
      } else if (routineId === 'routine-2') {
          setDevices(prev => prev.map(d => {
              if (d.type === 'light' || d.type === 'tv') return { ...d, isOn: false };
              if (d.type === 'ac') return { ...d, status: 'Wind', value: 26 };
              return d;
          }));
          alert('외출 모드 실행 완료!');
      } else if (routineId === 'routine-3') {
          setDevices(prev => prev.map(d => {
            if (d.type === 'light' || d.type === 'tv') return { ...d, isOn: false };
            if (d.type === 'ac') return { ...d, status: 'Quiet', value: 24, isOn: true };
            return d;
          }));
          alert('취침 모드 실행 완료!\n좋은 꿈 꾸세요. 🌙');
      } else if (routineId === 'routine-4') {
          setDevices(prev => prev.map(d => {
            if (d.type === 'tv') return { ...d, isOn: true, status: 'Cinema' };
            if (d.type === 'light') return { ...d, isOn: true, value: 20 };
            return d;
          }));
          alert('영화 모드 실행 완료! 🍿');
      }
  };

  const resetGame = () => {
      setDevices(INITIAL_DEVICES);
      setCompletedMissions([]);
      setShowIntro(true);
      setShowVictoryModal(false);
      sessionStorage.removeItem('hasSeenMoveGuide');
      setActiveTab('home');
      setAvatarPos({ x: 50, y: 50 });
  };

  return (
    <div className="app-container">
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      
      <TopBar />
      
      <main className="main-content">
        {activeTab === 'home' && (
            <VirtualMap 
                devices={devices} 
                avatarPosition={avatarPos}
                onMapClick={handleMapClick}
                onDeviceClick={handleDeviceClick}
            />
        )}
        
        {activeTab === 'devices' && (
            <DeviceListTab 
                devices={devices} 
                onDeviceClick={(device) => setSelectedDeviceId(device.id)} 
            />
        )}

        {activeTab === 'life' && (
            <LifeTab 
                devices={devices} 
                onDeviceToggle={(id, isOn) => handleDeviceUpdate(id, { isOn })} 
            />
        )}

        {activeTab === 'automation' && (
            <AutomationTab 
                routines={ROUTINES} 
                onRunRoutine={handleRunRoutine} 
            />
        )}

        {activeTab === 'menu' && (
            <MenuTab 
                currentState={{}} 
                onLoadGame={() => {}} 
                onResetGame={resetGame} 
            />
        )}
      </main>

      {/* Guide Avatar */}
      {!showIntro && activeTab !== 'menu' && (
          <BloomingGuide lines={guideLines} onClick={() => {}} />
      )}

      {selectedDevice && (
        <DeviceControlModal
          device={selectedDevice}
          onClose={() => setSelectedDeviceId(null)}
          onUpdate={handleDeviceUpdate}
        />
      )}

      {/* Move Tutorial */}
      {showMoveGuide && activeTab === 'home' && !showIntro && (
          <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 60 }} onClick={() => setShowMoveGuide(false)}>
              <div className="animate-bounce" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                   <div style={{ background: 'rgba(255,255,255,0.95)', padding: '16px 24px', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                        <Hand size={32} color="#007aff" />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: 18, color: '#1c1c1e' }}>터치하여 이동하세요</div>
                            <div style={{ fontSize: 13, color: '#8e8e93' }}>Tap anywhere to move</div>
                        </div>
                   </div>
                   <div style={{ width: 2, height: 40, background: 'rgba(255,255,255,0.5)', marginTop: 8 }}></div>
                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'white' }}></div>
              </div>
          </div>
      )}

      {/* Mission Progress Indicator */}
      {!showIntro && activeTab === 'home' && !isGameClear && (
        <div className="btn-floating" style={{ background: 'white', color: '#1c1c1e', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Trophy size={20} color="#8e8e93" />
            <span style={{ fontWeight: 'bold' }}>미션 {completedMissions.length} / {MISSIONS.length}</span>
        </div>
      )}

      {/* Victory Modal (Flashy Effect) */}
      {showVictoryModal && (
          <div className="modal-overlay" style={{ zIndex: 200 }} onClick={() => setShowVictoryModal(false)}>
              <div className="confetti-container">
                {/* CSS Confetti would go here, simplified as dots */}
                <div className="confetti" style={{ left: '10%', animationDelay: '0s' }}></div>
                <div className="confetti" style={{ left: '30%', animationDelay: '0.2s', background: '#ffcc00' }}></div>
                <div className="confetti" style={{ left: '70%', animationDelay: '0.5s', background: '#34c759' }}></div>
                <div className="confetti" style={{ left: '90%', animationDelay: '0.1s' }}></div>
              </div>
              
              <div className="card animate-pop-in text-center" style={{ padding: 40, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: '4px solid #ffcc00', boxShadow: '0 0 50px rgba(255, 204, 0, 0.5)' }}>
                  <div style={{ fontSize: 60, marginBottom: 16 }}>🏆</div>
                  <h1 style={{ fontSize: 28, fontWeight: '900', color: '#333', marginBottom: 8 }}>Mission Complete!</h1>
                  <p style={{ color: '#666', marginBottom: 24 }}>집안의 에너지를 모두 지켜냈어요!</p>
                  
                  <div style={{ background: '#ffcc00', color: 'white', padding: '12px 24px', borderRadius: 30, fontWeight: 'bold', fontSize: 18, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(255, 204, 0, 0.4)' }}>
                    <Medal size={24} fill="currentColor" /> 에너지 지킴이
                  </div>
                  
                  <p style={{ marginTop: 24, fontSize: 12, color: '#8e8e93' }}>화면을 터치해서 닫기</p>
              </div>
          </div>
      )}

      {/* Top Right Achievement Badge (Persistent after clear) */}
      {isGameClear && (
          <div className="animate-fade-in" style={{ position: 'fixed', top: 70, right: 16, zIndex: 45 }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #fff 0%, #fffbe6 100%)', 
                padding: '8px 12px', 
                borderRadius: '16px', 
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                border: '2px solid #ffcc00',
                cursor: 'pointer'
            }} onClick={() => setShowVictoryModal(true)}>
                <div style={{ background: '#ffcc00', borderRadius: '50%', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Medal size={16} color="white" fill="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '9px', color: '#d4a000', fontWeight: 'bold', letterSpacing: '0.5px' }}>RANK</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>에너지 지킴이</span>
                </div>
            </div>
          </div>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;