"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { places } from "@/data/places";
import { useMapStore } from "@/store/useMapStore";

export default function PalaceTourPage() {
  const router = useRouter();
  const { setSelectedTag, setActiveCategory, setFocusedPlaceId } = useMapStore();
  
  // 궁궐 데이터 필터링
  const palacePlaces = places.filter(p => p.tags && p.tags.includes("궁투어"));

  const handleShowOnMap = (placeId: string) => {
    setSelectedTag(null);
    setActiveCategory("궁투어");
    setFocusedPlaceId(placeId);
    router.push("/map");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 relative overflow-hidden">
      {/* Background Stickers */}
      <div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none animate-[spin_600s_linear_infinite] scale-150"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      {/* 상단 네비게이션 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between h-16">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined font-bold">arrow_back</span>
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">시간을 걷는 서울 궁궐 투어 코스 🏯</h1>
        <button 
          onClick={() => {
            setSelectedTag(null);
            setActiveCategory("궁투어");
            router.push("/map");
          }}
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">map</span>
          <span>전체 지도 보기</span>
        </button>
      </header>

      {/* 헤더 배너 영역 */}
      <section className="bg-gradient-to-br from-amber-800 to-orange-950 text-white px-6 py-16 relative overflow-hidden shrink-0 mt-0 z-10">
        <div className="absolute inset-0 bg-[url('/images/bg_palace.png')] opacity-25 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest text-orange-100 uppercase">Special Historical Course</span>
          <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-md">서울 5대 궁궐 역사 탐방</h2>
          <p className="text-orange-100/90 text-sm md:text-lg font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            조선 왕조 500년의 역사가 숨 쉬는 서울의 5대 궁궐. <br />
            아이들과 함께 책 속의 역사를 눈으로 확인하고 몸으로 느끼는 교과 맞춤형 답사 코스입니다.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-10 relative z-10">
        {/* 궁궐 카드 리스트 */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 px-1">
            <span className="text-3xl">🏛️</span>
            <span>서울 5대 궁궐 핵심 정보</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palacePlaces.map((place) => (
              <div 
                key={place.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="h-44 bg-slate-100 relative">
                  <img 
                    src={place.imageUrl} 
                    alt={place.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm">
                    {place.name}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900">{place.name}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{place.address}</p>
                    
                    {/* 교과 연계 힌트 미니 배지 */}
                    {place.curriculumLinks && place.curriculumLinks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {place.curriculumLinks.map((link, idx) => (
                          <span 
                            key={idx} 
                            className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                            title={`${link.grade} ${link.subject} - ${link.unit}`}
                          >
                            📚 {link.grade} {link.subject}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1 mt-2 text-slate-600">
                      <div>🕒 {place.hours}</div>
                      <div>💵 {place.fee}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleShowOnMap(place.id)}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                    지도에서 위치 보기
                  </button>
                </div>
              </div>
            ))}

            {/* 6번째 블로그 배너 카드 (경희궁 옆자리) */}
            <a 
              href="https://weknews.com/%ec%84%9c%ec%9a%b8-%ea%b6%81%ed%88%ac%ec%96%b4-4%eb%8c%80%ea%b6%81-%ec%95%bc%ea%b0%84-%ea%b0%9c%ec%9e%a5-%ea%b8%b0%ea%b0%84-%ec%98%88%ec%95%bd-%eb%b0%a9%eb%b2%95/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col group"
            >
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                <img 
                  src="https://weknews.com/wp-content/uploads/2026/04/iShot_2026-04-26_20.30.44.webp" 
                  alt="서울 고궁 야간 개장" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm">
                  국내 여행 / 체험 학습
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-bold">2026-04-26</div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    서울 4대궁 야간 개장 기간 & 예약 방법 🌙
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    덕수궁 밤의 석조전, 창경궁 물빛연화, 경복궁 별빛야행, 창덕궁 달빛기행 실전 팁과 방문 가이드를 총정리하여 소개합니다.
                  </p>
                </div>

                <div className="text-blue-600 font-black text-sm flex items-center gap-1 mt-2">
                  <span>자세히 보러가기</span>
                  <span className="material-symbols-outlined text-[16px] font-bold transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
