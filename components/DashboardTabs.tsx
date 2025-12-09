import React from 'react';
import { Device, Routine } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Play, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';

// --- Life Tab ---
interface LifeTabProps {
  devices: Device[];
  onDeviceToggle: (id: string, isOn: boolean) => void;
}

export const LifeTab: React.FC<LifeTabProps> = ({ devices, onDeviceToggle }) => {
  // Use actual powerConsumption data
  const energyData = devices.map(d => ({
      name: d.name,
      value: d.isOn ? d.powerConsumption : 0,
      original: d
  })).filter(item => item.value > 0 || item.original.isConnected); // Show connected items or active items

  const totalUsage = energyData.reduce((acc, curr) => acc + curr.value, 0);
  const SAFE_THRESHOLD = 300;
  const isSafe = totalUsage <= SAFE_THRESHOLD;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">SmartThings Energy</h2>
          {isSafe && (
              <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  <Leaf size={14} /> 목표 달성!
              </div>
          )}
      </div>
      
      <div className={`p-6 rounded-3xl shadow-sm border transition-colors duration-500 ${isSafe ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-end mb-6">
            <div>
                <p className="text-gray-500 text-sm mb-1">현재 총 전력 소비량</p>
                <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-bold transition-colors duration-500 ${isSafe ? 'text-green-600' : 'text-gray-800'}`}>
                        {totalUsage}
                    </p>
                    <span className="text-gray-500 font-medium">W</span>
                </div>
            </div>
            {!isSafe && (
                <div className="text-right">
                    <p className="text-xs text-gray-400">목표: {SAFE_THRESHOLD}W 이하</p>
                    <div className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold gap-1 mt-1 animate-pulse">
                        <AlertTriangle size={12} /> 과다 사용
                    </div>
                </div>
            )}
        </div>
        
        {/* Visualization of Goal */}
        <div className="relative h-64 w-full bg-white/50 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energyData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                <YAxis hide />
                <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                    contentStyle={{borderRadius: '12px', border:'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} 
                />
                <ReferenceLine y={SAFE_THRESHOLD} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'top', value: '안전 구간', fill: '#22c55e', fontSize: 10 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                    {energyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 500 ? '#ef4444' : (isSafe ? '#22c55e' : '#3b82f6')} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Action List */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-700">작동 중인 기기 상태</h3>
        {devices.filter(d => d.isOn).length === 0 ? (
            <div className="bg-green-100 p-6 rounded-2xl text-center text-green-700 border border-green-200">
                <Leaf className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">모든 불필요한 전원이 꺼졌습니다.</p>
                <p className="text-sm opacity-80">에너지가 절약되고 있습니다.</p>
            </div>
        ) : (
            devices.filter(d => d.isOn).map(device => (
                <div key={device.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${device.powerConsumption > 500 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {device.powerConsumption > 500 ? '⚡' : '💡'}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{device.name}</p>
                            <p className="text-xs text-gray-500">{device.powerConsumption}W 사용 중</p>
                        </div>
                    </div>
                    {/* Only show direct off button if connected */}
                    {device.isConnected ? (
                        <button 
                            onClick={() => onDeviceToggle(device.id, false)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-full transition-colors"
                        >
                            전원 끄기
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">연결 필요</span>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};

// --- Automation Tab ---
interface AutomationTabProps {
  routines: Routine[];
  onRunRoutine: (routineId: string) => void;
}

export const AutomationTab: React.FC<AutomationTabProps> = ({ routines, onRunRoutine }) => {
  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-2xl font-bold text-gray-800">루틴</h2>
      <div className="grid gap-4">
        {routines.map(routine => (
            <div key={routine.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                        {routine.icon === 'leaf' ? '🍃' : '🚪'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{routine.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{routine.description}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onRunRoutine(routine.id)}
                    className="p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
                >
                    <Play size={20} fill="currentColor" />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

// --- Device List Tab ---
interface DeviceListTabProps {
    devices: Device[];
    onDeviceClick: (device: Device) => void;
}

export const DeviceListTab: React.FC<DeviceListTabProps> = ({ devices, onDeviceClick }) => {
    return (
        <div className="p-4 space-y-4 pb-24">
            <h2 className="text-2xl font-bold text-gray-800">기기</h2>
            <div className="grid grid-cols-2 gap-4">
                {devices.map(device => (
                    <button 
                        key={device.id}
                        onClick={() => onDeviceClick(device)}
                        className={`p-4 rounded-2xl shadow-sm border flex flex-col items-start gap-3 text-left transition-colors ${
                            device.isConnected ? 'bg-white border-gray-100 hover:border-blue-300' : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${device.isOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            <div className={`w-3 h-3 rounded-full ${device.isOn ? 'bg-blue-600' : 'bg-gray-400'}`} />
                            {!device.isConnected && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{device.name}</p>
                            <p className="text-xs text-gray-500">{device.room}</p>
                            <div className="flex gap-2 mt-1">
                                {device.isConnected ? (
                                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">연결됨</span>
                                ) : (
                                    <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">미연결</span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}