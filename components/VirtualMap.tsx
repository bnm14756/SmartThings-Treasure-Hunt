import React from 'react';
import { Device, Position } from '../types';
import { Tv, ThermometerSnowflake, Lightbulb, ChefHat, Refrigerator, WashingMachine, Flower } from 'lucide-react';

interface VirtualMapProps {
  devices: Device[];
  avatarPosition: Position;
  onMapClick: (x: number, y: number) => void;
  onDeviceClick: (device: Device) => void; 
}

const Room: React.FC<{ name: string; className: string }> = ({ name, className }) => (
  <div className={`absolute bg-white/90 rounded-2xl flex items-center justify-center pointer-events-none 
      border-4 border-gray-300 
      shadow-[4px_4px_0px_rgba(209,213,219,1),inset_0_0_20px_rgba(0,0,0,0.05)]
      ${className}`}
  >
     {/* Wall Tops Effect - lighter border on top/left is standard, but here we simulate a blocky raised wall */}
     
     {/* Floor Pattern */}
     <div className="absolute inset-0 opacity-10 rounded-xl" 
         style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
     </div>

    <span className="text-gray-300 font-black text-2xl uppercase select-none tracking-widest opacity-40 transform -rotate-12 z-0">
      {name}
    </span>
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
      default: return <div className="w-6 h-6 bg-gray-500" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`absolute w-12 h-12 rounded-2xl shadow-md flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 z-10 ${
        device.isConnected 
            ? (device.isOn 
                ? 'bg-blue-600 text-white shadow-blue-200 ring-2 ring-blue-300' // ON State: Bright Blue
                : 'bg-white text-gray-300 border-2 border-gray-200')     // OFF State: Dull Gray
            : 'bg-gray-200 text-gray-400 border-2 border-gray-300'       // Unconnected State
      }`}
      style={{
        left: `${device.x}%`,
        top: `${device.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {getIcon()}
      {/* Status Indicators */}
      {device.status === 'Cooking' && device.isOn && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
      )}
      {!device.isConnected && (
         <span className="absolute -bottom-2 -right-2 w-5 h-5 bg-gray-600 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm">?</span>
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
    <div className="w-full h-full relative overflow-hidden bg-gray-100 p-4 flex items-center justify-center">
        <div 
            className="w-full max-w-2xl aspect-square relative bg-[#e5e7eb] rounded-[3rem] shadow-inner border-8 border-white overflow-hidden cursor-crosshair"
            onClick={handleContainerClick}
        >
            {/* Rooms with "3D" Wall Styling */}
            <Room name="Living Room" className="top-4 left-4 w-[55%] h-[45%]" />
            <Room name="Kitchen" className="bottom-4 left-4 w-[40%] h-[45%]" />
            <Room name="Bedroom" className="top-4 right-4 w-[35%] h-[45%]" />
            <Room name="Utility" className="bottom-4 right-4 w-[50%] h-[45%]" />
            
            {/* Devices */}
            {devices.map(device => (
                <DeviceIcon 
                    key={device.id} 
                    device={device} 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent map click
                        onDeviceClick(device); // Move to device
                    }} 
                />
            ))}

            {/* Avatar Character (Blueming) */}
            <div 
                className="absolute w-14 h-14 flex flex-col items-center justify-center z-20 transition-all duration-700 ease-in-out"
                style={{
                    left: `${avatarPosition.x}%`,
                    top: `${avatarPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* Name Tag */}
                <div className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full mb-1 whitespace-nowrap backdrop-blur-sm shadow-sm">
                    나 (Me)
                </div>
                
                {/* Blueming Body */}
                <div className="relative w-14 h-14 flex items-center justify-center animate-bounce-slow">
                    {/* Flower Petals */}
                    <Flower className="w-16 h-16 text-blue-500 absolute drop-shadow-lg" fill="currentColor" strokeWidth={1.5} />
                    
                    {/* Face */}
                    <div className="w-7 h-7 bg-white rounded-full relative z-10 shadow-inner top-0.5"></div>
                    
                    {/* Glasses */}
                    <div className="absolute z-20 top-[40%] flex gap-0.5">
                        <div className="w-3 h-3 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full border border-orange-400/50 shadow-sm"></div>
                        <div className="w-3 h-3 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full border border-orange-400/50 shadow-sm"></div>
                    </div>
                </div>

                {/* Simple Shadow */}
                <div className="absolute -bottom-1 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>
            </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-500 pointer-events-none shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            터치하여 이동하세요
        </div>
    </div>
  );
};