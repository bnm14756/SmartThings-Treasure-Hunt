
import React from 'react';
import { Device, Routine } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Play, AlertTriangle, Leaf } from 'lucide-react';

export const LifeTab: React.FC<{ devices: Device[]; onDeviceToggle: (id: string, isOn: boolean) => void }> = ({ devices, onDeviceToggle }) => {
  const energyData = devices.map(d => ({ name: d.name, value: d.isOn ? d.powerConsumption : 0, original: d })).filter(item => item.value > 0 || item.original.isConnected);
  const totalUsage = energyData.reduce((acc, curr) => acc + curr.value, 0);
  const isSafe = totalUsage <= 300;

  return (
    <div className="page-container">
      <div className="card" style={{ background: isSafe ? '#dcfce7' : 'white', borderColor: isSafe ? '#86efac' : 'transparent' }}>
        <p className="section-title">SmartThings Energy</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h2 style={{ fontSize: 40, fontWeight: 'bold', color: isSafe ? '#16a34a' : '#1c1c1e' }}>{totalUsage}</h2>
            <span>W</span>
        </div>
        {!isSafe && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> 에너지 과다 사용</div>}
        
        <div style={{ height: 200, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                <ReferenceLine y={300} stroke="#22c55e" strokeDasharray="3 3" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {energyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 500 ? '#ef4444' : (isSafe ? '#22c55e' : '#007aff')} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
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
  return (
    <div className="page-container">
      <h2 className="section-title">루틴 추천</h2>
      {routines.map(routine => (
        <div key={routine.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div style={{ fontSize: 24, background: '#e3f2fd', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {routine.icon === 'leaf' ? '🍃' : '🚪'}
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
                </button>
            ))}
        </div>
    )
}
