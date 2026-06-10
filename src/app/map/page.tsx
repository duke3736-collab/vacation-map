"use client";

import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import MapClient from "@/components/MapClient";
import CoupangBanner from "@/components/CoupangBanner";
import WordPressSection from "@/components/WordPressSection";
import { useMapStore } from "@/store/useMapStore";

export default function MapPage() {
  const { setCenter, setLevel, level, setMyLocation } = useMapStore();

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(coords);
          setMyLocation(coords);
          setLevel(5); // zoom in closely
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          alert("위치 정보를 가져올 수 없습니다. GPS 권한을 확인해 주세요!");
        }
      );
    } else {
      alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    }
  };

  const handleZoomIn = () => {
    setLevel(Math.max(level - 1, 1));
  };

  const handleZoomOut = () => {
    setLevel(Math.min(level + 1, 14));
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-blue-50 text-slate-900 pt-16">
      {/* 맵 컨테이너 (가장 아래 깔림) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold">
            <div className="animate-pulse">지도를 불러오는 중입니다...</div>
          </div>
        }>
          <MapClient />
        </Suspense>
      </div>

      {/* 우측 컨트롤러 (루트 레벨 배치로 화면 밀림 및 잘림 현상 방지) */}
      <div className="absolute top-[120px] right-4 md:top-auto md:right-10 xl:right-[350px] md:bottom-14 z-30 flex flex-col gap-3 pointer-events-auto transition-all duration-300">
        <button 
          onClick={handleMyLocation}
          className="premium-glass w-12 h-12 rounded-full shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-95 cursor-pointer"
          title="내 위치로 이동"
        >
          <span className="material-symbols-outlined text-[24px]">my_location</span>
        </button>
        <div className="hidden md:flex premium-glass rounded-full shadow-md flex-col overflow-hidden">
          <button 
            onClick={handleZoomIn}
            className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-black/5 transition-colors border-b border-black/5 active:bg-black/10 cursor-pointer"
            title="확대"
          >
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-black/5 transition-colors active:bg-black/10 cursor-pointer"
            title="축소"
          >
            <span className="material-symbols-outlined text-[24px]">remove</span>
          </button>
        </div>
      </div>
      
      {/* 플로팅 UI 레이어 (맵 위로 뜸, 포인터 이벤트 제어) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col pt-16">
        


        {/* 메인 콘텐츠 영역 (사이드바 등) */}
        <div className="flex-1 flex relative pointer-events-none">
          <div className="hidden md:block pointer-events-auto absolute bottom-20 left-3 right-3 h-[40vh] md:relative md:bottom-auto md:left-auto md:right-auto md:h-[calc(100vh-4rem)] md:w-auto md:p-6 md:pb-4 transition-all shadow-2xl md:shadow-none rounded-3xl overflow-hidden md:rounded-none z-20">
            <Sidebar />
          </div>
          
          {/* 데스크탑 전용 우측 고정 정보 & 스폰서 패널 */}
          <div className="hidden xl:flex absolute top-0 right-0 h-full w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200 pointer-events-auto flex-col items-center py-6 px-4 gap-6 overflow-y-auto custom-scrollbar">
            
            {/* 워드프레스 여행 팁 칼럼 (세로형) */}
            <div className="w-full text-left">
              <h3 className="font-black text-sm text-slate-700 mb-3 flex items-center gap-1.5 px-1">
                <span className="material-symbols-outlined text-indigo-500 text-[18px]">lightbulb</span>
                <span>알찬 방학 여행 꿀팁 💡</span>
              </h3>
              <WordPressSection limit={2} layout="vertical" title="" />
            </div>

            <div className="w-full h-px bg-slate-100 my-1"></div>
            
            {/* 쿠팡 파트너스 추천 기획전 배너 (디지털 기기, 중등 참고서 테마) */}
            <div className="w-full text-left">
              <h3 className="font-black text-sm text-slate-700 mb-3 flex items-center gap-1.5 px-1">
                <span className="material-symbols-outlined text-rose-500 text-[18px]">shopping_bag</span>
                <span>인강 기기 & 권장 교재 추천 🎒</span>
              </h3>
              <CoupangBanner ids={[7, 3]} layout="vertical" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
