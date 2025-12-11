import React from 'react';
import { Device, Position } from '../types';
import { Tv, ThermometerSnowflake, Lightbulb, ChefHat, Refrigerator, WashingMachine, Flower } from 'lucide-react';

interface VirtualMapProps {
  devices: Device[];
  avatarPosition: Position;
  onMapClick: (x: number, y: number) => void;
  onDeviceClick: (device: Device) => void; 
}

// Furniture Components using CSS shapes
const Furniture: React.FC<{ type: string; style: React.CSSProperties }> = ({ type, style }) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    background: '#e5e5ea',
    border: '1px solid #d1d1d6',
    borderRadius: 4,
    ...style
  };

  if (type === 'bed') {
    return (
      <div style={baseStyle}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '25%', background: 'white', borderBottom: '1px solid #d1d1d6', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '30%', height: '10%', background: '#d1d1d6', borderRadius: 2 }}></div>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '30%', height: '10%', background: '#d1d1d6', borderRadius: 2 }}></div>
      </div>
    );
  }
  if (type === 'sofa') {
    return (
      <div style={{ ...baseStyle, borderRadius: 8 }}>
        <div style={{ position: 'absolute', top: -5, left: 0, right: 0, height: 5, background: '#d1d1d6', borderRadius: '4px 4px 0 0' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: -5, top: 0, width: 5, background: '#d1d1d6', borderRadius: '4px 0 0 4px' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: -5, top: 0, width: 5, background: '#d1d1d6', borderRadius: '0 4px 4px 0' }}></div>
      </div>
    );
  }
  if (type === 'table') {
    return <div style={{ ...baseStyle, borderRadius: '50%', border: '2px solid #d1d1d6' }}></div>;
  }
  if (type === 'counter') {
    return <div style={baseStyle}></div>;
  }
  
  return <div style={baseStyle}></div>;
};

const Room: React.FC<{ nameEn: string; nameKo: string; className: string; style: React.CSSProperties; children?: React.ReactNode }> = ({ nameEn, nameKo, style, children }) => (
  <div className="room" style={{ ...style, display: 'block' }}>
    <div style={{ position: 'absolute', top: 8, left: 12, zIndex: 5 }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#8e8e93' }}>{nameEn}</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1c1c1e', opacity: 0.6 }}>{nameKo}</div>
    </div>
    {children}
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
    <div className="map-wrapper" style={{ padding: 10 }}>
        <div className="virtual-house" onClick={handleContainerClick} style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1/1.1' }}>
            {/* Living Room */}
            <Room nameEn="Living Room" nameKo="거실" style={{ top: '2%', left: '2%', width: '58%', height: '48%' }} className="">
                <Furniture type="sofa" style={{ bottom: '15%', left: '10%', width: '30%', height: '50%' }} />
                <Furniture type="counter" style={{ top: '15%', right: '5%', width: '5%', height: '30%', background: '#333' }} /> {/* TV Stand */}
                <Furniture type="table" style={{ bottom: '30%', left: '50%', width: '20%', height: '20%' }} />
            </Room>

            {/* Kitchen */}
            <Room nameEn="Kitchen" nameKo="주방" style={{ bottom: '2%', left: '2%', width: '43%', height: '46%' }} className="">
                <Furniture type="counter" style={{ top: 0, left: 0, width: '100%', height: '25%', borderRadius: 0, borderTop: 'none' }} />
                <Furniture type="table" style={{ bottom: '20%', right: '20%', width: '35%', height: '35%', borderRadius: 4 }} />
            </Room>

            {/* Bedroom */}
            <Room nameEn="Bedroom" nameKo="침실" style={{ top: '2%', right: '2%', width: '36%', height: '48%' }} className="">
                 <Furniture type="bed" style={{ top: '15%', right: '10%', width: '50%', height: '60%' }} />
            </Room>

            {/* Utility */}
            <Room nameEn="Utility" nameKo="다용도실" style={{ bottom: '2%', right: '2%', width: '51%', height: '46%' }} className="">
                <Furniture type="counter" style={{ bottom: '10%', right: '10%', width: '80%', height: '20%' }} />
            </Room>
            
            {devices.map(device => (
                <DeviceIcon key={device.id} device={device} onClick={(e) => { e.stopPropagation(); onDeviceClick(device); }} />
            ))}

            <div className="avatar" style={{ left: `${avatarPosition.x}%`, top: `${avatarPosition.y}%`, transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 12, marginBottom: 4, textAlign: 'center', width: 'fit-content', margin: '0 auto', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    나 (Me)
                </div>
                <div className="animate-bounce" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <Flower size={56} color="#007aff" fill="currentColor" strokeWidth={1.5} />
                    <div style={{ width: 28, height: 28, background: 'white', borderRadius: '50%', position: 'absolute' }}></div>
                    <div style={{ position: 'absolute', top: 20, display: 'flex', gap: 3 }}>
                        <div style={{ width: 9, height: 9, background: '#ffcc00', borderRadius: '50%' }}></div>
                        <div style={{ width: 9, height: 9, background: '#ffcc00', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};