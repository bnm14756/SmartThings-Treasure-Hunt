import { Device, Mission, Routine } from './types';

// Initial state: High energy usage devices are ON
export const INITIAL_DEVICES: Device[] = [
  { id: 'tv-1', name: '거실 TV', type: 'tv', room: 'Living Room', isOn: true, isConnected: false, powerConsumption: 150, value: 5, status: 'On', x: 25, y: 30 },
  { id: 'ac-1', name: '침실 에어컨', type: 'ac', room: 'Bedroom', isOn: true, isConnected: false, powerConsumption: 1200, value: 18, status: 'Cooling', x: 75, y: 30 },
  { id: 'light-1', name: '거실 조명', type: 'light', room: 'Living Room', isOn: true, isConnected: false, powerConsumption: 60, value: 100, status: 'On', x: 40, y: 40 },
  { id: 'airfryer-1', name: '에어프라이어', type: 'airfryer', room: 'Kitchen', isOn: true, isConnected: false, powerConsumption: 1800, value: 200, status: 'Cooking', x: 25, y: 75 },
  { id: 'fridge-1', name: '비스포크 냉장고', type: 'refrigerator', room: 'Kitchen', isOn: true, isConnected: false, powerConsumption: 100, value: 3, status: 'Cooling', x: 15, y: 65 },
  { id: 'washer-1', name: '세탁기', type: 'washer', room: 'Utility', isOn: true, isConnected: false, powerConsumption: 500, value: 0, status: 'Finished', x: 80, y: 80 },
];

export const ROUTINES: Routine[] = [
  { id: 'routine-1', name: '절전 모드', icon: 'leaf', description: '사용하지 않는 모든 기기의 전원을 끄고 대기전력을 차단합니다.' },
  { id: 'routine-2', name: '외출 모드', icon: 'door-open', description: '조명을 끄고 에어컨을 송풍 모드로 변경합니다.' },
];

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'SmartThings 연결',
    locationName: '거실',
    targetDeviceId: 'tv-1',
    description: '거실 TV를 찾아 SmartThings에 연결하고, 전원을 꺼보세요.',
    requiredAction: 'control',
    guideText: [
      '큰일이야! 전기 요금 폭탄을 막아야 해! 💸',
      '우선 거실 TV로 이동해서 SmartThings에 연결해줘.',
      '그 다음 전원 버튼을 눌러서 끄면 돼! 참 쉽지?'
    ],
    successCondition: (devices) => {
      const tv = devices.find(d => d.id === 'tv-1');
      return !!tv && tv.isConnected && !tv.isOn;
    }
  },
  {
    id: 2,
    title: '전력 소비 주범 찾기',
    locationName: '주방',
    targetDeviceId: 'airfryer-1',
    description: '가장 전기를 많이 쓰는 에어프라이어를 찾아 연결하고 전원을 차단하세요.',
    requiredAction: 'control',
    guideText: [
      '저기 에어프라이어가 켜져있어! 😱',
      '저게 전기를 제일 많이 먹어. 빨리 가서 연결하고 꺼주자!'
    ],
    successCondition: (devices) => {
      const fryer = devices.find(d => d.id === 'airfryer-1');
      return !!fryer && fryer.isConnected && !fryer.isOn;
    }
  },
  {
    id: 3,
    title: '에너지 모니터링 및 달성',
    locationName: '라이프 탭',
    targetDeviceId: undefined,
    description: '남은 기기(에어컨, 세탁기 등)를 모두 연결하고 끄세요. "라이프" 탭에서 에너지 사용량이 초록색 구간에 도달하면 성공입니다!',
    requiredAction: 'life_check',
    guideText: [
      '아직 전기를 쓰는 기기들이 남아있어.',
      '집 안을 돌아다니며 에어컨이랑 세탁기도 꺼줘.',
      '"라이프" 탭을 확인하면 요금이 줄어드는 게 보일거야!'
    ],
    successCondition: (devices) => {
      // This condition is handled globally in App.tsx via energy calculation
      return false; 
    }
  }
];