export type TabType = 'home' | 'devices' | 'life' | 'automation' | 'menu';

export interface Device {
  id: string;
  name: string;
  type: 'tv' | 'ac' | 'light' | 'washer' | 'airfryer' | 'refrigerator';
  room: string;
  isOn: boolean;
  isConnected: boolean;
  powerConsumption: number; // Wattage
  value?: string | number;
  status?: string;
  x: number;
  y: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  locationName: string;
  targetDeviceId?: string;
  requiredAction: 'control' | 'automation' | 'life_check' | 'status_check';
  successCondition: (devices: Device[]) => boolean;
  guideText: string[]; // Changed to array for pagination
}

export interface Routine {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Position {
  x: number;
  y: number;
}