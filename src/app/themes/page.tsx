"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import { Category } from "@/data/places";
import AdBanner from "@/components/AdBanner";

export default function ThemesPage() {
  const router = useRouter();
  const { setActiveCategory } = useMapStore();

  const handleThemeClick = (category: Category) => {
    setActiveCategory(category);
    router.push("/map");
  };

  const themes: { title: string; category: Category; emoji: string; desc: string; bgImage: string }[] = [
    { title: "생생한 직업·진로 체험", category: "색다른 경험", emoji: "👩‍🚒", desc: "소방관, 아나운서, 의사까지! 아이의 꿈을 키워주는 롤플레잉", bgImage: "/images/bg_career.png" },
    { title: "미래 과학자 캠프", category: "박물관", emoji: "🔭", desc: "코딩, AI, 우주 등 과학의 세계로 빠져드는 체험", bgImage: "/images/bg_experience.png" },
    { title: "살아있는 역사 탐방", category: "박물관", emoji: "🏛️", desc: "아이와 함께 걷는 교과서 밖 역사 투어 (방학숙제 1순위!)", bgImage: "/images/bg_museum.png" },
    { title: "초대형 실내 테마파크", category: "체험학습", emoji: "🎢", desc: "날씨 걱정 뚝! 하루 종일 뛰어놀 수 있는 거대한 실내 놀이터", bgImage: "/images/bg_themepark.png" },
    { title: "예술적 감수성 충전", category: "색다른 경험", emoji: "🎨", desc: "오감을 자극하는 어린이 미술관 및 창작 체험 클래스", bgImage: "/images/bg_festival.png" },
    { title: "에너지 뿜뿜 액티비티", category: "체험학습", emoji: "🏃‍♂️", desc: "바운스 트램폴린, 실내 서핑 등 에너지를 발산하는 장소", bgImage: "/images/bg_stay.png" },
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

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20 pt-28 md:pt-32 space-y-12 min-h-screen relative z-10">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 tracking-tight drop-shadow-sm mb-4">테마별 추천 코스 🎈</h1>
            <p className="text-slate-600 font-bold text-lg">방학 맵이 엄선한 최고의 장소들을 테마별로 만나보세요.</p>
          </div>
          
          <AdBanner slot="themes-top" className="h-28 bg-white/80 shadow-sm border border-slate-100" />
        </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
        {themes.map((theme, idx) => (
          <div 
            key={idx} 
            onClick={() => handleThemeClick(theme.category)}
            className="group relative overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer h-64 border-4 border-white/50"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${theme.bgImage})` }}
            />
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="text-6xl mb-2 group-hover:scale-110 group-hover:-rotate-12 transition-transform origin-bottom-left drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative z-10">{theme.emoji}</div>
              <h3 className="text-2xl font-black text-white mb-2 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{theme.title}</h3>
              <p className="text-base text-slate-100 font-bold leading-relaxed relative z-10 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{theme.desc}</p>
            </div>
            
            {/* Decorative Shine */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
