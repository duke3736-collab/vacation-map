"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { showFilters, setShowFilters } = useMapStore();

  const handleFilterClick = () => {
    if (pathname === "/map") {
      setShowFilters(!showFilters);
    } else {
      setShowFilters(true);
      router.push("/map");
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/map?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-16 flex justify-between items-center px-6 md:px-10 premium-glass border-x-0 border-t-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 drop-shadow-sm uppercase italic">
          Vacation Map
        </Link>
      </div>
      
      {/* Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-2xl min-w-[240px] mx-10 relative">
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-white/60 backdrop-blur-md py-2.5 pl-12 pr-12 rounded-full border border-black/5 shadow-inner focus:ring-2 focus:ring-primary-container focus:bg-white text-slate-800 placeholder:text-slate-500 transition-all outline-none font-medium" 
          placeholder="어디로 떠나볼까요?" 
          type="text" 
        />
        <button onClick={() => { if (query.trim()) router.push(`/map?q=${encodeURIComponent(query.trim())}`); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 flex items-center">
          <span className="material-symbols-outlined hover:text-indigo-600 transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
            search
          </span>
        </button>
      </div>

      <nav className="hidden lg:flex items-center gap-4 mr-4">
        <Link href="/themes" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span>테마추천</span>
        </Link>
        <Link href="/talk" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">chat</span>
          <span>방학 톡톡</span>
        </Link>
        <Link href="/report/plan" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-blue-600 transition-colors">
          <span className="material-symbols-outlined text-[22px]">edit_document</span>
          <span>신청서 작성</span>
        </Link>
        <Link href="/report/result" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-indigo-600 transition-colors">
          <span className="material-symbols-outlined text-[22px]">task</span>
          <span>보고서 작성</span>
        </Link>
        <Link href="/planner" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          <span>방학 계획서</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span>대시보드</span>
        </Link>

        {/* Family Sites Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 text-base font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            <span className="material-symbols-outlined text-[22px]">public</span>
            <span>패밀리 맵</span>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
          </button>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 p-2 flex flex-col gap-1 z-50">
            <a href="https://map.weknews.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
              <span className="text-lg">🌊</span> 씨 맵
            </a>
            <a href="https://download.weknews.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
              <span className="text-lg">💻</span> 소프트웨어 금고
            </a>
            <a href="https://drive.weknews.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
              <span className="text-lg">🚗</span> 드라이브 맵
            </a>
            <a href="https://maple.weknews.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
              <span className="text-lg">🍁</span> 단풍 맵
            </a>
          </div>
        </div>
      </nav>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleFilterClick}
          className={`p-2 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center h-12 w-12 ${
            pathname === "/map" && showFilters 
              ? "text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 shadow-sm border border-blue-100" 
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="필터 켜기/끄기"
        >
          <span className="material-symbols-outlined text-[24px]">filter_list</span>
        </button>
        <button 
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-600 hover:text-slate-900 flex items-center justify-center h-12 w-12"
          title="대시보드"
        >
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </button>
      </div>
    </header>
  );
}
