import React from 'react';
import { Device, Routine } from '../types';
import { Play, AlertTriangle, Leaf, Moon, Clapperboard, DoorOpen } from 'lucide-react';

export const LifeTab: React.FC<{ devices: Device[]; onDeviceToggle: (id: string, isOn: boolean) => void }> = ({ devices, onDeviceToggle }) => {
  const energyData = devices.map(d => ({ name: d.name, value: d.isOn ? d.powerConsumption : 0, original: d })).filter(item => item.value > 0 || item.original.isConnected);
  const totalUsage = energyData.reduce((acc, curr) => acc + curr.value, 0);
  const isSafe = totalUsage <= 300;
  
  // Chart Configuration
  const MAX_VAL = 2000; // Max wattage for chart scaling
  const SAFE_LINE_PCT = (300 / MAX_VAL) * 100;

  return (
    <div className="page-container">
      <div className="card" style={{ background: isSafe ? '#dcfce7' : 'white', borderColor: isSafe ? '#86efac' : 'transparent' }}>
        <p className="section-title">SmartThings Energy</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h2 style={{ fontSize: 40, fontWeight: 'bold', color: isSafe ? '#16a34a' : '#1c1c1e' }}>{totalUsage}</h2>
            <span>W</span>
        </div>
        {!isSafe && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> 에너지 과다 사용</div>}
        
        {/* CSS-only Bar Chart */}
        <div style={{ height: '180px', marginTop: '24px', position: 'relative', borderBottom: '1px solid #e5e5ea', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '24px' }}>
            {/* Safety Line */}
            <div style={{ position: 'absolute', bottom: `calc(${SAFE_LINE_PCT}% + 24px)`, left: 0, right: 0, borderTop: '2px dashed #22c55e', opacity: 0.6, pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', right: 0, bottom: 2, fontSize: 10, color: '#22c55e', background: 'rgba(255,255,255,0.8)' }}>Safe (300W)</span>
            </div>

            {energyData.length === 0 ? (
                <div style={{ width: '100%', textAlign: 'center', color: '#8e8e93', fontSize: 12, paddingBottom: 20 }}>데이터 없음</div>
            ) : energyData.map((d, i) => {
                const heightPct = Math.min((d.value / MAX_VAL) * 100, 100);
                const isOver = d.value > 500;
                return (
                    <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ 
                            width: '24px', 
                            height: `${Math.max(heightPct, 2)}%`, 
                            background: isOver ? '#ef4444' : (isSafe ? '#22c55e' : '#007aff'), 
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                        <span style={{ position: 'absolute', bottom: 0, fontSize: 10, color: '#8e8e93', width: '40px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {d.name.split(' ')[0]}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>

      <h3 className="section-title" style={{ fontSize: 16 }}>기기 상태</h3>
      {devices.filter(d => d.isOn).map(device => (
        <div key={device.id} className="card flex justify-between items-center" style={{ padding: 12 }}>
            <div className="flex items-center gap-4">
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{device.name}</div>
                    <div style={{ fontSize: 12, color: '#8e8e93' }}>{device.powerConsumption}W</div>
                </div>
            </div>
            {device.isConnected && (
                <button onClick={() => onDeviceToggle(device.id, false)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>끄기</button>
            )}
        </div>
      ))}
      {devices.filter(d => d.isOn).length === 0 && (
          <div className="card" style={{ background: '#dcfce7', color: '#15803d', textAlign: 'center' }}>
              <Leaf className="mx-auto mb-2" />
              모든 전원이 꺼져 있습니다.
          </div>
      )}
    </div>
  );
};

export const AutomationTab: React.FC<{ routines: Routine[]; onRunRoutine: (id: string) => void }> = ({ routines, onRunRoutine }) => {
  const getIcon = (icon: string) => {
    switch(icon) {
        case 'leaf': return <Leaf size={24} />;
        case 'door-open': return <DoorOpen size={24} />;
        case 'moon': return <Moon size={24} />;
        case 'clapperboard': return <Clapperboard size={24} />;
        default: return <Play size={24} />;
    }
  };

  const getIconBg = (icon: string) => {
      switch(icon) {
          case 'moon': return '#e0e7ff'; // Indigo tint
          case 'clapperboard': return '#fce7f3'; // Pink tint
          default: return '#e3f2fd'; // Blue tint
      }
  };

  return (
    <div className="page-container">
      <h2 className="section-title">루틴 추천</h2>
      {routines.map(routine => (
        <div key={routine.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div style={{ 
                    fontSize: 24, 
                    background: getIconBg(routine.icon), 
                    color: '#333',
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    {getIcon(routine.icon)}
                </div>
                <div>
                    <h3 style={{ fontWeight: 'bold' }}>{routine.name}</h3>
                    <p style={{ fontSize: 12, color: '#8e8e93', marginTop: 4 }}>{routine.description}</p>
                </div>
            </div>
            <button onClick={() => onRunRoutine(routine.id)} className="btn btn-primary" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0 }}>
                <Play size={20} fill="currentColor" />
            </button>
        </div>
      ))}
    </div>
  );
};

export const DeviceListTab: React.FC<{ devices: Device[]; onDeviceClick: (d: Device) => void }> = ({ devices, onDeviceClick }) => {
    return (
        <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {devices.map(device => (
                <button key={device.id} onClick={() => onDeviceClick(device)} className="card" style={{ textAlign: 'left', margin: 0, border: device.isConnected ? '1px solid #007aff' : 'none' }}>
                    <div style={{ marginBottom: 12, width: 32, height: 32, borderRadius: '50%', background: device.isOn ? '#e3f2fd' : '#f2f2f7', color: device.isOn ? '#007aff' : '#8e8e93', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{device.name}</div>
                    <div style={{ fontSize: 12, color: '#8e8e93' }}>{device.room}</div>
                    {!device.isConnected && <div style={{ fontSize: 10, color: '#ef4444', marginTop: 4 }}>연결 필요</div>}
                </button>
            ))}
        </div>
    )
}