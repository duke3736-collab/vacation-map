"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CoupangBanner from "./CoupangBanner";

export default function FloatingAds() {
  const pathname = usePathname();

  // 지도 화면과 보고서 화면에서는 플로팅 광고를 띄우지 않습니다.
  if (pathname === "/map" || pathname === "/report") {
    return null;
  }

  return (
    <>
      {/* 왼쪽 사이드바 광고 (데스크탑에서만 보임, 쿠팡 기획전만 노출) */}
      <div className="hidden 2xl:flex fixed top-1/2 -translate-y-1/2 left-4 z-40 w-[180px] p-2">
        <CoupangBanner ids={[1]} layout="vertical" />
      </div>
      
      {/* 오른쪽 사이드바 광고 (데스크탑에서만 보임, 쿠팡 기획전만 노출) */}
      <div className="hidden 2xl:flex fixed top-1/2 -translate-y-1/2 right-4 z-40 w-[180px] p-2">
        <CoupangBanner ids={[8]} layout="vertical" />
      </div>
    </>
  );
}
