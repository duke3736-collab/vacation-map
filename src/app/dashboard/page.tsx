"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import { places, Category, getCategoryIcon } from "@/data/places";
import AdBanner from "@/components/AdBanner";
import clsx from "clsx";

export default function DashboardPage() {
  const router = useRouter();
  const { 
    savedPlaceIds, 
    toggleSavePlace, 
    setPlaceForReport,
    schedules,
    addPlaceToSchedule,
    removePlaceFromSchedule,
    movePlaceInSchedule
  } = useMapStore();
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const savedPlaces = places.filter(p => savedPlaceIds.includes(p.id));

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

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="relative bg-gradient-to-br from-rose-50 via-pink-50/50 to-orange-100 min-h-screen overflow-hidden">
      
      {/* Background Stickers */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none animate-[spin_600s_linear_infinite] scale-150"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20 pt-28 md:pt-32 space-y-12 min-h-screen relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 tracking-tight drop-shadow-sm mb-2">내 대시보드 ✨</h1>
          <p className="text-slate-600 font-bold text-lg">저장한 장소와 이번 방학 일정을 관리하세요.</p>
        </div>
        <button className="bg-gradient-to-r from-rose-400 to-orange-400 text-white px-8 py-3.5 rounded-full font-black text-lg shadow-[0_8px_24px_rgba(251,113,133,0.3)] hover:shadow-[0_12px_28px_rgba(251,113,133,0.4)] hover:-translate-y-1 active:scale-95 transition-all self-start md:self-auto border-2 border-white/50">
          로그인 / 가입
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pb-24">
        {/* Saved Places Card */}
        <div className="relative bg-white rounded-[2rem] shadow-xl border-4 border-white/60 flex flex-col min-h-[450px] overflow-hidden group">
          {/* Card Header with Image */}
          <div className="h-32 relative flex items-center p-8 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/images/bg_stay.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-900/80 to-rose-900/20" />
            <div className="relative z-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-500 bg-white p-2.5 rounded-2xl shadow-sm text-3xl">favorite</span>
              <h2 className="text-2xl font-black text-white drop-shadow-md">저장한 장소 ({savedPlaces.length})</h2>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col p-6 bg-white/80 backdrop-blur-sm">
            {savedPlaces.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {savedPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-2xl p-4 flex gap-4 hover:bg-rose-50 transition-colors border-2 border-slate-100 hover:border-rose-100 group/item cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => {
                      useMapStore.getState().setFocusedPlaceId(place.id);
                      router.push("/map");
                    }}
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex flex-col items-center justify-center shadow-inner shrink-0 group-hover/item:scale-105 transition-transform">
                      <span className="text-3xl mb-0.5">{getCategoryIcon(place.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-lg truncate pr-2 group-hover/item:text-rose-600 transition-colors">{place.name}</h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavePlace(place.id);
                          }}
                          className="text-pink-500 hover:scale-125 transition-transform p-1 drop-shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[24px] font-[1000]">favorite</span>
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 font-medium truncate mt-0.5">{place.address}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addPlaceToSchedule(selectedDay, place.id);
                          }}
                          disabled={schedules[selectedDay]?.includes(place.id)}
                          className="text-xs font-bold text-white bg-blue-500 border border-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-1 w-fit shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[14px]">{schedules[selectedDay]?.includes(place.id) ? 'check' : 'add'}</span>
                          {selectedDay}일차 코스에 추가
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaceForReport(place);
                            router.push("/report");
                          }}
                          className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 w-fit shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit_document</span>보고서
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-5">
                <div className="text-7xl mb-2 animate-bounce">🗺️</div>
                <p className="text-slate-600 font-bold text-base leading-relaxed">아직 저장한 장소가 없습니다.<br/>지도에서 가보고 싶은 곳을 하트(♥)로 저장해보세요.</p>
                <Link href="/map" className="mt-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white px-8 py-3.5 rounded-full font-black text-base shadow-[0_8px_20px_rgba(251,113,133,0.3)] hover:shadow-[0_12px_24px_rgba(251,113,133,0.4)] hover:-translate-y-1 transition-all border-2 border-white/50 inline-block">
                  지도 보러가기 🚀
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* My Schedule Card */}
        <div className="relative bg-white rounded-[2rem] shadow-xl border-4 border-white/60 flex flex-col min-h-[450px] overflow-hidden group">
          {/* Card Header with Image */}
          <div className="relative p-6 md:p-8 shrink-0 overflow-hidden flex flex-col justify-center min-h-[160px]">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/images/bg_experience.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-blue-900/40" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500 bg-white p-2.5 rounded-2xl shadow-sm text-2xl md:text-3xl shrink-0">event</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">나만의 여행 코스 만들기</h2>
                    <p className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">찜한 장소들을 모아 날짜별 일정을 짜보세요!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelp(!showHelp)}
                  className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors flex items-center justify-center shrink-0"
                  title="사용법 보기"
                >
                  <span className="material-symbols-outlined text-xl">help</span>
                </button>
              </div>
              <div className="flex gap-2 bg-white/20 p-1.5 rounded-xl backdrop-blur-md self-start shadow-inner">
                {[1, 2, 3].map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-5 py-2 rounded-lg font-black text-sm transition-all ${
                      selectedDay === day 
                        ? 'bg-white text-blue-600 shadow-md scale-105' 
                        : 'text-white hover:bg-white/30'
                    }`}
                  >
                    {day}일차
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col p-6 bg-white/80 backdrop-blur-sm relative">
            {showHelp && (
              <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="font-black text-blue-800 text-xl md:text-2xl flex items-center gap-2">
                    <span className="text-3xl animate-bounce">💡</span> 여행 코스 짜는 방법
                  </h3>
                  <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-rose-500 bg-slate-100 p-2 rounded-full shrink-0">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="text-slate-700 font-bold text-sm md:text-base leading-relaxed space-y-3 flex-1 pb-4">
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl">
                    <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5 text-sm md:text-base">1</span>
                    <p className="pt-1 md:pt-0.5">상단에서 <strong>1일차, 2일차</strong> 탭을 선택하세요.</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl">
                    <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5 text-sm md:text-base">2</span>
                    <p className="pt-1 md:pt-0.5">왼쪽 <strong>'저장한 장소'</strong> 카드에서 장소를 찾으세요.</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl">
                    <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5 text-sm md:text-base">3</span>
                    <p className="pt-1 md:pt-0.5 break-keep">파란색 <strong>[+ N일차 코스에 추가]</strong> 버튼을 누르세요!</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl">
                    <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5 text-sm md:text-base">4</span>
                    <p className="pt-1 md:pt-0.5">위아래 화살표를 눌러 방문 순서를 바꿀 수 있습니다.</p>
                  </div>
                </div>
              </div>
            )}
            
            {schedules[selectedDay] && schedules[selectedDay].length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {schedules[selectedDay].map((placeId, index) => {
                  const place = places.find(p => p.id === placeId);
                  if (!place) return null;
                  return (
                    <div key={placeId} className="bg-white rounded-xl p-3 flex gap-3 items-center border-2 border-blue-100 shadow-sm group/sched hover:border-blue-300 transition-colors">
                      <div className="flex flex-col gap-1 items-center justify-center text-slate-300 opacity-0 group-hover/sched:opacity-100 transition-opacity">
                        <button 
                          onClick={() => movePlaceInSchedule(selectedDay, index, index - 1)}
                          disabled={index === 0}
                          className="hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-300"
                        >
                          <span className="material-symbols-outlined text-xl">expand_less</span>
                        </button>
                        <button 
                          onClick={() => movePlaceInSchedule(selectedDay, index, index + 1)}
                          disabled={index === schedules[selectedDay].length - 1}
                          className="hover:text-blue-500 disabled:opacity-30 disabled:hover:text-slate-300"
                        >
                          <span className="material-symbols-outlined text-xl">expand_more</span>
                        </button>
                      </div>
                      
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-black text-blue-600">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{place.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{place.category}</p>
                      </div>

                      <button
                        onClick={() => removePlaceFromSchedule(selectedDay, placeId)}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-4 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 rounded-3xl border-2 border-dashed border-blue-200 m-2">
                <div className="text-5xl mb-1 animate-bounce">💡</div>
                <div className="space-y-3 px-4">
                  <h3 className="font-black text-blue-800 text-lg">여행 코스 짜는 방법</h3>
                  <div className="text-slate-600 font-medium text-sm leading-relaxed text-left bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col gap-2">
                    <p>1. 상단에서 <strong>1일차, 2일차</strong> 탭을 선택하세요.</p>
                    <p>2. 왼쪽 <strong>'저장한 장소'</strong> 카드에서 장소를 찾으세요.</p>
                    <p>3. 파란색 <strong>[+ {selectedDay}일차 코스에 추가]</strong> 버튼을 누르세요!</p>
                    <p>4. 추가된 장소들은 위아래 화살표로 순서를 바꿀 수 있습니다.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-12 px-6 md:px-10 relative z-10">
        <AdBanner slot="dashboard-bottom" className="h-32 bg-white shadow-sm border-2 border-white/60" />
      </div>
    </div>
    </div>
  );
}
