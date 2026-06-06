"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Map, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
import { useMapStore } from "@/store/useMapStore";
import { Category } from "@/data/places";
import clsx from "clsx";

const categoryColors: Record<Category, string> = {
  "박물관": "var(--color-museum-purple)",
  "체험학습": "var(--color-experience-green)",
  "1달 살기": "var(--color-primary-container)",
  "학원": "var(--color-academy-blue)",
  "축제": "var(--color-festival-pink)",
  "색다른 경험": "var(--color-secondary)",
};

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

// 줌 레벨에 따라 마커의 크기, 글씨 크기, 패딩을 동적으로 스케일링하는 헬퍼 함수
const getMarkerStyle = (level: number) => {
  // 가까이서 볼 때 (줌 레벨 7 이하): 알약 형태
  if (level <= 7) {
    if (level <= 3) {
      return {
        pillClass: "px-[20px] py-[12px] text-[19px]",
        iconClass: "text-xl",
        dotClass: "w-4 h-4 border-2"
      };
    }
    if (level === 4) {
      return {
        pillClass: "px-[18px] py-[10px] text-[17px]",
        iconClass: "text-[16px]",
        dotClass: "w-[14px] h-[14px] border-2"
      };
    }
    if (level === 5) {
      return {
        pillClass: "px-[16px] py-[8px] text-[15px]",
        iconClass: "text-[14px]",
        dotClass: "w-[12px] h-[12px] border-2"
      };
    }
    if (level === 6) {
      return {
        pillClass: "px-[12px] py-[6px] text-[13px]",
        iconClass: "text-[12px]",
        dotClass: "w-[10px] h-[10px] border"
      };
    }
    // level === 7 (경계)
    return {
      pillClass: "px-[10px] py-[4px] text-[11px]",
      iconClass: "text-xs",
      dotClass: "w-[8px] h-[8px] border"
    };
  }

  // 멀리서 볼 때 (줌 레벨 8 이상): 원형 이모티콘 뱃지
  if (level >= 12) {
    return {
      circleClass: "w-6 h-6 text-[11px]",
    };
  }
  if (level >= 10) {
    return {
      circleClass: "w-8 h-8 text-[13px]",
    };
  }
  // level 8, 9
  return {
    circleClass: "w-10 h-10 text-[16px]",
  };
};

