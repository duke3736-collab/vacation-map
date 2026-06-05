"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdBanner from "./AdBanner";

export default function FloatingAds() {
  const pathname = usePathname();

  // 지도 화면과 보고서 화면에서는 플로팅 광고를 띄우지 않습니다.
  if (pathname === "/map" || pathname === "/report") {
    return null;
  }

  return (
    <>
      {/* 왼쪽 사이드바 광고 (데스크탑에서만 보임, 쿠팡 파트너스만 컴팩트하게 노출) */}
      <div className="hidden 2xl:flex fixed top-1/2 -translate-y-1/2 left-4 z-40 flex-col gap-4 max-h-screen p-2">
        <AdBanner type="square" slot="floating-left-coupang" provider="coupang" className="shadow-lg border border-slate-150 w-[150px] min-h-[150px]" />
      </div>
      
      {/* 오른쪽 사이드바 광고 (데스크탑에서만 보임, 쿠팡 파트너스만 컴팩트하게 노출) */}
      <div className="hidden 2xl:flex fixed top-1/2 -translate-y-1/2 right-4 z-40 flex-col gap-4 max-h-screen p-2">
        <AdBanner type="square" slot="floating-right-coupang" provider="coupang" className="shadow-lg border border-slate-150 w-[150px] min-h-[150px]" />
      </div>
    </>
  );
}
