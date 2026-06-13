"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["전체", "방학후기", "질문", "정보공유", "자유"];
const CATEGORY_ICONS: Record<string, string> = {
  방학후기: "🏖️",
  질문: "❓",
  정보공유: "📢",
  자유: "💬",
};
const CATEGORY_COLORS: Record<string, string> = {
  방학후기: "bg-orange-100 text-orange-700",
  질문: "bg-blue-100 text-blue-700",
  정보공유: "bg-green-100 text-green-700",
  자유: "bg-purple-100 text-purple-700",
};

interface Post {
  id: string;
  category: string;
  title: string;
  content: string;
  nickname: string;
  like_count: number;
  view_count: number;
  created_at: string;
  comment_count?: number;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  if (h < 24) return `${h}시간 전`;
  if (d < 7) return `${d}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const fetchPosts = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      let query = supabase
        .from("community_posts")
        .select("id, category, title, content, nickname, like_count, view_count, created_at");

      if (selectedCategory !== "전체") {
        query = query.eq("category", selectedCategory);
      }

      if (sortBy === "popular") {
        query = query.order("like_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query.limit(50);
      if (!error && data) setPosts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black mb-1">🌟 방학 이야기</h1>
          <p className="text-violet-200 text-sm">방학 중 경험, 정보, 질문을 자유롭게 나눠요!</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 글쓰기 버튼 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat !== "전체" && CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
          <Link
            href="/community/write"
            className="shrink-0 ml-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            ✏️ 글쓰기
          </Link>
        </div>

        {/* 정렬 */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "latest", label: "최신순" },
            { key: "popular", label: "인기순" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key as "latest" | "popular")}
              className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors ${
                sortBy === key ? "text-violet-600 bg-violet-50" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 게시글 목록 */}
        {isLoading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <p>불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">🌱</div>
            <p className="font-bold text-slate-600 text-lg">아직 게시글이 없어요</p>
            <p className="text-sm mt-1">첫 번째 글을 작성해보세요!</p>
            <Link
              href="/community/write"
              className="mt-4 inline-block bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors"
            >
              ✏️ 첫 글 쓰기
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          CATEGORY_COLORS[post.category] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {CATEGORY_ICONS[post.category]} {post.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span className="font-bold text-slate-600">{post.nickname}</span>
                  <span>·</span>
                  <span>{timeAgo(post.created_at)}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <span>❤️ {post.like_count}</span>
                    <span>👁️ {post.view_count}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
