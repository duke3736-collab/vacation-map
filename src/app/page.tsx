import Link from "next/link";
import React from "react";
import CoupangBanner from "@/components/CoupangBanner";
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
          { image: "/images/bg_museum.png", title: "박물관 탐험", href: "/themes" },
          { image: "/images/bg_experience.png", title: "오감 체험학습", href: "/themes" },
          { image: "/images/bg_career.png", title: "직업·진로 체험", href: "/themes" },
          { image: "/images/bg_themepark.png", title: "실내 테마파크", href: "/themes" },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer aspect-square flex flex-col justify-end"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 p-5 text-left">
              <span className="text-xl md:text-2xl font-black text-white drop-shadow-md">{item.title}</span>
              <p className="text-white/80 text-xs font-bold mt-1 hidden md:block">탭하여 보기 →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 쿠팡 파트너스 단풍맵 스타일 기획전 배너 (공부방 가구, 키즈 펜션 테마) */}
      <div className="w-full max-w-5xl mx-auto relative z-10 my-4 text-left">
        <h3 className="text-lg font-black text-slate-700 mb-4 px-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-rose-500 text-[20px]">shopping_bag</span>
          <span>방학 맞이 공부방 가구 & 인기 여행 기획전 🎒</span>
        </h3>
        <CoupangBanner ids={[6, 5]} layout="grid" />
      </div>

      <Link 
        href="/map" 
        className="relative z-10 group inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-12 py-6 rounded-full text-2xl font-black shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.6)] hover:-translate-y-2 transition-all active:scale-90"
      >
        <span className="text-3xl group-hover:animate-bounce">🚀</span>
        <span className="drop-shadow-sm tracking-wide">신나는 보물지도 펼치기!</span>
        <span className="text-3xl group-hover:animate-bounce">🗺️</span>
      </Link>

      {/* 방학 이야기 커뮤니티 배너 */}
      <div className="w-full max-w-5xl mx-auto relative z-10 px-2 my-6">
        <Link 
          href="/community" 
          className="group block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-[2rem] p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl transform translate-y-10 group-hover:scale-125 transition-transform duration-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 text-left">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                Parents Community 💬
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
                학부모를 위한 소통 공간, 방학 이야기
              </h2>
              <p className="text-violet-100 text-sm md:text-base leading-relaxed opacity-90 font-medium">
                체험학습 후기, 여름방학 물놀이 꿀팁, 박물관 도슨트 예약 정보 등 생생한 정보들을 나누고 고민을 함께 이야기해요. 로그인 없이도 즉시 자유게시판에 작성할 수 있습니다! 😊
              </p>
            </div>
            
            <div className="shrink-0 flex items-center">
              <span className="bg-white text-indigo-600 text-base md:text-lg font-black px-6 py-4 rounded-2xl group-hover:bg-indigo-50 transition-all shadow-md flex items-center gap-1.5 active:scale-95 duration-200">
                이야기 나누러 가기
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* WEKNEWS 패밀리 사이트 연동 섹션 */}
      <div className="w-full max-w-5xl mx-auto relative z-10 mt-20 pt-8 text-left">
        <h3 className="text-xl font-black text-slate-700 mb-6 px-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-500 text-[24px]">public</span>
          <span>더 많은 테마 지도를 만나보세요 🌍</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-2">
          <a href="https://map.weknews.com/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all aspect-[4/3] flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-black/30 to-black/10" />
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-30 group-hover:scale-110 group-hover:rotate-6 transition-transform z-0">🌊</div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">수영장·해수욕장</span>
                <h4 className="text-white text-2xl font-black mt-3 drop-shadow-sm tracking-tight">씨 맵 (Sea Map)</h4>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">arrow_forward</span>
              </div>
            </div>
          </a>
          
          <a href="https://download.weknews.com" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all aspect-[4/3] flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-black/40 to-black/10" />
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-30 group-hover:scale-110 group-hover:-rotate-6 transition-transform z-0">💻</div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">유용한 소프트웨어</span>
                <h4 className="text-white text-2xl font-black mt-3 drop-shadow-sm tracking-tight">소프트웨어 금고</h4>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">arrow_forward</span>
              </div>
            </div>
          </a>

          <a href="https://drive.weknews.com/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all aspect-[4/3] flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-black/40 to-black/10" />
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-30 group-hover:scale-110 group-hover:rotate-6 transition-transform z-0">🚗</div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">드라이브 코스</span>
                <h4 className="text-white text-2xl font-black mt-3 drop-shadow-sm tracking-tight">드라이브 맵</h4>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">arrow_forward</span>
              </div>
            </div>
          </a>

          <a href="https://maple.weknews.com/" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all aspect-[4/3] flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507371341162-763b5e419408?w=800&auto=format&fit=crop&q=80')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-black/40 to-black/10" />
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-30 group-hover:scale-110 group-hover:-rotate-6 transition-transform z-0">🍁</div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">가을 단풍 명소</span>
                <h4 className="text-white text-2xl font-black mt-3 drop-shadow-sm tracking-tight">단풍 맵</h4>
              </div>
              <div className="flex justify-end mt-auto">
                <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">arrow_forward</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* 워드프레스 블로그 글 소개 연동 섹션 */}
      <div className="w-full max-w-5xl mx-auto relative z-10 mt-16 pt-16 border-t border-slate-200 text-left">
        <WordPressSection limit={3} layout="grid" />
      </div>
    </div>
  );
}
