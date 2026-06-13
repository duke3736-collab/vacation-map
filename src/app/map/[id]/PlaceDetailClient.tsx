"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useMapStore } from "@/store/useMapStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Place, Category } from "@/data/places";
import { supabase } from "@/lib/supabase";
import clsx from "clsx";

const CATEGORY_COLORS: Record<Category, string> = {
  "박물관": "#9333ea",
  "체험학습": "#16a34a",
  "1달 살기": "#0ea5e9",
  "학원": "#2563eb",
  "축제": "#ec4899",
  "색다른 경험": "#f97316",
  "궁투어": "#d97706",
};

const CATEGORY_BG: Record<Category, string> = {
  "박물관": "bg-purple-100 text-purple-800",
  "체험학습": "bg-green-100 text-green-800",
  "1달 살기": "bg-sky-100 text-sky-800",
  "학원": "bg-blue-100 text-blue-800",
  "축제": "bg-pink-100 text-pink-800",
  "색다른 경험": "bg-orange-100 text-orange-800",
  "궁투어": "bg-amber-100 text-amber-800",
};

// 카테고리별 폴백 이미지
const CATEGORY_FALLBACK: Record<Category, string> = {
  "박물관": "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600&auto=format&fit=crop&q=80",
  "체험학습": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
  "1달 살기": "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?w=600&auto=format&fit=crop&q=80",
  "학원": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
  "축제": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
  "색다른 경험": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
  "궁투어": "/images/bg_palace.png",
};

const getCategoryIcon = (cat: Category) => {
  switch (cat) {
    case "박물관": return "🏛️";
    case "색다른 경험": return "🎨";
    case "1달 살기": return "🏠";
    case "학원": return "📚";
    case "축제": return "🎡";
    case "체험학습": return "🏃‍♂️";
    case "궁투어": return "🏯";
    default: return "📍";
  }
};

interface PlaceDetailClientProps {
  place: Place;
  gallery: string[];
  similarPlaces: Place[];
}

// 이미지 에러 핸들러
function imgFallback(e: React.SyntheticEvent<HTMLImageElement>, fallback: string) {
  const target = e.currentTarget;
  if (target.src !== fallback) target.src = fallback;
}

