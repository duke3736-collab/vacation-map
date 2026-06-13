"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "vacation2024!";

interface PhotoRecord {
  id: string;
  place_id: string;
  image_url: string;
  report_count: number;
  is_reported: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "reported">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, reported: 0 });

  const fetchPhotos = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const query = supabase
        .from("place_photos")
        .select("id, place_id, image_url, report_count, is_reported, created_at")
        .order("created_at", { ascending: false });

      if (filter === "reported") {
        query.gt("report_count", 0);
      }

      const { data, error } = await query;
      if (!error && data) {
        setPhotos(data);
        setStats({
          total: data.length,
          reported: data.filter((p) => p.report_count > 0).length,
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAuthenticated) fetchPhotos();
  }, [isAuthenticated, fetchPhotos]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleDelete = async (photo: PhotoRecord) => {
    if (!supabase) return;
    if (!confirm(`이 사진을 삭제하시겠습니까?\n장소ID: ${photo.place_id}`)) return;

    setDeletingId(photo.id);
    try {
      // Storage에서 삭제
      const urlParts = photo.image_url.split("/place-photos/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("place-photos").remove([filePath]);
      }
      // DB에서 삭제
      await supabase.from("place_photos").delete().eq("id", photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setStats((prev) => ({
        total: prev.total - 1,
        reported: photo.report_count > 0 ? prev.reported - 1 : prev.reported,
      }));
    } catch (err) {
      console.error("Delete error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearReport = async (photoId: string) => {
    if (!supabase) return;
    await supabase
      .from("place_photos")
      .update({ report_count: 0, is_reported: false })
      .eq("id", photoId);
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, report_count: 0, is_reported: false } : p
      )
    );
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🛡️</div>
            <h1 className="text-2xl font-black text-white">관리자 페이지</h1>
            <p className="text-slate-400 text-sm mt-1">방학맵 사진 관리 시스템</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 헤더 */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-lg font-black">방학맵 사진 관리자</h1>
            <p className="text-slate-400 text-xs">이용자 업로드 현장 사진 관리</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          로그아웃
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "전체 사진", value: stats.total, color: "bg-blue-600", icon: "📷" },
            { label: "신고된 사진", value: stats.reported, color: "bg-red-600", icon: "🚩" },
            { label: "정상 사진", value: stats.total - stats.reported, color: "bg-green-600", icon: "✅" },
            { label: "신고율", value: stats.total > 0 ? `${Math.round((stats.reported / stats.total) * 100)}%` : "0%", color: "bg-amber-600", icon: "📊" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 필터 탭 + 새로고침 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
            {(["all", "reported"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f === "all" ? `전체 (${stats.total})` : `신고된 사진 (${stats.reported})`}
              </button>
            ))}
          </div>
          <button
            onClick={fetchPhotos}
            disabled={isLoading}
            className="bg-slate-800 border border-slate-700 hover:border-slate-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
          >
            <span className={isLoading ? "animate-spin" : ""}>🔄</span>
            새로고침
          </button>
        </div>

        {/* 사진 그리드 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-3 animate-pulse">📷</div>
              <p>로딩 중...</p>
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-center text-slate-500">
            <div>
              <div className="text-5xl mb-3">📭</div>
              <p className="text-lg font-bold">
                {filter === "reported" ? "신고된 사진이 없습니다." : "업로드된 사진이 없습니다."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`relative group rounded-xl overflow-hidden bg-slate-800 border transition-all ${
                  photo.report_count > 0
                    ? "border-red-500/60 shadow-red-500/20 shadow-lg"
                    : "border-slate-700"
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={photo.image_url}
                    alt="업로드 사진"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/images/bg_stickers.png";
                    }}
                  />
                  {/* 신고 배지 */}
                  {photo.report_count > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      🚩 신고 {photo.report_count}
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div className="text-xs text-slate-400 truncate">
                    📍 {photo.place_id}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(photo.created_at).toLocaleDateString("ko-KR")}
                  </div>

                  <div className="flex gap-1.5">
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleDelete(photo)}
                      disabled={deletingId === photo.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                    >
                      {deletingId === photo.id ? "삭제중..." : "🗑️ 삭제"}
                    </button>
                    {/* 신고 해제 버튼 (신고된 경우만) */}
                    {photo.report_count > 0 && (
                      <button
                        onClick={() => handleClearReport(photo.id)}
                        className="flex-1 bg-green-700 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                      >
                        ✅ 해제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
