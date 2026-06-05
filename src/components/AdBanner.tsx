"use client";

import React, { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  className?: string;
  type?: "horizontal" | "vertical" | "square";
  provider?: "adsense" | "coupang";
}

export default function AdBanner({ slot, className = "", type = "horizontal", provider = "adsense" }: AdBannerProps) {
  const isPushed = useRef(false);

  useEffect(() => {
    if (provider === "adsense" && !isPushed.current && typeof window !== "undefined") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [provider]);

  const sizeClasses = {
    horizontal: "w-full max-w-4xl min-h-[160px] md:min-h-[200px]",
    vertical: "w-[160px] min-h-[600px]",
    square: "w-[300px] min-h-[250px]"
  };

  return (
    <div className={`mx-auto flex flex-col items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 relative ${sizeClasses[type]} ${className}`}>
      {provider === "adsense" ? (
        <div className="w-full h-full flex items-center justify-center">
          <ins
            suppressHydrationWarning
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%" }}
            data-ad-client="ca-pub-6635245275061755"
            data-ad-slot="2512469497"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full h-full">
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 tracking-widest uppercase shadow-sm">
            COUPANG
          </span>
          <p className="text-slate-500 font-bold text-sm leading-tight mb-1 break-keep">
            쿠팡 파트너스 배너가 들어갈 자리입니다.
          </p>
        </div>
      )}
    </div>
  );
}
