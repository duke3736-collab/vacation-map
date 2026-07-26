export interface Post {
  id: string;
  category: "방학후기" | "질문" | "정보공유" | "자유";
  title: string;
  content: string;
  nickname: string;
  like_count: number;
  view_count: number;
  created_at: string;
  comment_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  nickname: string;
  created_at: string;
}

export const INITIAL_POSTS: Post[] = [
  {
    id: "sample-1",
    category: "방학후기",
    title: "🏖️ 초등학생 아이와 함께 다녀온 국립중앙박물관 사유의 방 후기!",
    content: "이번 방학을 맞이해 초등 3학년 아이와 함께 국립중앙박물관에 다녀왔습니다. 반가사유상이 전시된 '사유의 방'은 조용하고 몽환적인 분위기라 아이도 감탄하더라고요! 어린이박물관은 미리 웹사이트에서 예약하고 가셔야 대기 없이 입장할 수 있으니 참고하세요. 주차는 평일 오전에 가시면 수월합니다.",
    nickname: "방학마스터",
    like_count: 24,
    view_count: 142,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    comment_count: 3,
  },
  {
    id: "sample-2",
    category: "정보공유",
    title: "📢 2026 여름방학 서울시 무료 어린이 체험 프로그램 총정리",
    content: "서울시 생태공원 및 박물관에서 진행하는 방학 특별 무료 체험 프로그램 일정입니다.\n\n1. 보라매공원 어린이 생태탐험 (선착순 접수)\n2. 한성백제박물관 역사 퀴즈 교실\n3. 서울식물원 주말 가족 가드닝 교실\n\n공공서비스예약 사이트(yeyak.seoul.go.kr)에서 신청 가능하니 미리 로그인해두세요!",
    nickname: "정보통맘",
    like_count: 45,
    view_count: 389,
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    comment_count: 5,
  },
  {
    id: "sample-3",
    category: "질문",
    title: "❓ 초등 4학년 방학 동안 가볼 만한 과학관 추천해주세요!",
    content: "국립과천과학관은 지난 방학 때 다녀왔는데 이번에는 조금 색다른 우주/로봇 관련 체험이 가능한 박물관이나 체험관을 찾고 있습니다. 수도권 근교로 당일치기 다녀올 만한 곳 추천 부탁드려요!",
    nickname: "탐구왕아빠",
    like_count: 12,
    view_count: 98,
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    comment_count: 4,
  },
  {
    id: "sample-4",
    category: "방학후기",
    title: "🏰 경복궁 야간개장 한복 입고 아이들과 다녀왔어요",
    content: "시원한 여름밤 경복궁 야간 투어 다녀왔습니다! 한복 착용자는 무료 입장 혜택이 있어서 온 가족이 한복 맞춰 입고 다녀왔네요. 근정전 앞 광장에서 찍은 사진이 정말 인생샷으로 남았습니다. 아이들도 조선시대 왕이 된 것 같다며 너무 좋아했어요.",
    nickname: "한복나들이",
    like_count: 38,
    view_count: 215,
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    comment_count: 2,
  },
  {
    id: "sample-5",
    category: "자유",
    title: "💬 방학 시작 2주차... 모든 부모님들 화이팅입니다! 😂",
    content: "삼시세끼 챙기랴, 체험학습 계획 짜랴 매일매일 바쁘지만 아이가 박물관에서 신나게 체험하는 모습 보면 뿌듯하기도 하네요. 다들 이번 방학 건강하고 보람차게 보내봅시다!",
    nickname: "슬기로운방학",
    like_count: 53,
    view_count: 310,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    comment_count: 7,
  },
  {
    id: "sample-6",
    category: "정보공유",
    title: "💡 월요일 휴관일 피해서 가볼 만한 국립 박물관 리스트",
    content: "대부분의 국립박물관은 월요일이 휴관이지만, 일부 전시관이나 야외 공원은 월요일에도 개방하는 곳이 있습니다!\n- 전쟁기념관 (월요일 휴관이지만 공휴일 월요일은 개관)\n- 서울어린이대공원 (연중무휴)\n- 뚝섬 자벌레 쉼터\n\n월요일 방문 전 꼭 전화나 홈페이지 공지를 재확인하세요!",
    nickname: "나들이꿀팁",
    like_count: 29,
    view_count: 176,
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    comment_count: 1,
  },
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  "sample-1": [
    { id: "c1", post_id: "sample-1", nickname: "역사사랑", content: "사유의 방 정말 강추해요! 조명이 독특해서 인상 깊었습니다.", created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
    { id: "c2", post_id: "sample-1", nickname: "초등맘", content: "어린이박물관 예약 꿀팁 감사해요! 바로 예약했어요.", created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
    { id: "c3", post_id: "sample-1", nickname: "주차고수", content: "평일 10시 전에 도착하면 지하 주차장 넉넉합니다!", created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  ],
  "sample-2": [
    { id: "c4", post_id: "sample-2", nickname: "달려라엄마", content: "좋은 정보 감사합니다! 바로 신청하러 갑니다.", created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  ],
  "sample-3": [
    { id: "c5", post_id: "sample-3", nickname: "인천맘", content: "인천어린이과학관이나 강화자연사박물관도 4학년 아이들 가기에 참 좋습니다!", created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
    { id: "c6", post_id: "sample-3", nickname: "우주덕후", content: "시흥 배곧 해송십리 생태공원이나 용인 어린이박물관도 추천합니다.", created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
  ],
};
