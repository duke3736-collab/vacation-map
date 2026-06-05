"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk";
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

export default function MapClient() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "11032eefd7d0111cb94d93c0ab41eb01",
    libraries: ["clusterer", "services"],
  });

  const router = useRouter();
  const { filteredPlaces, setPlaceForReport, savedPlaceIds, toggleSavePlace, focusedPlaceId, setFocusedPlaceId } = useMapStore();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  useEffect(() => {
    if (focusedPlaceId) {
      setSelectedPlaceId(focusedPlaceId);
      // Optional: Delay clearing so it stays open, or clear immediately
      // setFocusedPlaceId(null); 
    }
  }, [focusedPlaceId, setFocusedPlaceId]);

  return (
    <>
      {!loading && !error ? (
        <Map
          center={{ lat: 37.0542, lng: 127.1022 }}
          style={{ width: "100%", height: "100%" }}
          level={12}
        >
          {filteredPlaces.map((place) => (
            <MapMarker 
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelectedPlaceId(place.id)}
            />
          ))}

          {filteredPlaces.map((place) => {
            if (selectedPlaceId === place.id) {
              return (
                <CustomOverlayMap key={`overlay-${place.id}`} position={{ lat: place.lat, lng: place.lng }} yAnchor={1.5}>
                  <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-black/5 flex flex-col gap-2 min-w-[180px]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: categoryColors[place.category], color: '#fff' }}>
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
                      <button onClick={() => setSelectedPlaceId(null)} className="text-slate-400 hover:text-slate-700 transition-colors bg-black/5 rounded-full w-6 h-6 flex items-center justify-center font-bold">×</button>
                    </div>
                    <strong className="text-slate-900 text-base mt-1">{place.name}</strong>
                    <span className="text-xs text-slate-500 leading-tight font-medium mb-1">{place.address}</span>
                    <button 
                      onClick={() => {
                        setPlaceForReport(place);
                        router.push("/report");
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_document</span>
                      보고서 쓰기
                    </button>
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
