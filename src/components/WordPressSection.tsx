"use client";

import React from "react";

export interface WordPressPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  link: string; // 워드프레스 상세 포스트 링크
}

// 사용자의 워드프레스 블로그 주소 기본값 (weknews.com)
const WORDPRESS_BASE_URL = "https://weknews.com";

// 방학 맵 사용자를 매료시킬 수 있는 정보성 칼럼 데이터셋
const DEFAULT_POSTS: WordPressPost[] = [
  {
    id: 1,
    title: "아이와 함께 가면 절대 실패 없는 전국 무료 체험학습 명소 TOP 7",
    excerpt: "지출 걱정 없이 아이에게 유익한 추억을 선물해 줄 수 있는 전국의 무료 박물관, 생태 체험관, 우수 과학관을 엄선하여 주차 정보와 함께 정리했습니다.",
    category: "국내 여행 / 체험 학습",
    date: "2026-06-01",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60",
    link: "https://weknews.com/recommended-field-trip-spots/"
  },
  {
    id: 2,
    title: "박물관 200% 즐기기! 어린이 도슨트 예약 꿀팁 및 사전 준비물",
    excerpt: "어렵게 느껴지는 미술관과 박물관을 아이 눈높이에 맞춰 설명해 주는 전문 가이드 프로그램 무료 예약 방법과 아이들의 주의를 끄는 추천 미션지를 공유합니다.",
    category: "방학 교육 팁",
    date: "2026-05-28",
    imageUrl: "https://weknews.com/wp-content/uploads/2026/06/Gemini_Generated_Image_qualowqualowqual.webp",
    link: "https://weknews.com/childrens-museum-docent/"
  },
  {
    id: 3,
    title: "여름방학 물놀이 필수 준비물 체크리스트 & 이것만은 피하세요!",
    excerpt: "계곡, 수영장, 워터파크 갈 때 두고 오면 현장에서 비싸게 사야 하는 필수 아동 용품 리스트와 저체온증/피부염 예방을 위해 꼭 확인해야 할 수칙을 알아봅니다.",
    category: "안전 가이드",
    date: "2026-05-25",
    imageUrl: "https://weknews.com/wp-content/uploads/2026/06/Gemini_Generated_Image_jft2gajft2gajft2.webp",
    link: "https://weknews.com/essential-items-for-water-play/"
  },
  {
    id: 4,
    title: "주말 나들이 필수 코스: 서울 근교 동물 먹이주기 이색 체험 농장",
    excerpt: "알파카부터 양, 토끼까지 자연 속에서 동물들과 교감하며 이색 피크닉을 즐길 수 있는 경기·인천 지역의 가족 친화형 힐링 농장 리스트를 직접 다녀온 후기로 전해드립니다.",
    category: "서울 근교 나들이",
    date: "2026-05-20",
    imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b66b706?w=500&auto=format&fit=crop&q=60",
    link: `${WORDPRESS_BASE_URL}/animal-feeding-farms`
  }
];

interface WordPressSectionProps {
  limit?: number;
  layout?: "grid" | "vertical";
  className?: string;
  title?: string;
  customPosts?: WordPressPost[];
}

export default function WordPressSection({
  limit = 3,
  layout = "grid",
  className = "",
  title = "방학 여행 준비를 위한 에디터 추천 칼럼 💡",
  customPosts
}: WordPressSectionProps) {
  const posts = (customPosts || DEFAULT_POSTS).slice(0, limit);

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-6 tracking-tight flex items-center gap-2">
          <span>{title}</span>
        </h3>
      )}

      {layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* 이미지 영역 */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-amber-400 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                  {post.category}
                </span>
              </div>

              {/* 텍스트 영역 */}
              <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-semibold">{post.date}</span>
                  <h4 className="text-sm md:text-base font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-indigo-500 group-hover:text-indigo-600 transition-colors pt-2 border-t border-slate-100">
                  <span>자세히 보러가기</span>
                  <span className="material-symbols-outlined text-[14px] ml-1 transition-transform group-hover:translate-x-1">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 bg-white p-3 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* 작은 썸네일 */}
              <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* 텍스트 */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 block mb-0.5">{post.category}</span>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h4>
                </div>
                <span className="text-[9px] text-slate-400 font-semibold">{post.date}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
