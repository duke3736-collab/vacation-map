"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import { Category } from "@/data/places";
import clsx from "clsx";

// 카테고리별 대표 이미지 목록 (Unsplash 고해상도 이미지 매핑)
const PLACE_IMAGES: Record<Category, string[]> = {
  "박물관": [
    "https://images.unsplash.com/photo-1554165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1582880787361-b541349f7cf7?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1566121318599-270830491fb2?w=400&auto=format&fit=crop&q=60"
  ],
  "체험학습": [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=60"
  ],
  "축제": [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=60"
  ],
  "1달 살기": [
    "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop&q=60"
  ],
  "색다른 경험": [
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&auto=format&fit=crop&q=60"
  ],
  "학원": [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&auto=format&fit=crop&q=60"
  ]
};

const getPlaceImage = (id: string, category: Category) => {
  const images = PLACE_IMAGES[category] || PLACE_IMAGES["체험학습"];
  const index = Math.abs(parseInt(id) || 0) % images.length;
  return images[index];
};

export default function Sidebar() {
  const router = useRouter();
  const { 
    activeCategories, 
    toggleCategory, 
    filteredPlaces, 
    setPlaceForReport, 
    savedPlaceIds, 
    toggleSavePlace,
    setFocusedPlaceId,
    setActiveCategory
  } = useMapStore();
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

  return (
    <aside className="hidden md:flex flex-col w-[420px] premium-glass rounded-3xl z-10 h-full overflow-hidden">
      {/* Category Chips */}
      <div className="p-5 border-b border-black/5 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 min-w-max pb-2">
          <button 
            onClick={() => setActiveCategory(null)} 
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-full border text-base font-bold transition-transform hover:scale-105 active:scale-95 shadow-md",
              activeCategories.length === 0 
                ? "bg-slate-800 text-white border-slate-700 shadow-md" 
                : "bg-white/60 text-slate-700 border-black/5 hover:bg-white hover:text-slate-900"
            )}
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
            <div 
              key={place.id} 
              onClick={() => setFocusedPlaceId(place.id)}
              className="bg-white/70 backdrop-blur-lg rounded-2xl border border-black/5 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group shadow-sm cursor-pointer"
            >
              {/* 이미지 영역 */}
              <div className="h-36 bg-slate-100 relative overflow-hidden transition-colors">
                <img 
                  src={getPlaceImage(place.id, place.category)} 
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* 카테고리 아이콘 플로팅 배지 */}
                <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-md text-white w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border border-white/10">
                  {getCategoryIcon(place.category)}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavePlace(place.id);
                  }}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full hover:bg-white shadow-sm transition-all active:scale-90 flex items-center gap-1 group/save"
                >
                  <span className={clsx("material-symbols-outlined text-[20px]", savedPlaceIds.includes(place.id) ? "text-pink-500 font-[1000]" : "text-slate-400 group-hover/save:text-pink-500")}>
                    favorite
                  </span>
                </button>
              </div>

              <div className="p-5 bg-gradient-to-b from-white/50 to-white/90">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-extrabold text-slate-900 truncate pr-2 group-hover:text-primary transition-colors">{place.name}</h3>
                  <span className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 border border-black/5 shadow-sm bg-white")}>
                    {getCategoryIcon(place.category)} <span className="text-slate-800">{place.category}</span>
                  </span>
                </div>
                <p className="text-base text-slate-600 line-clamp-2 mb-5 leading-relaxed font-medium">{place.address}</p>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/60">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaceForReport(place);
                      router.push("/report");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_document</span>
                    보고서 쓰기
                  </button>
                  <button 
                    onClick={() => setFocusedPlaceId(place.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
                  >
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
