import React from "react";
import Link from "next/link";
import clsx from "clsx";

export default function BottomNav() {
  return (
    <nav className="premium-glass fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe md:hidden z-50 border-x-0 border-b-0">
      <Link href="/" className="flex flex-col items-center justify-center text-slate-500 px-4 py-2 hover:text-slate-800 hover:bg-black/5 rounded-2xl active:scale-90 transition-all duration-200 ease-out group">
        <span className="material-symbols-outlined text-[24px]">home</span>
        <span className="text-xs font-bold mt-1 tracking-wide">Home</span>
      </Link>
      <Link href="/map" className="flex flex-col items-center justify-center bg-slate-800 text-white rounded-2xl px-4 py-2 shadow-md active:scale-90 transition-all duration-200 ease-out group">
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
        <span className="text-xs font-bold mt-1">Map</span>
      </Link>
      <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-500 px-4 py-2 hover:text-slate-800 hover:bg-black/5 rounded-2xl active:scale-90 transition-all duration-200 ease-out group">
        <span className="material-symbols-outlined text-[24px]">bookmark</span>
        <span className="text-xs font-bold mt-1">Saved</span>
      </Link>
      <Link href="/themes" className="flex flex-col items-center justify-center text-slate-500 px-4 py-2 hover:text-slate-800 hover:bg-black/5 rounded-2xl active:scale-90 transition-all duration-200 ease-out group">
        <span className="material-symbols-outlined text-[24px]">explore</span>
        <span className="text-xs font-bold mt-1">Themes</span>
      </Link>
      <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-500 px-4 py-2 hover:text-slate-800 hover:bg-black/5 rounded-2xl active:scale-90 transition-all duration-200 ease-out group">
        <span className="material-symbols-outlined text-[24px]">person</span>
        <span className="text-xs font-bold mt-1">Profile</span>
      </Link>
    </nav>
  );
}
