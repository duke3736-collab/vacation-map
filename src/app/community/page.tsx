"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WordPressSection from "@/components/WordPressSection";
import { INITIAL_POSTS, Post } from "@/data/initialPosts";

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
  const [wpPosts, setWpPosts] = useState<any[]>([]);
  const [isLoadingWp, setIsLoadingWp] = useState(true);

  useEffect(() => {
    const fetchWpPosts = async () => {
      try {
        const res = await fetch("/api/wordpress");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setWpPosts(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch wp posts", err);
      } finally {
        setIsLoadingWp(false);
      }
    };
    fetchWpPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    let fetchedPosts: Post[] = [];
    let isSupabaseSuccess = false;

    // 1. Try fetching from Supabase database
    if (supabase) {
      try {
        let query = supabase
          .from("community_posts")
          .select(`
            id, 
            category, 
            title, 
            content, 
            nickname, 
            like_count, 
            view_count, 
            created_at
          `);

        if (sortBy === "popular") {
          query = query.order("like_count", { ascending: false });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query.limit(50);
        if (!error && data && data.length > 0) {
          fetchedPosts = data.map((post: any) => ({
            id: post.id,
            category: post.category,
            title: post.title,
            content: post.content,
            nickname: post.nickname,
            like_count: post.like_count || 0,
            view_count: post.view_count || 0,
            created_at: post.created_at,
            comment_count: 0,
          }));
          isSupabaseSuccess = true;
        }
      } catch (err) {
        console.warn("Supabase fetch unavailable:", err);
      }
    }

    // 2. Fetch from internal API route if Supabase returned nothing
    if (!isSupabaseSuccess || fetchedPosts.length === 0) {
      try {
        const res = await fetch(`/api/community?sort=${sortBy}&category=${encodeURIComponent(selectedCategory)}`);
        if (res.ok) {
          const apiPosts = await res.json();
          if (Array.isArray(apiPosts) && apiPosts.length > 0) {
            fetchedPosts = apiPosts;
          }
        }
      } catch (err) {
        console.warn("Internal API fetch failed:", err);
      }
    }

    // 3. Merge with localStorage user posts
    const localPostsRaw = typeof window !== "undefined" ? localStorage.getItem("local_community_posts") : null;
    const localPosts: Post[] = localPostsRaw ? JSON.parse(localPostsRaw) : [];

    const existingIds = new Set(fetchedPosts.map((p) => p.id));
    for (const lp of localPosts) {
      if (!existingIds.has(lp.id)) {
        if (selectedCategory === "전체" || lp.category === selectedCategory) {
          fetchedPosts.unshift(lp);
        }
      }
    }

    // Filter by selected category if needed
    if (selectedCategory !== "전체") {
      fetchedPosts = fetchedPosts.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    if (sortBy === "popular") {
      fetchedPosts.sort((a, b) => b.like_count - a.like_count);
    } else {
      fetchedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setPosts(fetchedPosts);
    setIsLoading(false);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 배너 + 필터 통합 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 pt-20 md:pt-24 pb-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black">🌟 방학 이야기</h1>
              <p className="text-violet-200 text-xs mt-0.5">방학 중 경험, 정보, 질문을 자유롭게 나눠요!</p>
            </div>
            <Link
              href="/community/write"
              className="bg-white text-violet-700 px-4 py-2 rounded-xl font-black text-sm hover:bg-violet-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              ✏️ 글쓰기
            </Link>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-t-xl text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  selectedCategory === cat
                    ? "bg-white text-violet-700 border-white"
                    : "text-violet-200 border-transparent hover:text-white"
                }`}
              >
                {cat !== "전체" && CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* 정렬 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[
              { key: "latest", label: "최신순" },
              { key: "popular", label: "인기순" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key as "latest" | "popular")}
                className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === key ? "text-violet-600 bg-violet-50" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400">총 {posts.length}개</span>
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
                  <span className="ml-auto flex items-center gap-3">
                    <span>❤️ {post.like_count}</span>
                    <span>💬 {post.comment_count || 0}</span>
                    <span>👁️ {post.view_count}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 워드프레스 최신 소식 섹션 */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2 text-left">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">lightbulb</span>
                <span>오늘의 핫한 생활 꿀팁 & 혜택 정보 💡</span>
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                정부 지원금 신청 정보부터 실시간 생활 꿀팁까지! 알찬 정보들을 확인해 보세요.
              </p>
            </div>
            <a
              href="https://weknews.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>블로그 전체보기</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          </div>

          {isLoadingWp ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-slate-150 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="aspect-[16/10] w-full bg-slate-100 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-5/6" />
                  <div className="h-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <WordPressSection customPosts={wpPosts.length > 0 ? wpPosts : undefined} limit={3} layout="grid" title="" />
          )}
        </div>
      </div>
    </div>
  );
}
