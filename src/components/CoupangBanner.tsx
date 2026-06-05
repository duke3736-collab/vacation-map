"use client";

import React from "react";

export interface CoupangThemeBanner {
  id: number;
  title: string;
  badge: string;
  badgeBg: string; // Tailwind bg 클래스 (예: bg-blue-500)
  linkText: string;
  imageUrl: string;
  link: string; // 쿠팡 파트너스 기획전 링크 주소
}

// 8가지 카테고리 기획전 데이터셋 (가구, 가전, 디지털 기기 포함)
const DEFAULT_THEME_BANNERS: CoupangThemeBanner[] = [
  {
    id: 1,
    badge: "EDU & TOY",
    badgeBg: "bg-emerald-500",
    title: "방학 숙제 완벽 해결! 초등 과학/미술 창의 교구&학습 교재 최저가전",
    linkText: "쿠팡 문구/학습 기획전 보러가기 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-1" // 💡 여기에 기획전 링크를 입력하세요!
  },
  {
    id: 2,
    badge: "BOOK FESTIVAL",
    badgeBg: "bg-indigo-500",
    title: "독서 습관 완성! 초등 필독 도서/만화 전집 베스트셀러 로켓배송",
    linkText: "쿠팡 도서 특가전 보러가기 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-2"
  },
  {
    id: 3,
    badge: "STUDY HARD",
    badgeBg: "bg-purple-500",
    title: "2학기 선행 학습 필수! 중등 참고서 & 베스트셀러 문제집 총집합",
    linkText: "쿠팡 학습 서적 보러가기 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-3"
  },
  {
    id: 4,
    badge: "YOUTH STYLE",
    badgeBg: "bg-amber-500",
    title: "새학기 준비 끝! 스타일리시한 청소년 백팩 & 스포츠웨어 브랜드전",
    linkText: "쿠팡 스포츠/패션 기획전 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-4"
  },
  {
    id: 5,
    badge: "HOTEL & RESORT",
    badgeBg: "bg-rose-500",
    title: "아이와 함께 떠나는 전국 인기 키즈 펜션 & 글램핑 실시간 초특가",
    linkText: "쿠팡 트래블 기획전 보러가기 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-5"
  },
  {
    id: 6,
    badge: "STUDY ROOM",
    badgeBg: "bg-cyan-500",
    title: "바른 자세가 집중력을 높인다! 초중등 인기 공부방 독서실 책상 & 의자",
    linkText: "쿠팡 공부방 가구 기획전 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-6"
  },
  {
    id: 7,
    badge: "DIGITAL CAMPUS",
    badgeBg: "bg-sky-500",
    title: "방학 특강 & 인강용 가성비 노트북 및 아동/청소년 학습용 태블릿 PC",
    linkText: "쿠팡 디지털 가전 기획전 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-7"
  },
  {
    id: 8,
    badge: "HEALTHY LIFE",
    badgeBg: "bg-teal-500",
    title: "방학 내내 시원하고 쾌적하게! 공부방용 미니 무소음 에어컨 & 공기청정기",
    linkText: "쿠팡 실내 가전 기획전 ➡️",
    imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=60",
    link: "https://link.coupang.com/a/your-banner-link-8"
  }
];

interface CoupangBannerProps {
  ids?: number[]; // 특정 ID들만 노출하고 싶을 때 사용
  limit?: number;
  layout?: "grid" | "vertical" | "horizontal";
  className?: string;
}

export default function CoupangBanner({
  ids,
  limit = 2,
  layout = "grid",
  className = ""
}: CoupangBannerProps) {
  // 아이디 지정 필터링 또는 앞에서부터 개수 제어
  const banners = ids
    ? DEFAULT_THEME_BANNERS.filter(b => ids.includes(b.id))
    : DEFAULT_THEME_BANNERS.slice(0, limit);

  const containerClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5 w-full",
    vertical: "flex flex-col gap-4 w-full",
    horizontal: "flex flex-col md:flex-row gap-5 w-full"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={containerClasses[layout]}>
        {banners.map((banner) => {
          // 세로형 레이아웃일 때 카드 높이와 폰트 크기, 여백을 더욱 키워 시인성을 보장합니다.
          const isVertical = layout === "vertical";
          const cardHeight = isVertical ? "h-64" : "h-52";
          const badgeSize = isVertical ? "text-xs px-3 py-1" : "text-[10px] px-2.5 py-0.5";
          const titleSize = isVertical ? "text-base md:text-lg" : "text-sm md:text-base";
          const linkTextSize = isVertical ? "text-sm" : "text-xs";
          const paddingClass = isVertical ? "p-6 gap-3" : "p-5 gap-2";

          return (
            <a
              key={banner.id}
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl w-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-black/10 cursor-pointer ${cardHeight}`}
            >
              {/* 배경 이미지 */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              />

              {/* 어두운 그라데이션 오버레이 (단풍맵 스타일의 가독성 확보) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

              {/* 내부 콘텐츠 */}
              <div className={`relative z-10 flex flex-col items-start text-left ${paddingClass}`}>
                {/* 카테고리 뱃지 */}
                <span className={`font-black text-white rounded shadow-sm tracking-wider uppercase ${badgeSize} ${banner.badgeBg}`}>
                  {banner.badge}
                </span>

                {/* 배너 타이틀 */}
                <h4 className={`font-black text-white leading-snug drop-shadow-sm tracking-tight line-clamp-3 ${titleSize}`}>
                  {banner.title}
                </h4>

                {/* 링크 이동 안내 텍스트 */}
                <span className={`font-bold text-amber-400 group-hover:text-amber-300 transition-colors drop-shadow-sm flex items-center gap-1 ${linkTextSize}`}>
                  {banner.linkText}
                </span>
              </div>
            </a>
          );
        })}
      </div>
      
      {/* 법적 고지 문구 */}
      <p className="text-[9px] text-slate-400 text-center mt-3 leading-relaxed">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
