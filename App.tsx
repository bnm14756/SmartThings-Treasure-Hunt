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
import { Trophy } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary: React 렌더링 중 발생하는 오류를 잡아 흰 화면을 방지합니다.
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
      // 에러 발생 시에도 최소한의 UI를 렌더링하거나 자식 컴포넌트를 다시 그림
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
  
  // FIX: Store ID only to prevent stale state. Derive the full object during render.
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [avatarPos, setAvatarPos] = useState<Position>({ x: 50, y: 50 });
  const [guideLines, setGuideLines] = useState<string[]>([]);
  
  // Mission Logic
  const currentMissionId = MISSIONS.find(m => !completedMissions.includes(m.id))?.id;
  const currentMission = MISSIONS.find(m => m.id === currentMissionId);

  useEffect(() => {
    if (showIntro) return;

    if (currentMission) {
        setGuideLines(currentMission.guideText);
    } else {
        setGuideLines([
            '축하해! 모든 미션을 완료했어! 🎉',
            '이제 우리 집은 에너지 효율 만점이야.',
            'SmartThings와 함께라면 전기 요금 걱정 끝!'
        ]);
    }
  }, [currentMissionId, showIntro]);

  // Check Mission Success Conditions
  useEffect(() => {
    if (!currentMission) return;

    // Special check for Mission 3 (Energy Monitoring)
    if (currentMission.id === 3) {
       const totalUsage = devices.filter(d => d.isOn).reduce((acc, curr) => acc + curr.powerConsumption, 0);
       if (totalUsage <= 300 && activeTab === 'life') {
           completeMission(3);
       }
       return;
    }

    // General Device Checks
    if (currentMission.successCondition(devices)) {
        completeMission(currentMission.id);
    }
  }, [devices, activeTab, currentMission]);

  const completeMission = (id: number) => {
    if (completedMissions.includes(id)) return;
    
    // Play sound or visual effect here if possible
    setCompletedMissions(prev => [...prev, id]);
    
    // Show success toast
    const mission = MISSIONS.find(m => m.id === id);
    alert(`🎉 미션 성공: ${mission?.title}\n\n참 잘했어요! 다음 미션으로 넘어갑니다.`);
  };

  const handleDeviceUpdate = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleMapClick = (x: number, y: number) => {
    setAvatarPos({ x, y });
  };

  const handleRunRoutine = (routineId: string) => {
      if (routineId === 'routine-1') {
          // Eco Mode: Turn off everything not critical (simulated)
          const count = devices.filter(d => d.isOn).length;
          setDevices(prev => prev.map(d => ({ ...d, isOn: false, status: 'Off' })));
          alert(`절전 모드 실행 완료!\n${count}개의 기기가 꺼졌습니다.`);
      } else if (routineId === 'routine-2') {
          // Outing Mode
          setDevices(prev => prev.map(d => {
              if (d.type === 'light' || d.type === 'tv') return { ...d, isOn: false };
              if (d.type === 'ac') return { ...d, status: 'Wind', value: 26 };
              return d;
          }));
          alert('외출 모드 실행 완료!');
      }
  };

  const resetGame = () => {
      setDevices(INITIAL_DEVICES);
      setCompletedMissions([]);
      setShowIntro(true);
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
                onDeviceClick={(device) => setSelectedDeviceId(device.id)}
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

      {/* Device Modal - Now passes the fresh selectedDevice derived from state */}
      {selectedDevice && (
        <DeviceControlModal
          device={selectedDevice}
          onClose={() => setSelectedDeviceId(null)}
          onUpdate={handleDeviceUpdate}
        />
      )}

      {/* Mission Progress Indicator (Floating) */}
      {!showIntro && activeTab === 'home' && (
        <div className="btn-floating" style={{ background: 'white', color: '#1c1c1e', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <Trophy size={20} color={completedMissions.length === MISSIONS.length ? '#ffcc00' : '#8e8e93'} fill={completedMissions.length === MISSIONS.length ? 'currentColor' : 'none'} />
            <span style={{ fontWeight: 'bold' }}>미션 {completedMissions.length} / {MISSIONS.length}</span>
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