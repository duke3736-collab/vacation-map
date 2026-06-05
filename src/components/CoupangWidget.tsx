"use client";

import React from "react";

export interface CoupangItem {
  id: number;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  discountRate?: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  link: string; // 사용자 본인의 쿠팡 파트너스 링크로 교체하기 쉬움
}

// 아이와 함께 가는 방학 여행 컨셉에 어울리는 추천 상품 목록
const DEFAULT_COUPANG_ITEMS: CoupangItem[] = [
  {
    id: 1,
    title: "그린핑거 야외놀이 선크림 SPF50+ 80ml (순하고 가벼운 보습)",
    category: "아동용 선케어",
    price: "13,900원",
    originalPrice: "18,500원",
    discountRate: "24%",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewsCount: 1240,
    link: "https://link.coupang.com/a/your-link-id-1" // 💡 여기에 사용자분의 쿠팡 파트너스 링크를 붙여넣으세요!
  },
  {
    id: 2,
    title: "초경량 기내반입형 휴대용 유모차 (원터치 폴딩)",
    category: "유아외출용품",
    price: "128,000원",
    originalPrice: "159,000원",
    discountRate: "19%",
    imageUrl: "https://images.unsplash.com/photo-1591085686350-798c0f9affd1?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviewsCount: 382,
    link: "https://link.coupang.com/a/your-link-id-2"
  },
  {
    id: 3,
    title: "세이프키즈 아동용 물놀이 네오프렌 구명조끼 (KC안전인증)",
    category: "물놀이/안전용품",
    price: "24,500원",
    originalPrice: "29,000원",
    discountRate: "15%",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewsCount: 855,
    link: "https://link.coupang.com/a/your-link-id-3"
  },
  {
    id: 4,
    title: "키즈 캐리 온 캐릭터 캐리어 18인치 (방수/내구성 강화)",
    category: "아동용 캐리어",
    price: "39,800원",
    originalPrice: "49,000원",
    discountRate: "18%",
    imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewsCount: 216,
    link: "https://link.coupang.com/a/your-link-id-4"
  },
  {
    id: 5,
    title: "패밀리 방수 대형 피크닉 돗자리 캠핑 매트 (손잡이 일체형)",
    category: "나들이/캠핑용품",
    price: "18,900원",
    originalPrice: "22,000원",
    discountRate: "14%",
    imageUrl: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviewsCount: 504,
    link: "https://link.coupang.com/a/your-link-id-5"
  }
];

interface CoupangWidgetProps {
  limit?: number;
  layout?: "grid" | "vertical" | "horizontal";
  itemIds?: number[]; // 특정 상품들만 지정해서 보여주고 싶을 때 사용
  className?: string;
}

export default function CoupangWidget({
  limit = 2,
  layout = "grid",
  itemIds,
  className = ""
}: CoupangWidgetProps) {
  // 특정 아이템 ID 목록이 주어지면 필터링, 없으면 앞에서부터 limit 개수만큼 선택
  const items = itemIds 
    ? DEFAULT_COUPANG_ITEMS.filter(item => itemIds.includes(item.id))
    : DEFAULT_COUPANG_ITEMS.slice(0, limit);

  const containerClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full",
    vertical: "flex flex-col gap-4 w-full",
    horizontal: "flex flex-col md:flex-row gap-4 w-full"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={containerClasses[layout]}>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* 상품 이미지 */}
            <div className="relative w-28 sm:w-32 h-full min-h-[120px] bg-slate-50 flex-shrink-0 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide shadow-sm">
                특가
              </span>
            </div>

            {/* 상품 정보 */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
              <div>
                {/* 카테고리 & 파트너스 태그 */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium tracking-tight">
                    쿠팡 파트너스 추천
                  </span>
                </div>

                {/* 상품 제목 */}
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h4>
              </div>

              {/* 가격 및 구매 버튼 */}
              <div className="flex items-end justify-between mt-1">
                <div className="space-y-0.5">
                  {item.originalPrice && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 line-through">
                        {item.originalPrice}
                      </span>
                      <span className="text-[10px] text-rose-500 font-bold">
                        {item.discountRate}
                      </span>
                    </div>
                  )}
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    {item.price}
                  </span>
                </div>

                {/* 구매 가기 버튼 */}
                <span className="inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors group-hover:bg-rose-600">
                  최저가 확인
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* 법적 고지 텍스트 필수 (쿠팡 파트너스 필수 가이드라인) */}
      <p className="text-[9px] text-slate-400 text-center mt-3 leading-relaxed">
        ※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
