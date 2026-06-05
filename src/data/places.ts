export type Category = "박물관" | "색다른 경험" | "1달 살기" | "학원" | "체험학습" | "축제";

export interface Place {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  address: string;
  isIndoor?: boolean;
}

export const places: Place[] = [
  {
    id: "1",
    name: "국립과천과학관",
    category: "박물관",
    lat: 37.4385,
    lng: 127.0054,
    address: "경기 과천시 상하벌로 110",
    isIndoor: true,
  },
  {
    id: "2",
    name: "양평 농촌체험마을",
    category: "체험학습",
    lat: 37.5255,
    lng: 127.5621,
    address: "경기 양평군",
    isIndoor: false,
  },
  {
    id: "3",
    name: "제주도 한 달 살기 펜션",
    category: "1달 살기",
    lat: 33.3941,
    lng: 126.2396,
    address: "제주 한림읍",
    isIndoor: true,
  },
  {
    id: "4",
    name: "보령 머드축제",
    category: "축제",
    lat: 36.3048,
    lng: 126.5169,
    address: "충남 보령시 대천해수욕장",
    isIndoor: false,
  },
  {
    id: "5",
    name: "스카이 다이빙 센터",
    category: "색다른 경험",
    lat: 37.9542,
    lng: 127.7022,
    address: "강원 춘천시",
    isIndoor: false,
  },
  {
    id: "6",
    name: "어린이 영어 캠프",
    category: "학원",
    lat: 37.5665,
    lng: 126.9780,
    address: "서울 중구",
    isIndoor: true,
  }
];
