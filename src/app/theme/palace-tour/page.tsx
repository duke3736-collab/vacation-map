"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PalaceTourPage() {
  const router = useRouter();
  
  // 추후 관리자 페이지에서 변경할 수 있도록 State로 관리하거나 DB에서 불러오게 설계 가능.
  // 현재는 고객님의 워드프레스 글 URL을 하드코딩으로 넣거나 입력받을 수 있는 예시 상태.
  // 예시 URL: https://vacation.weknews.com/wp-content/... 
  // (실제 사용할 워드프레스 포스트 URL로 나중에 교체 필요)
  const [wpUrl, setWpUrl] = useState("https://vacation.weknews.com"); // 임시 URL

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined font-bold">arrow_back</span>
        </button>
        <h1 className="text-lg font-black text-slate-800 tracking-tight">궁투어 추천 코스</h1>
        <div className="w-10 h-10" /> {/* 균형용 빈 블록 */}
      </header>

      {/* 헤더 배너 영역 */}
      <section className="bg-gradient-to-br from-amber-700 to-orange-900 text-white px-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest text-orange-100 uppercase">Special Theme</span>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">시간을 걷는 서울 궁궐 투어</h2>
          <p className="text-orange-100/90 text-sm md:text-base font-medium leading-relaxed max-w-lg mx-auto">
            조선 왕조 500년의 역사가 숨 쉬는 서울의 5대 궁궐. 아이들과 함께 역사 속으로 생생한 체험학습을 떠나보세요!
          </p>
        </div>
      </section>

      {/* 워드프레스 본문 (Iframe Embed) 영역 */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col h-[70vh] relative">
          {/* Iframe 로딩 애니메이션 역할 (Iframe 렌더링 전/후 시각적 처리용) */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 -z-10">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
              <p className="text-sm font-bold animate-pulse">워드프레스 콘텐츠를 불러오는 중입니다...</p>
            </div>
          </div>
          
          {/* 실제 워드프레스 삽입부 */}
          <iframe 
            src={wpUrl}
            title="궁투어 소개 워드프레스"
            className="w-full h-full border-none z-10 bg-transparent"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>

        {/* 임시 테스트용 URL 변경기 (나중에 제거 가능) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-sm flex gap-2">
          <input 
            type="text" 
            value={wpUrl}
            onChange={(e) => setWpUrl(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors"
            placeholder="워드프레스 포스트 URL을 입력하세요"
          />
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold whitespace-nowrap">적용</button>
        </div>

      </main>
    </div>
  );
}
