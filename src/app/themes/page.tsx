"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import { places, Category } from "@/data/places";

// 테마별 추천 장소 ID 목록 (수동 큐레이션 - places.ts ID 기준)
const THEME_PLACE_IDS: Record<string, string[]> = {
  // 직업·진로: 키자니아 서울(30), 키자니아 부산(38), 경기영어마을(110), 한국만화박물관(4), 한국민속촌(36), 국립중앙청소년수련원(113)
  "직업진로": ["30", "38", "110", "4", "36", "113"],
  // 과학우주: 과천과학관(1), 제주항공우주(5), 부산과학관(6), 대구과학관(7), 국립중앙과학관(202), 국립어린이과학관(211), 청소년우주센터(600), 송암천문대(112)
  "과학우주": ["1", "5", "6", "202", "211", "600", "112", "7"],
  // 역사문화: 국립중앙박물관(2), 국립경주박물관(20), 공주박물관(21), 부여박물관(22), 서울역사박물관(24), 한성백제박물관(25), 독립기념관(208), 안동하회마을(213), 전쟁기념관(206)
  "역사문화": ["2", "20", "208", "213", "206", "24", "25", "21"],
  // 자연생태: 국립생태원(46), 순천만습지(47), 설악자생식물원(48), 화담숲(49), 국립백두대간수목원(53), 양평양떼목장(57), 용인한택식물원(307), 광릉수목원(603)
  "자연생태": ["46", "47", "53", "57", "307", "603", "49", "48"],
  // 테마파크: 에버랜드(31), 레고랜드(35), 헬로키티아일랜드(12), 뽀로로타요(42), 아쿠아플라넷일산(34), 아쿠아플라넷제주(39), 대구네이처파크(51)
  "테마파크": ["31", "35", "34", "42", "39", "51", "12"],
  // 액티비티: 남이섬짚와이어(91), 스카이바이크(92), 레일바이크(93), 통영루지(95), 정선레일바이크(400), 설악케이블카(402), 태안별빛정원(403), 제주스쿠버(404)
  "액티비티": ["91", "92", "400", "402", "403", "95", "93", "404"],
};

