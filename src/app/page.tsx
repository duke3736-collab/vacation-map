import Link from "next/link";
import React from "react";
import CoupangWidget from "@/components/CoupangWidget";
import WordPressSection from "@/components/WordPressSection";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-28 md:pt-32 pb-24 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-100 overflow-hidden">
      
      {/* Background Stickers Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none animate-[spin_600s_linear_infinite] scale-150"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="space-y-6 relative z-10 w-full max-w-4xl mx-auto">
        <h1 className="flex flex-col items-center justify-center gap-2 font-black tracking-tight drop-shadow-sm">
          <span className="text-4xl md:text-5xl text-slate-700 -rotate-2 transform hover:rotate-2 transition-transform duration-300">
            이번 방학엔
          </span>
          <span className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 drop-shadow-md rotate-1 transform hover:-rotate-1 transition-transform duration-300 mt-2">
            어디로 떠나볼까요?
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto bg-white/60 px-6 py-3 rounded-full backdrop-blur-md border border-white shadow-sm mt-8 inline-block">
          전국 10,000개 이상의 체험학습, 박물관, 축제 정보를 지도로 한눈에! <br className="hidden md:block" />
          우리아이 맞춤형 방학 일정을 지금 바로 계획해보세요.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto py-8 relative z-10">
        {[
          { image: "/images/bg_museum.png", title: "박물관 탐험" },
          { image: "/images/bg_experience.png", title: "오감 체험학습" },
          { image: "/images/bg_career.png", title: "직업·진로 체험" },
          { image: "/images/bg_themepark.png", title: "실내 테마파크" },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer aspect-square flex flex-col justify-end"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative z-10 p-5 text-left">
              <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 쿠팡 파트너스 네이티브 위젯 (2개 노출) */}
      <div className="w-full max-w-5xl mx-auto relative z-10 my-4 text-left">
        <h3 className="text-lg font-black text-slate-700 mb-4 px-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-rose-500 text-[20px]">shopping_bag</span>
          <span>아이와 함께하는 여행 필수 아이템 추천 🎒</span>
        </h3>
        <CoupangWidget limit={2} layout="grid" />
      </div>

      <Link 
        href="/map" 
        className="relative z-10 group inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-12 py-6 rounded-full text-2xl font-black shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.6)] hover:-translate-y-2 transition-all active:scale-90"
      >
        <span className="text-3xl group-hover:animate-bounce">🚀</span>
        <span className="drop-shadow-sm tracking-wide">신나는 보물지도 펼치기!</span>
        <span className="text-3xl group-hover:animate-bounce">🗺️</span>
      </Link>

      {/* 워드프레스 블로그 글 소개 연동 섹션 */}
      <div className="w-full max-w-5xl mx-auto relative z-10 mt-16 pt-16 border-t border-slate-200 text-left">
        <WordPressSection limit={3} layout="grid" />
      </div>
    </div>
  );
}
