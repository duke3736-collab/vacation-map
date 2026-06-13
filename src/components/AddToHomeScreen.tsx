"use client";

import React, { useEffect, useState } from "react";

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. 이미 앱(PWA) 상태로 켜졌는지 확인
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    
    // 2. 사용자가 이번 세션에 이미 닫았는지 확인
    const isDismissed = localStorage.getItem("pwa-dismissed") === "true";

    if (isStandalone || isDismissed) {
      return;
    }

    // 3. OS 구분 (iOS 체크)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);

    // iOS Safari의 경우 beforeinstallprompt가 없으므로 바로 노출 가능
    if (ios) {
      // 3초 뒤에 자연스럽게 슬라이드업 노출
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 4. Android/Chrome 계열 설치 프롬프트 캡처
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // 3초 뒤에 자연스럽게 노출
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 플로팅 설치 유도 배너 (요즘 모바일 서비스 트렌드 반영) */}
      <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[380px] z-50 animate-in fade-in slide-in-from-bottom-6 duration-500 pointer-events-auto">
        <div className="premium-glass bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-3xl p-4 flex items-center justify-between gap-4 relative overflow-hidden group">
          {/* 장식용 그라데이션 빛 */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            {/* 앱 아이콘 느낌의 박스 */}
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md shadow-blue-500/20 animate-pulse">
              🗺️
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-blue-600 tracking-wider uppercase mb-0.5">App Install</span>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">방학 맵을 홈화면에 추가</h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">앱으로 빠르게 체험학습을 찾아보세요!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button 
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              추가하기
            </button>
            <button 
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="닫기"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari 전용 안내 바텀 시트 */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto" onClick={() => setShowIosGuide(false)}>
          <div 
            className="w-full max-w-md bg-white rounded-t-[2.5rem] p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-400 flex flex-col items-center gap-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 캡 손잡이 */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-2" />
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
              📲
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-800">아이폰 홈화면에 추가하기</h3>
              <p className="text-sm text-slate-500 font-medium">Safari 브라우저에서 아래의 단계를 따라 추가해 주세요.</p>
            </div>

            <div className="w-full bg-slate-50 rounded-3xl p-5 border border-slate-100 space-y-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-black text-blue-600 text-sm shadow-sm">1</div>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  Safari 브라우저 하단의 <span className="inline-flex items-center bg-white px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 shadow-sm mx-1"><span className="material-symbols-outlined text-sm text-blue-500">share</span> 공유 버튼</span>을 누릅니다.
                </p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-black text-blue-600 text-sm shadow-sm">2</div>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  스크롤을 내려 <span className="font-extrabold text-slate-900">‘홈 화면에 추가’</span> 메뉴를 탭하여 추가해 주세요.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-base hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}
    </>
  );
}
