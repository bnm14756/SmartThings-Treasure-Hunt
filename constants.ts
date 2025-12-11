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
  { id: 'routine-3', name: '취침 모드', icon: 'moon', description: '모든 조명과 TV를 끄고 에어컨을 쾌적 수면 온도로 맞춥니다.' },
  { id: 'routine-4', name: '영화 모드', icon: 'clapperboard', description: 'TV를 켜고 조명을 어둡게 조절하여 분위기를 만듭니다.' },
];

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'SmartThings 연결',
    locationName: '거실',
    targetDeviceId: 'tv-1',
    description: '거실 TV 가까이 이동해서 기기를 찾고, SmartThings에 연결하세요.',
    requiredAction: 'control',
    guideText: [
      '큰일 났어! 이번 달 전기 요금이 엄청나게 나올 것 같아. 💸',
      '일단 거실 TV 쪽으로 가볼래?',
      '가까이 가서 TV를 누르고 SmartThings에 연결해서 끄면 돼!'
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
    description: '전기를 많이 쓰는 에어프라이어 앞으로 가서 연결하고 전원을 차단하세요.',
    requiredAction: 'control',
    guideText: [
      '앗, 주방에 에어프라이어가 계속 켜져 있네! 😱',
      '주방으로 가서 기기를 한 번 눌러봐.',
      '얼른 연결해서 전원을 꺼야 해.'
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
    description: '남은 기기들도 가까이 가서 연결하세요. "라이프" 탭에서 에너지 사용량이 초록색 구간에 도달하면 성공입니다!',
    requiredAction: 'life_check',
    guideText: [
      '아직 집안에 연결 안 된 기기들이 더 있어.',
      '다른 방들도 돌아다니면서 다 찾아보자.',
      '불필요한 전기를 끄고 사용량을 초록색 구간까지 줄이면 성공이야!'
    ],
    successCondition: (devices) => {
      // This condition is handled globally in App.tsx via energy calculation
      return false; 
    }
  }
];