export default function ThemesPage() {
  const router = useRouter();
  const { setActiveCategory } = useMapStore();

  const handleThemeClick = (category: Category) => {
    setActiveCategory(category);
    router.push("/map");
  };

  const handlePlaceClick = (placeId: string) => {
    router.push(`/map/${placeId}`);
  };

  // 각 테마별 장소 목록
  const getPlaces = (ids: string[]) =>
    ids.map(id => places.find(p => p.id === id)).filter(Boolean) as typeof places;

  const themes = [
    {
      key: "직업진로",
      title: "생생한 직업·진로 체험",
      category: "체험학습" as Category,
      emoji: "👩‍🚒",
      desc: "소방관, 방송인, 의사까지! 아이의 꿈을 키워주는 직업 체험",
      bgImage: "/images/bg_career.png",
      color: "from-orange-600 to-amber-500",
      highlight: "키자니아·영어마을·민속촌",
    },
    {
      key: "과학우주",
      title: "미래 과학자 캠프",
      category: "박물관" as Category,
      emoji: "🔭",
      desc: "항공우주·AI·천문대까지! 과학의 세계로 빠져드는 탐험",
      bgImage: "/images/bg_experience.png",
      color: "from-blue-700 to-sky-500",
      highlight: "과천과학관·제주항공우주박물관·청소년우주센터",
    },
    {
      key: "역사문화",
      title: "살아있는 역사 탐방",
      category: "박물관" as Category,
      emoji: "🏛️",
      desc: "교과서 밖으로 나온 역사! 방학숙제 1순위 역사 기행",
      bgImage: "/images/bg_museum.png",
      color: "from-purple-700 to-violet-500",
      highlight: "국립중앙박물관·독립기념관·안동하회마을",
    },
    {
      key: "자연생태",
      title: "자연 속 생태 탐험",
      category: "체험학습" as Category,
      emoji: "🌿",
      desc: "숲·습지·수목원에서 만나는 살아있는 자연 교과서",
      bgImage: "/images/bg_stay.png",
      color: "from-green-700 to-emerald-500",
      highlight: "국립생태원·순천만습지·백두대간수목원",
    },
    {
      key: "테마파크",
      title: "초대형 테마파크",
      category: "체험학습" as Category,
      emoji: "🎢",
      desc: "하루 종일 신나게! 아이와 함께하는 최고의 놀이 세계",
      bgImage: "/images/bg_themepark.png",
      color: "from-pink-600 to-rose-500",
      highlight: "에버랜드·레고랜드·아쿠아플라넷",
    },
    {
      key: "액티비티",
      title: "에너지 뿜뿜 액티비티",
      category: "색다른 경험" as Category,
      emoji: "🏄‍♂️",
      desc: "짚와이어·레일바이크·스쿠버다이빙 등 짜릿한 모험 가득",
      bgImage: "/images/bg_festival.png",
      color: "from-cyan-600 to-teal-500",
      highlight: "남이섬짚와이어·정선레일바이크·제주스쿠버",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-100 min-h-screen overflow-hidden">

      {/* Background Stickers */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none animate-[spin_600s_linear_infinite] scale-150"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20 pt-28 md:pt-32 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 tracking-tight drop-shadow-sm mb-4">
            테마별 추천 코스 🎈
          </h1>
          <p className="text-slate-700 font-bold text-lg">방학 맵이 엄선한 최고의 장소들을 테마별로 만나보세요.</p>
        </div>

        {/* 테마 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {themes.map((theme) => {
            const themePlaces = getPlaces(THEME_PLACE_IDS[theme.key] || []);
            return (
              <div
                key={theme.key}
                className="group rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer overflow-hidden border-4 border-white/60 bg-white"
              >
                {/* 테마 헤더 이미지 영역 */}
                <div
                  className="relative h-52 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${theme.bgImage})` }}
                  onClick={() => handleThemeClick(theme.category)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`} />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform origin-bottom-left drop-shadow-lg">
                      {theme.emoji}
                    </div>
                    <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">{theme.title}</h3>
                    <p className="text-base text-white/90 font-semibold leading-snug drop-shadow-md line-clamp-2">{theme.desc}</p>
                  </div>
                  {/* 전체 보기 버튼 */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleThemeClick(theme.category); }}
                      className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm font-black text-white border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      전체 보기 →
                    </button>
                  </div>
                </div>

                {/* 추천 장소 리스트 */}
                <div className="p-4 bg-white">
                  <p className="text-sm font-black text-gray-500 mb-3 uppercase tracking-wide">✨ 추천 장소</p>
                  <div className="space-y-2">
                    {themePlaces.slice(0, 4).map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handlePlaceClick(place.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left group/item border border-transparent hover:border-gray-100"
                      >
                        {/* 장소 썸네일 */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {place.imageUrl ? (
                            <img
                              src={place.imageUrl}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {theme.emoji}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-base text-gray-900 truncate group-hover/item:text-blue-600 transition-colors">
                            {place.name}
                          </div>
                          <div className="text-sm text-gray-500 font-medium truncate">{place.address.split(' ').slice(0, 2).join(' ')}</div>
                          {place.fee && (
                            <div className="text-sm text-gray-600 font-semibold mt-0.5 truncate">💵 {place.fee}</div>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-gray-300 group-hover/item:text-blue-400 transition-colors shrink-0">
                          chevron_right
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* 더보기 */}
                  <button
                    onClick={() => handleThemeClick(theme.category)}
                    className={`mt-3 w-full py-2.5 rounded-xl text-base font-black text-white bg-gradient-to-r ${theme.color} hover:opacity-90 transition-opacity`}
                  >
                    {themePlaces.length}개 장소 전체 보기 →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
