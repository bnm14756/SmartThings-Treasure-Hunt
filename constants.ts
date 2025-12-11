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
    title: '에너지 상태 확인',
    locationName: '라이프 탭',
    targetDeviceId: undefined,
    description: '현재 집안의 에너지 사용량이 심각합니다. 하단 "라이프" 탭을 눌러 상태를 확인하세요.',
    requiredAction: 'life_check',
    guideText: [
      '큰일 났어! 이번 달 전기 요금이 엄청나게 나올 것 같아. 💸',
      '얼마나 심각한지 한번 확인해볼까?',
      '아래 메뉴에서 "라이프" 탭을 눌러서 에너지 그래프를 확인해봐! 빨간색이면 위험해!'
    ],
    successCondition: (devices) => {
      // Logic handled in App.tsx (checking activeTab === 'life')
      return false;
    }
  },
  {
    id: 2,
    title: 'SmartThings 연결',
    locationName: '거실',
    targetDeviceId: 'tv-1',
    description: '다시 "홈"으로 돌아가서 거실 TV 가까이 이동해 SmartThings에 연결하고 끄세요.',
    requiredAction: 'control',
    guideText: [
      '으악! 그래프가 완전 빨간색(위험)이야! 😱',
      '당장 전기를 줄여야 해. 다시 "홈" 탭으로 돌아가자.',
      '거실에 켜져 있는 TV 근처로 가서 연결하고 전원을 꺼줘!'
    ],
    successCondition: (devices) => {
      const tv = devices.find(d => d.id === 'tv-1');
      return !!tv && tv.isConnected && !tv.isOn;
    }
  },
  {
    id: 3,
    title: '전력 소비 주범 찾기',
    locationName: '주방',
    targetDeviceId: 'airfryer-1',
    description: '전기를 많이 쓰는 에어프라이어 앞으로 가서 연결하고 전원을 차단하세요.',
    requiredAction: 'control',
    guideText: [
      'TV는 껐고... 아직도 전기를 많이 먹는 기기가 있어.',
      '주방으로 가볼래? 에어프라이어가 맹렬하게 돌아가고 있어!',
      '가까이 가서 연결하고 전원을 꺼버려!'
    ],
    successCondition: (devices) => {
      const fryer = devices.find(d => d.id === 'airfryer-1');
      return !!fryer && fryer.isConnected && !fryer.isOn;
    }
  },
  {
    id: 4,
    title: '최종 점검 및 보상',
    locationName: '라이프 탭',
    targetDeviceId: undefined,
    description: '남은 기기들도 끄고, 다시 "라이프" 탭으로 가서 에너지 사용량이 초록색으로 변했는지 확인하세요!',
    requiredAction: 'life_check',
    guideText: [
      '좋았어! 이제 다른 방에 켜진 기기들도 찾아서 다 꺼보자.',
      '에너지를 충분히 줄였다면 다시 "라이프" 탭으로 가봐.',
      '그래프가 초록색(안전)으로 변했다면 우리가 해낸 거야! 🎁'
    ],
    successCondition: (devices) => {
      // Logic handled in App.tsx (checking activeTab === 'life' && energy safe)
      return false; 
    }
  }
];