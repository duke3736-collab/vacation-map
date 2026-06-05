import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-16 flex justify-between items-center px-6 md:px-10 premium-glass border-x-0 border-t-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-black tracking-tighter cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 drop-shadow-sm uppercase italic">
          Vacation Map
        </Link>
      </div>
      
      {/* Search Bar (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-10 relative">
        <input 
          className="w-full bg-white/60 backdrop-blur-md py-2.5 pl-12 pr-12 rounded-full border border-black/5 shadow-inner focus:ring-2 focus:ring-primary-container focus:bg-white text-slate-800 placeholder:text-slate-500 transition-all outline-none font-medium" 
          placeholder="어디로 떠나볼까요?" 
          type="text" 
        />
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontVariationSettings: "'FILL' 1" }}>
          search
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 mr-6">
        <Link href="/themes" className="flex items-center gap-2 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">explore</span>
          <span>테마추천</span>
        </Link>
        <Link href="/talk" className="flex items-center gap-2 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">chat</span>
          <span>방학 톡톡</span>
        </Link>
        <Link href="/planner" className="flex items-center gap-2 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          <span>방학 계획서</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span>대시보드</span>
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-600 hover:text-slate-900 flex items-center justify-center h-12 w-12">
          <span className="material-symbols-outlined text-[24px]">filter_list</span>
        </button>
        <button className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-600 hover:text-slate-900 flex items-center justify-center h-12 w-12">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </button>
      </div>
    </header>
  );
}
