"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import { Category } from "@/data/places";
import clsx from "clsx";

export default function Sidebar() {
  const router = useRouter();
  const { activeCategories, toggleCategory, filteredPlaces, setPlaceForReport, savedPlaceIds, toggleSavePlace } = useMapStore();
  const categories: Category[] = ["박물관", "색다른 경험", "1달 살기", "학원", "체험학습", "축제"];

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "박물관": return "🏛️";
      case "색다른 경험": return "🎨";
      case "1달 살기": return "🏠";
      case "학원": return "📚";
      case "축제": return "🎡";
      case "체험학습": return "🏃‍♂️";
      default: return "📍";
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case "박물관": return "text-purple-300 bg-purple-900/40 border-purple-500/30";
      case "색다른 경험": return "text-amber-300 bg-amber-900/40 border-amber-500/30";
      case "1달 살기": return "text-sky-300 bg-sky-900/40 border-sky-500/30";
      case "학원": return "text-blue-300 bg-blue-900/40 border-blue-500/30";
      case "축제": return "text-pink-300 bg-pink-900/40 border-pink-500/30";
      case "체험학습": return "text-emerald-300 bg-emerald-900/40 border-emerald-500/30";
      default: return "text-gray-300 bg-gray-900/40 border-gray-500/30";
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-[420px] premium-glass rounded-3xl z-10 h-full overflow-hidden">
      {/* Category Chips */}
      <div className="p-5 border-b border-black/5 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 min-w-max pb-2">
          <button 
            onClick={() => {}} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 text-white border border-slate-700 text-base font-bold transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            <span>All</span>
          </button>
          
          {categories.map((cat) => {
            const isActive = activeCategories.includes(cat);
            return (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full border text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-sm",
                  isActive 
                    ? "bg-slate-800 text-white border-slate-700 shadow-md" 
                    : "bg-white/60 text-slate-700 border-black/5 hover:bg-white hover:text-slate-900"
                )}
              >
                <span>{getCategoryIcon(cat)}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Sorting & Results Count */}
      <div className="px-6 py-4 flex justify-between items-center bg-black/5 border-b border-black/5 backdrop-blur-sm">
        <span className="text-sm font-bold text-slate-600">{filteredPlaces.length} Results</span>
        <div className="flex gap-4">
          <button className="text-sm font-bold text-primary tracking-wide">By Location</button>
          <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Popularity</button>
        </div>
      </div>
      
      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-6 custom-scrollbar">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div key={place.id} className="bg-white/70 backdrop-blur-lg rounded-2xl border border-black/5 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group shadow-sm">
              <div className="h-36 bg-slate-100 relative flex items-center justify-center text-5xl group-hover:bg-slate-200 transition-colors cursor-pointer">
                <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{getCategoryIcon(place.category)}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavePlace(place.id);
                  }}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2.5 rounded-full hover:bg-white shadow-sm transition-all active:scale-90 flex items-center gap-1 group/save"
                >
                  <span className={clsx("material-symbols-outlined text-[22px]", savedPlaceIds.includes(place.id) ? "text-pink-500 font-[1000]" : "text-slate-400 group-hover/save:text-pink-500")}>
                    favorite
                  </span>
                </button>
              </div>
              <div className="p-5 bg-gradient-to-b from-white/50 to-white/90">
                <div className="flex justify-between items-start mb-3 cursor-pointer">
                  <h3 className="text-xl font-extrabold text-slate-900 truncate pr-2 group-hover:text-primary transition-colors">{place.name}</h3>
                  <span className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 border border-black/5 shadow-sm bg-white")}>
                    {getCategoryIcon(place.category)} <span className="text-slate-800">{place.category}</span>
                  </span>
                </div>
                <p className="text-base text-slate-600 line-clamp-2 mb-5 leading-relaxed font-medium cursor-pointer">{place.address}</p>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60">
                  <button 
                    onClick={() => {
                      setPlaceForReport(place);
                      router.push("/report");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_document</span>
                    보고서 쓰기
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 mt-12 font-bold text-lg flex flex-col items-center gap-3">
            <span className="text-5xl opacity-50">🧭</span>
            해당하는 장소가 없습니다.
          </div>
        )}
      </div>
    </aside>
  );
}
