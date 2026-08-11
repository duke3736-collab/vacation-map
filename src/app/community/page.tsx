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

const POSTS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
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

        const { data, error } = await query.limit(100);
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

  // 카테고리나 정렬 변경 시 페이지 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 배너 + 필터 통합 */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white px-4 pt-20 md:pt-24 pb-0 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                <span>🌟 방학 이야기</span>
              </h1>
              <p className="text-violet-200 text-xs md:text-sm mt-1">방학 중 경험, 정보, 소소한 일상을 함께 나누는 공간입니다!</p>
            </div>
            <Link
              href="/community/write"
              className="bg-white text-violet-700 px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-violet-50 transition-all shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              ✏️ 글쓰기
            </Link>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-t-2xl text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  selectedCategory === cat
                    ? "bg-slate-50 text-violet-700 border-violet-600 font-black shadow-sm"
                    : "text-violet-200 border-transparent hover:text-white hover:bg-white/10"
                }`}
              >
                {cat !== "전체" && CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 게시글 영역 (2컬럼) */}
          <div className="lg:col-span-2">
            {/* 정렬 & 총 개수 */}
            <div className="flex items-center justify-between mb-4 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex gap-1">
                {[
                  { key: "latest", label: "최신순 🕒" },
                  { key: "popular", label: "인기순 🔥" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key as "latest" | "popular")}
                    className={`text-xs md:text-sm font-bold px-3 py-1.5 rounded-xl transition-all ${
                      sortBy === key ? "text-violet-700 bg-violet-100 font-black" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400">
                총 <strong className="text-violet-600">{posts.length}</strong>개 ({currentPage}/{totalPages}페이지)
              </span>
            </div>

            {/* 게시글 목록 */}
            {isLoading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-400">
                <div className="text-4xl mb-3 animate-bounce">📋</div>
                <p className="font-bold">글 목록을 불러오는 중입니다...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-400">
                <div className="text-5xl mb-3">🌱</div>
                <p className="font-bold text-slate-700 text-lg">아직 등록된 글이 없습니다</p>
                <p className="text-sm text-slate-400 mt-1">첫 번째 이야기를 먼저 시작해보세요!</p>
                <Link
                  href="/community/write"
                  className="mt-5 inline-block bg-violet-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-violet-700 transition-all shadow-md"
                >
                  ✏️ 첫 글 작성하기
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="group block bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                              CATEGORY_COLORS[post.category] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {CATEGORY_ICONS[post.category]} {post.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug group-hover:text-violet-600 transition-colors truncate">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{post.nickname}</span>
                        <span>·</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">❤️ <strong className="text-slate-700">{post.like_count}</strong></span>
                        <span className="flex items-center gap-1">💬 <strong className="text-slate-700">{post.comment_count || 0}</strong></span>
                        <span className="flex items-center gap-1">👁️ <strong className="text-slate-700">{post.view_count}</strong></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 깔끔한 10개 단위 페이지네이션 UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-1"
                >
                  <span>◀</span>
                  <span>이전</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      currentPage === page
                        ? "bg-violet-600 text-white shadow-md shadow-violet-200 scale-105"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-1"
                >
                  <span>다음</span>
                  <span>▶</span>
                </button>
              </div>
            )}
          </div>

          {/* 우측 전용 추천 & 위젯 사이드바 (1컬럼) */}
          <div className="space-y-6">
            {/* 글쓰기 유도 카톡풍 패널 */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-violet-100 rounded-3xl p-5 text-left shadow-sm">
              <h3 className="font-black text-slate-800 text-base flex items-center gap-1.5 mb-2">
                <span>💬 자유 게시판 이용안내</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                여름휴가 후기, 자녀 방학 경험담, 여행지 질문 등 다양한 이야기를 자유롭게 남겨보세요!
              </p>
              <Link
                href="/community/write"
                className="block text-center bg-violet-600 text-white py-3 rounded-2xl font-black text-sm hover:bg-violet-700 transition-all shadow-md"
              >
                ✏️ 새 글 작성하러 가기
              </Link>
            </div>

            {/* 핫한 블로그 아티클 세로 위젯 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-indigo-500 text-[18px]">lightbulb</span>
                  <span>인기 생활 & 정책 꿀팁 💡</span>
                </h3>
              </div>
              <WordPressSection customPosts={wpPosts.length > 0 ? wpPosts : undefined} limit={3} layout="vertical" title="" />
            </div>
          </div>
        </div>

        {/* 워드프레스 최신 소식 하단 그리드 */}
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