export default function MapClient() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "11032eefd7d0111cb94d93c0ab41eb01",
    libraries: ["clusterer", "services"],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const { 
    filteredPlaces, 
    setPlaceForReport, 
    savedPlaceIds, 
    toggleSavePlace, 
    focusedPlaceId, 
    setFocusedPlaceId,
    center,
    level,
    setCenter,
    setLevel,
    myLocation,
    setSearchQuery
  } = useMapStore();

  useEffect(() => {
    setSearchQuery(q);
  }, [q, setSearchQuery]);

  useEffect(() => {
    if (focusedPlaceId) {
      const targetPlace = filteredPlaces.find(p => p.id === focusedPlaceId);
      if (targetPlace) {
        setCenter({ lat: targetPlace.lat, lng: targetPlace.lng });
        setLevel(5); // zoom in closely
      }
    }
  }, [focusedPlaceId, filteredPlaces, setCenter, setLevel]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-red-500 font-bold p-6 text-center">
        <span className="material-symbols-outlined text-5xl mb-3 text-red-400">error</span>
        <div className="text-lg">지도 로드 실패 (Kakao Map Load Error)</div>
        <div className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
          접속하신 도메인이 카카오 개발자 콘솔에 등록되어 있지 않거나, 앱 키가 유효하지 않을 수 있습니다.
        </div>
        <div className="text-xs text-slate-400 mt-3 max-w-md bg-black/5 p-3 rounded-xl text-left font-mono space-y-1">
          <div>• 도메인: {typeof window !== "undefined" ? window.location.origin : ""}</div>
          <div className="break-all">• 에러 내용: {error.message || error.toString()}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!loading ? (
        <Map
          center={center}
          level={level}
          onDragEnd={(map) => setCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })}
          onZoomChanged={(map) => setLevel(map.getLevel())}
          style={{ width: "100%", height: "100%" }}
        >
          {/* 내 위치 (GPS) 커스텀 마커 표시 */}
          {myLocation && (
            <CustomOverlayMap position={myLocation} yAnchor={1}>
              <div className="flex flex-col items-center select-none" style={{ transform: "translateY(-10px)" }}>
                {/* 빨간색 말풍선 */}
                <div className="relative bg-[#ff2e43] text-white px-3 py-1 rounded-full font-extrabold text-[12px] shadow-lg flex items-center gap-1 border border-[#e02438] whitespace-nowrap mb-1">
                  <span>내 위치</span>
                  <span className="text-xs animate-bounce">📍</span>
                  <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#ff2e43]" />
                </div>
                {/* 빨간 원형 맥박 점 */}
                <div className="w-4 h-4 bg-[#ff2e43] rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.3)] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#ff2e43] rounded-full animate-ping opacity-75" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full relative z-10" />
                </div>
              </div>
            </CustomOverlayMap>
          )}

          {/* 장소 커스텀 마커 루프 */}
          {filteredPlaces.map((place) => {
            const isZoomedOut = level > 7;
            const markerStyle = getMarkerStyle(level);

            return (
              <CustomOverlayMap
                key={`place-marker-${place.id}`}
                position={{ lat: place.lat, lng: place.lng }}
                yAnchor={isZoomedOut ? 0.5 : 1}
              >
                {isZoomedOut ? (
                  /* 멀리서 볼 때: 이모티콘만 표시하는 원형 뱃지 */
                  <div 
                    onClick={() => {
                      setFocusedPlaceId(place.id);
                      setCenter({ lat: place.lat, lng: place.lng });
                    }}
                    className={clsx(
                      "rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform",
                      markerStyle.circleClass
                    )}
                    style={{ backgroundColor: categoryColors[place.category] }}
                  >
                    {getCategoryIcon(place.category)}
                  </div>
                ) : (
                  /* 가까이서 볼 때: 단풍맵 스타일 다크 알약형 뱃지 + 아래 점 (줌 레벨별 동적 크기 확대) */
                  <div 
                    onClick={() => {
                      setFocusedPlaceId(place.id);
                      setCenter({ lat: place.lat, lng: place.lng });
                    }}
                    className="flex flex-col items-center select-none cursor-pointer" 
                    style={{ transform: "translateY(-10px)" }}
                  >
                    <div className={clsx(
                      "relative bg-[#22252a]/95 text-white rounded-full font-black shadow-2xl flex items-center gap-2 border border-white/25 whitespace-nowrap mb-1.5 hover:bg-[#32363e] transition-colors",
                      markerStyle.pillClass
                    )}>
                      <span className={markerStyle.iconClass}>{getCategoryIcon(place.category)}</span>
                      <span>{place.name}</span>
                      <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#22252a]/95" />
                    </div>
                    <div 
                      className={clsx("rounded-full border-white shadow-sm", markerStyle.dotClass)}
                      style={{ backgroundColor: categoryColors[place.category] }} 
                    />
                  </div>
                )}
              </CustomOverlayMap>
            );
          })}

          {/* 선택한 장소의 상세 정보 카드 오버레이 */}
          {filteredPlaces.map((place) => {
            if (focusedPlaceId === place.id) {
              return (
                <CustomOverlayMap key={`overlay-${place.id}`} position={{ lat: place.lat, lng: place.lng }} yAnchor={1.5}>
                  <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-black/5 flex flex-col gap-2 min-w-[180px]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: categoryColors[place.category], color: '#fff' }}>
                          {place.category}
                        </span>
                        <button 
                          onClick={() => toggleSavePlace(place.id)}
                          className="flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors"
                        >
                          <span className={clsx("material-symbols-outlined text-[20px]", savedPlaceIds.includes(place.id) ? "text-pink-500 font-[1000]" : "text-slate-300 hover:text-pink-400")}>
                            favorite
                          </span>
                        </button>
                      </div>
                      <button onClick={() => setFocusedPlaceId(null)} className="text-slate-400 hover:text-slate-700 transition-colors bg-black/5 rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                    <strong className="text-slate-900 text-base mt-1">{place.name}</strong>
                    <span className="text-sm text-slate-500 leading-tight font-medium mb-1">{place.address}</span>
                    <div className="mt-2 flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setPlaceForReport(place);
                          router.push("/report");
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_document</span>
                        보고서
                      </button>
                      <button
                        onClick={() => router.push(`/map/${place.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 bg-slate-50 text-slate-600 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        상세보기
                      </button>
                    </div>
                  </div>
                </CustomOverlayMap>
              );
            }
            return null;
          })}
        </Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold">
          <div className="animate-pulse">지도를 불러오는 중입니다...</div>
        </div>
      )}
    </>
  );
}
