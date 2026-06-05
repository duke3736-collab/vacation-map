import Sidebar from "@/components/Sidebar";
import MapClient from "@/components/MapClient";
import AdBanner from "@/components/AdBanner";

export default function MapPage() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-blue-50 text-slate-900 pt-16">
      {/* 맵 컨테이너 (가장 아래 깔림) */}
      <div className="absolute inset-0 z-0">
        <MapClient />
      </div>
      
      {/* 플로팅 UI 레이어 (맵 위로 뜸, 포인터 이벤트 제어) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col pt-16">
        
        {/* 메인 콘텐츠 영역 (사이드바 등) */}
        <div className="flex-1 flex relative pointer-events-none">
          <div className="pointer-events-auto h-full p-4 md:p-6 pb-24 md:pb-6">
            <Sidebar />
          </div>
          
          {/* 우측 하단 컨트롤러 (광고 패널이 나타나면 왼쪽으로 밀림) */}
          <div className="absolute right-5 md:right-10 xl:right-[350px] bottom-24 md:bottom-12 flex flex-col gap-3 pointer-events-auto transition-all duration-300">
            <button className="premium-glass w-12 h-12 rounded-full shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[24px]">my_location</span>
            </button>
            <div className="premium-glass rounded-full shadow-md flex flex-col overflow-hidden">
              <button className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-black/5 transition-colors border-b border-black/5 active:bg-black/10">
                <span className="material-symbols-outlined text-[24px]">add</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-black/5 transition-colors active:bg-black/10">
                <span className="material-symbols-outlined text-[24px]">remove</span>
              </button>
            </div>
          </div>
          
          {/* 데스크탑 전용 우측 고정 광고 패널 */}
          <div className="hidden xl:flex absolute top-0 right-0 h-full w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200 pointer-events-auto flex-col items-center py-6 px-4 gap-6 overflow-y-auto custom-scrollbar">
            <div className="w-full flex items-center gap-2 mb-2 px-2">
              <span className="material-symbols-outlined text-rose-500">campaign</span>
              <h3 className="font-black text-slate-700">스폰서</h3>
            </div>
            
            {/* 애드센스 (정사각형) */}
            <AdBanner type="square" slot="map-right-adsense" className="shadow-sm" />
            
            <div className="w-full h-px bg-slate-200 my-2"></div>
            
            {/* 쿠팡 파트너스 (세로형) */}
            <AdBanner type="vertical" slot="map-right-coupang" className="shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
