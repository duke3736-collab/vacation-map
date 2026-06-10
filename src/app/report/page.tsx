"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import WordPressSection from "@/components/WordPressSection";
import clsx from "clsx";

export default function ReportHubPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 py-20 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Stickers */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-150 animate-[spin_600s_linear_infinite]"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="max-w-4xl w-full mx-auto relative z-10 px-6">
        
        <div className="text-center mb-16 relative">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight drop-shadow-sm mb-4">
            어떤 문서를 작성할까요? 📝
          </h1>
          <p className="text-xl text-slate-700 font-bold">
            학교 제출용 양식에 맞춰 완벽한 문서를 자동 완성해 드립니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* 신청서 카드 */}
          <button 
            onClick={() => router.push('/report/plan')}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-4 border-transparent hover:border-blue-200 text-left flex flex-col h-full"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">📅</div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">현장체험학습 신청서</h2>
            <p className="text-gray-600 font-medium text-base mb-8 leading-relaxed">
              학교에 체험학습을 가겠다고 미리 알리는 문서입니다. 교과 연계 목적과 학습 계획이 자동으로 채워집니다.
            </p>
            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 text-blue-600 font-black text-lg group-hover:text-blue-700 transition-colors">
                신청서 작성하기 <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </button>

          {/* 결과보고서 카드 */}
          <button 
            onClick={() => router.push('/report/result')}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-4 border-transparent hover:border-indigo-200 text-left flex flex-col h-full"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">📸</div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">현장체험학습 결과보고서</h2>
            <p className="text-gray-600 font-medium text-base mb-8 leading-relaxed">
              다녀온 후 학교에 제출하는 문서입니다. 활동 내용과 느낀 점을 꼼꼼하게 채우고 사진을 첨부할 수 있습니다.
            </p>
            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 text-indigo-600 font-black text-lg group-hover:text-indigo-700 transition-colors">
                결과보고서 작성하기 <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </button>

          {/* 나만의 여행 기록 카드 */}
          <button 
            onClick={() => router.push('/report/memories')}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-4 border-transparent hover:border-pink-200 text-left flex flex-col h-full"
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">🎒</div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">나만의 여행 기록 (보관용)</h2>
            <p className="text-gray-600 font-medium text-base mb-8 leading-relaxed">
              학교 제출용 양식이 아닌, 자유롭고 예쁜 디자인으로 여행의 추억을 소장용으로 남겨보세요.
            </p>
            <div className="mt-auto">
              <div className="inline-flex items-center gap-2 text-pink-500 font-black text-lg group-hover:text-pink-600 transition-colors">
                추억 기록하기 <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📝</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">체험학습 신청서 및 보고서 작성 방법</h2>
          </div>
          <WordPressSection 
            limit={3} 
            layout="grid" 
            title=""
            customPosts={[
              {
                id: 101,
                title: "현장체험학습 신청서 & 보고서, 이렇게만 쓰면 무조건 통과! ✍️",
                excerpt: "학부모님들이 가장 어려워하는 체험학습 신청서와 결과보고서 작성법. 학교에서 좋아하는 필수 키워드와 교과 연계 목적 작성 꿀팁을 총정리했습니다.",
                category: "작성 가이드",
                date: "2026-06-05",
                imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60",
                link: "https://weknews.com/experiential-learning-application-report/"
              },
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
                imageUrl: "https://images.unsplash.com/photo-1582880787361-b541349f7cf7?w=500&auto=format&fit=crop&q=60",
                link: "https://weknews.com/museum-guide-tips"
              }
            ]}
          />
        </div>
      </div>

    </div>
  );
}
