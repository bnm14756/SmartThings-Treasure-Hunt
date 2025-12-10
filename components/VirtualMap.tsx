
import React from 'react';
import { Device, Position } from '../types';
import { Tv, ThermometerSnowflake, Lightbulb, ChefHat, Refrigerator, WashingMachine, Flower } from 'lucide-react';

interface VirtualMapProps {
  devices: Device[];
  avatarPosition: Position;
  onMapClick: (x: number, y: number) => void;
  onDeviceClick: (device: Device) => void; 
}

const Room: React.FC<{ name: string; className: string; style: React.CSSProperties }> = ({ name, style }) => (
  <div className="room" style={style}>
    <span className="room-label">{name}</span>
  </div>
);

const DeviceIcon: React.FC<{ device: Device; onClick: (e: React.MouseEvent) => void }> = ({ device, onClick }) => {
  const getIcon = () => {
    switch (device.type) {
      case 'tv': return <Tv size={20} />;
      case 'ac': return <ThermometerSnowflake size={20} />;
      case 'light': return <Lightbulb size={20} />;
      case 'airfryer': return <ChefHat size={20} />;
      case 'refrigerator': return <Refrigerator size={20} />;
      case 'washer': return <WashingMachine size={20} />;
      default: return <div style={{ width: 24, height: 24 }} />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`device-node ${device.isConnected ? 'connected' : ''} ${device.isOn ? 'on' : ''}`}
      style={{
        left: `${device.x}%`,
        top: `${device.y}%`,
      }}
    >
      {getIcon()}
      {device.status === 'Cooking' && device.isOn && (
        <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#ff3b30', borderRadius: '50%' }}></span>
      )}
      {!device.isConnected && (
         <span style={{ position: 'absolute', bottom: -8, right: -8, width: 20, height: 20, background: '#666', color: 'white', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid white' }}>?</span>
      )}
    </button>
  );
};

export const VirtualMap: React.FC<VirtualMapProps> = ({ devices, avatarPosition, onMapClick, onDeviceClick }) => {
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onMapClick(x, y);
  };

  return (
    <div className="map-wrapper">
        <div className="virtual-house" onClick={handleContainerClick}>
            <Room name="Living Room" style={{ top: '4%', left: '4%', width: '55%', height: '45%' }} className="" />
            <Room name="Kitchen" style={{ bottom: '4%', left: '4%', width: '40%', height: '45%' }} className="" />
            <Room name="Bedroom" style={{ top: '4%', right: '4%', width: '35%', height: '45%' }} className="" />
            <Room name="Utility" style={{ bottom: '4%', right: '4%', width: '50%', height: '45%' }} className="" />
            
            {devices.map(device => (
                <DeviceIcon key={device.id} device={device} onClick={(e) => { e.stopPropagation(); onDeviceClick(device); }} />
            ))}

            <div className="avatar" style={{ left: `${avatarPosition.x}%`, top: `${avatarPosition.y}%` }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 10, marginBottom: 4, textAlign: 'center', width: 'fit-content', margin: '0 auto' }}>
                    나 (Me)
                </div>
                <div className="animate-bounce" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Flower size={48} color="#007aff" fill="currentColor" />
                    <div style={{ width: 24, height: 24, background: 'white', borderRadius: '50%', position: 'absolute' }}></div>
                    <div style={{ position: 'absolute', top: 18, display: 'flex', gap: 2 }}>
                        <div style={{ width: 8, height: 8, background: '#ffcc00', borderRadius: '50%' }}></div>
                        <div style={{ width: 8, height: 8, background: '#ffcc00', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