export default function PlaceDetailClient({ place, gallery, similarPlaces }: PlaceDetailClientProps) {
  const router = useRouter();
  const { user, signInWithProvider } = useAuthStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [mapLoading, mapError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "11032eefd7d0111cb94d93c0ab41eb01",
  });

  const { savedPlaceIds, toggleSavePlace, setPlaceForReport, setFocusedPlaceId } = useMapStore();
  const isSaved = savedPlaceIds.includes(place.id);
  const fallbackImg = CATEGORY_FALLBACK[place.category];

  // 1. 해당 장소에 업로드된 추가 사진들을 Supabase DB에서 조회
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("place_photos")
          .select("image_url")
          .eq("place_id", place.id)
          .order("created_at", { ascending: false });
          
        if (!error && data) {
          setUploadedPhotos(data.map(item => item.image_url));
        }
      } catch (err) {
        console.error("Failed to fetch place photos:", err);
      }
    };
    fetchPhotos();
  }, [place.id]);

  const handleGoToMap = () => {
    setFocusedPlaceId(place.id);
    router.push("/map");
  };

  const handleReport = () => {
    setPlaceForReport(place);
    router.push("/report");
  };

  // 2. Supabase Storage에 이미지 업로드 및 DB 테이블 인서트
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      signInWithProvider("kakao");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      alert("서버 인프라 연결이 되어 있지 않습니다. (Supabase 인프라 연결 필요)");
      return;
    }

    setIsUploading(true);
    try {
      // 고유 파일명 생성
      const fileExt = file.name.split(".").pop();
      const fileName = `${place.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${place.id}/${fileName}`;

      // Storage 업로드 (place-photos 버킷)
      const { error: uploadError } = await supabase.storage
        .from("place-photos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Public URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from("place-photos")
        .getPublicUrl(filePath);

      // DB 테이블 (place_photos)에 인서트
      const { error: dbError } = await supabase
        .from("place_photos")
        .insert([
          {
            place_id: place.id,
            image_url: publicUrl,
            user_id: user.id,
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      // 상태 업데이트 및 피드백
      setUploadedPhotos((prev) => [publicUrl, ...prev]);
      alert("사진이 성공적으로 업로드되었습니다!");
    } catch (err: any) {
      console.error("Photo upload error:", err);
      alert(`사진 업로드 중 오류가 발생했습니다: ${err.message || "알 수 없는 오류"}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 3. 기존 갤러리와 업로드된 동적 갤러리를 통합하여 렌더링
  const displayGallery = (() => {
    const mergedGallery = [...gallery, ...uploadedPhotos];
    const base = mergedGallery.length > 0 ? mergedGallery : [fallbackImg];
    if (base.length >= 5) return base;
    return [...base, ...Array(5 - base.length).fill(fallbackImg)];
  })();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Stickers */}
      <div
        className="absolute inset-0 z-0 opacity-25 pointer-events-none animate-[spin_600s_linear_infinite] scale-150"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      {/* ── Sticky Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-base font-bold text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            뒤로가기
          </button>

          {/* 브레드크럼 - 더 진한 색상 */}
          <div className="hidden md:flex items-center gap-1 text-base font-medium text-gray-600">
            <button onClick={() => router.push("/map")} className="hover:text-blue-600 transition-colors font-semibold">방학 맵</button>
            <span className="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
            <span className="text-gray-700 font-semibold">{place.category}</span>
            <span className="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
            <span className="text-gray-900 font-bold truncate max-w-[180px]">{place.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavePlace(place.id)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-base font-bold transition-all border",
                isSaved
                  ? "bg-pink-100 border-pink-300 text-pink-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-500"
              )}
            >
              <span className={clsx("material-symbols-outlined text-[18px]", isSaved && "font-[900]")}>
                favorite
              </span>
              {isSaved ? "저장됨" : "저장"}
            </button>
            <button
              onClick={handleGoToMap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              지도에서 보기
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 relative z-10">

        {/* ── Photo Gallery ── */}
        {!showAllPhotos ? (
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-md">
            {/* 데스크탑: Airbnb 스타일 그리드 */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-1.5 h-[500px] bg-gray-900">
              {/* 메인 큰 이미지 */}
              <div className="col-span-2 row-span-2 relative overflow-hidden group">
                <img
                  src={displayGallery[0]}
                  alt={place.name}
                  onError={(e) => imgFallback(e, fallbackImg)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                {/* 사진 요청 오버레이 - 업로드된 사진 없을 때 */}
                {uploadedPhotos.length === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-end pb-10 pointer-events-none">
                    <div className="text-center text-white px-4">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-xl font-black drop-shadow-lg">이 장소에서 찍은 사진이 있나요?</p>
                      <p className="text-sm font-medium text-white/80 mt-1 drop-shadow">아래에서 직접 현장 사진을 올려주세요!</p>
                    </div>
                  </div>
                )}
              </div>
              {/* 우측 4개 작은 이미지 */}
              {displayGallery.slice(1, 5).map((img, i) => (
                <div key={i} className="relative overflow-hidden bg-gray-800">
                  <img
                    src={img}
                    alt={`${place.name} ${i + 2}번째 사진`}
                    onError={(e) => imgFallback(e, fallbackImg)}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                </div>
              ))}
            </div>
            {/* 모바일: 단일 이미지 */}
            <div className="md:hidden h-[260px] relative overflow-hidden bg-gray-200">
              <img
                src={displayGallery[0]}
                alt={place.name}
                onError={(e) => imgFallback(e, fallbackImg)}
                className="w-full h-full object-cover"
              />
              {/* 사진 요청 오버레이 - 모바일 */}
              {uploadedPhotos.length === 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent flex flex-col items-center justify-end pb-5 pointer-events-none">
                  <div className="text-center text-white px-4">
                    <p className="text-base font-black drop-shadow-lg">📷 현장 사진을 올려주세요!</p>
                    <p className="text-xs font-medium text-white/80 mt-0.5 drop-shadow">아래 버튼으로 직접 사진을 등록하세요</p>
                  </div>
                </div>
              )}
            </div>
            {/* 모든 사진 보기 버튼 */}
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl font-bold text-base shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-800"
            >
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
              모든 사진 보기 ({displayGallery.length}장)
            </button>
          </div>
        ) : (
          /* 전체 갤러리 뷰 */
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="mb-5 flex items-center gap-2 font-bold text-gray-800 hover:text-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              갤러리 닫기
            </button>
            <h2 className="text-xl font-black text-gray-900 mb-4">{place.name} 사진 ({displayGallery.length}장)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayGallery.map((img, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-sm bg-gray-100">
                  <img
                    src={img}
                    alt={`${place.name} ${i + 1}번째 사진`}
                    onError={(e) => imgFallback(e, fallbackImg)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 메인 레이아웃: 좌측 정보 + 우측 사이드바 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── 좌측: 상세 정보 ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* 제목 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-bold text-white shadow-sm"
                  style={{ backgroundColor: CATEGORY_COLORS[place.category] }}
                >
                  {getCategoryIcon(place.category)} {place.category}
                </span>
                {place.isIndoor !== undefined && (
                  <span className="px-3 py-1.5 rounded-full text-base font-bold bg-gray-100 text-gray-700">
                    {place.isIndoor ? "🏠 실내" : "🌿 야외"}
                  </span>
                )}
              </div>
              {/* 장소명 - 크고 진하게 */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">{place.name}</h1>
              <div className="flex items-start gap-2 text-gray-700">
                <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0 text-gray-500">location_on</span>
                <span className="text-base font-medium">{place.address}</span>
              </div>
            </div>

            {/* 교과 연계 정보 카드 (있을 경우만 표시) */}
            {(place.targetGrades || (place.curriculumLinks && place.curriculumLinks.length > 0)) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-50">
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-base">📚</span>
                  교과 연계 정보
                </h2>
                
                {place.targetGrades && (
                  <div className="mb-4">
                    <div className="text-sm font-bold text-gray-500 mb-2">추천 학년</div>
                    <div className="flex flex-wrap gap-2">
                      {place.targetGrades.map(grade => (
                        <span key={grade} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {place.curriculumLinks && place.curriculumLinks.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-gray-500 mb-2">연계 단원</div>
                    <div className="space-y-3">
                      {place.curriculumLinks.map((link, i) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">{link.subject}</span>
                            <span className="text-sm font-bold text-gray-900">{link.grade} - {link.unit}</span>
                          </div>
                          {link.hint && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              <span className="font-bold text-blue-600 mr-1">💡 힌트:</span>
                              {link.hint}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 방문 정보 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-base">📋</span>
                방문 정보
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {place.hours && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl shrink-0">🕒</div>
                    <div>
                      <div className="text-sm font-black text-emerald-800 mb-1.5 tracking-wide">운영시간</div>
                      <div className="text-base font-bold text-gray-900 leading-snug">{place.hours}</div>
                    </div>
                  </div>
                )}
                {place.fee && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-xl shrink-0">💵</div>
                    <div>
                      <div className="text-sm font-black text-blue-800 mb-1.5 tracking-wide">입장료</div>
                      <div className="text-base font-bold text-gray-900 leading-snug">{place.fee}</div>
                    </div>
                  </div>
                )}
                {place.age && (
                  <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border-l-4 border-rose-500">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-xl shrink-0">👶</div>
                    <div>
                      <div className="text-sm font-black text-rose-800 mb-1.5 tracking-wide">권장 연령</div>
                      <div className="text-base font-bold text-gray-900 leading-snug">{place.age}</div>
                    </div>
                  </div>
                )}
                {place.phone && (
                  <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border-l-4 border-violet-500">
                    <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center text-xl shrink-0">📞</div>
                    <div>
                      <div className="text-sm font-black text-violet-800 mb-1.5 tracking-wide">전화번호</div>
                      <a
                        href={`tel:${place.phone}`}
                        className="text-base font-bold text-violet-700 hover:text-violet-900 hover:underline"
                      >
                        {place.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 꿀팁 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white text-base">💡</span>
                방문 꿀팁
              </h2>
              <div className="space-y-3">
                {[
                  { tip: "방학 시즌에는 혼잡할 수 있으니", highlight: "평일 오전", end: "에 방문하는 것이 좋습니다." },
                  { tip: "아이와 함께라면", highlight: "사전 예약", end: "으로 대기 시간을 줄여보세요." },
                  { tip: "방문 전 전화로", highlight: "특별 프로그램", end: "이나 행사 일정을 확인해보세요." },
                  { tip: "주변 음식점을 미리 검색해두면", highlight: "점심 동선", end: "을 편하게 짤 수 있어요." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <span className="text-lg shrink-0">✅</span>
                    <p className="text-base text-gray-800 font-medium leading-relaxed">
                      {item.tip} <strong className="text-amber-700 font-black">{item.highlight}</strong>{item.end}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 지도 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-base">📍</span>
                위치
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 320 }}>
                {mapError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 p-4 text-center">
                    <span className="material-symbols-outlined text-2xl text-red-400 mb-1">error</span>
                    <div className="text-sm font-bold">지도 로드 실패</div>
                    <div className="text-xs text-slate-400 mt-1 leading-normal break-all">
                      도메인 등록 확인 필요: {typeof window !== "undefined" ? window.location.hostname : ""}<br/>
                      {mapError.message || mapError.toString()}
                    </div>
                  </div>
                ) : !mapLoading ? (
                  <Map
                    center={{ lat: place.lat, lng: place.lng }}
                    level={4}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <MapMarker position={{ lat: place.lat, lng: place.lng }}>
                      <div className="bg-white px-2 py-1 rounded-lg text-sm font-bold shadow-md text-gray-900 whitespace-nowrap border border-gray-100">
                        📍 {place.name}
                      </div>
                    </MapMarker>
                  </Map>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold">
                    <div className="animate-pulse">지도를 불러오는 중입니다...</div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-base font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-500">location_on</span>
                {place.address}
              </p>
            </div>
          </div>

          {/* ── 우측: 액션 사이드바 ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* 메인 CTA 카드 */}
              <div className="rounded-2xl border-2 border-gray-100 shadow-xl p-6 space-y-4 bg-white">
                {/* 카테고리 배지 */}
                <div className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-black", CATEGORY_BG[place.category])}>
                  {getCategoryIcon(place.category)} {place.category}
                </div>

                <div>
                  <p className="text-gray-600 text-base font-semibold mb-1">이 장소에서</p>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{place.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 font-medium truncate">{place.address}</p>
                </div>

                {/* 빠른 정보 */}
                {place.hours && (
                  <div className="flex items-start gap-2 text-base bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <span className="shrink-0 mt-0.5">🕒</span>
                    <span className="text-gray-800 font-semibold leading-snug">{place.hours}</span>
                  </div>
                )}
                {place.fee && (
                  <div className="flex items-start gap-2 text-base bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <span className="shrink-0 mt-0.5">💵</span>
                    <span className="text-gray-800 font-semibold leading-snug">{place.fee}</span>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {/* 보고서 버튼 */}
                  <button
                    onClick={handleReport}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-xl font-black text-base transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_document</span>
                    보고서 쓰기
                  </button>

                  {/* 찜하기 버튼 */}
                  <button
                    onClick={() => toggleSavePlace(place.id)}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-base transition-all border-2",
                      isSaved
                        ? "bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100"
                        : "bg-white border-gray-200 text-gray-800 hover:border-gray-400 hover:bg-gray-50"
                    )}
                  >
                    <span className={clsx("material-symbols-outlined text-[18px]", isSaved && "font-[900]")}>
                      favorite
                    </span>
                    {isSaved ? "찜한 장소 ❤️" : "찜하기"}
                  </button>

                  {/* 지도 보기 버튼 */}
                  <button
                    onClick={handleGoToMap}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-800 py-3.5 rounded-xl font-bold text-base transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    지도에서 보기
                  </button>
                </div>
              </div>

              {/* 전화 카드 */}
              {place.phone && (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-xl shrink-0">📞</div>
                  <div>
                    <div className="text-sm text-gray-600 font-bold mb-0.5">전화 문의</div>
                    <a href={`tel:${place.phone}`} className="text-base font-black text-gray-900 hover:text-blue-600 transition-colors">
                      {place.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 사용자 참여 현장 사진 ── */}
        <div className="mt-12 pt-8 border-t-2 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-base">📷</span>
              이용자 현장 사진
            </h2>
            {user ? (
              <label className="cursor-pointer bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                {isUploading ? "업로드 중..." : "현장 사진 올리기"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
              </label>
            ) : (
              <button 
                onClick={() => signInWithProvider("kakao")}
                className="bg-[#FEE500] text-[#000000] px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-95 transition-all flex items-center gap-1.5 shadow-sm"
              >
                카카오로 로그인하고 사진 올리기
              </button>
            )}
          </div>
          
          <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">photo_camera</span>
            <p className="font-bold text-slate-700 text-lg">아직 등록된 현장 사진이 없습니다.</p>
            <p className="text-sm mt-1">이 장소의 첫 번째 사진을 올려주세요!</p>
          </div>
        </div>

        {/* ── 비슷한 장소 추천 ── */}
        {similarPlaces.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">
                {getCategoryIcon(place.category)} 비슷한 장소 추천
              </h2>
              <button
                onClick={() => router.push("/map")}
                className="text-base font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                전체 보기
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarPlaces.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => router.push(`/map/${sp.id}`)}
                  className="text-left rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="h-36 overflow-hidden bg-gray-100">
                    <img
                      src={sp.imageUrl || CATEGORY_FALLBACK[sp.category]}
                      alt={sp.name}
                      onError={(e) => imgFallback(e, CATEGORY_FALLBACK[sp.category])}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-black mb-1" style={{ color: CATEGORY_COLORS[sp.category] }}>
                      {getCategoryIcon(sp.category)} {sp.category}
                    </div>
                    <div className="font-black text-base text-gray-900 truncate">{sp.name}</div>
                    <div className="text-sm text-gray-600 font-medium truncate mt-0.5">{sp.address}</div>
                    {sp.fee && (
                      <div className="text-sm text-gray-700 mt-1.5 font-bold truncate">💵 {sp.fee}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
