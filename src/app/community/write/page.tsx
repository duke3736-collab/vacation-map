"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["방학후기", "질문", "정보공유", "자유"];
const CATEGORY_ICONS: Record<string, string> = {
  방학후기: "🏖️",
  질문: "❓",
  정보공유: "📢",
  자유: "💬",
};

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [category, setCategory] = useState("자유");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing post if in edit mode
  useEffect(() => {
    if (!editId) {
      // Restore nickname in write mode
      const savedNickname = localStorage.getItem("community_nickname");
      if (savedNickname) setNickname(savedNickname);
      return;
    }

    const fetchPostDetail = async () => {
      setIsLoading(true);
      let loadedPost: any = null;

      // Try internal API
      try {
        const res = await fetch(`/api/community/${editId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) loadedPost = data.post;
        }
      } catch (err) {
        console.warn("Failed to fetch post from API, checking localStorage");
      }

      // Try localStorage fallback
      if (!loadedPost) {
        const localPostsRaw = localStorage.getItem("local_community_posts");
        if (localPostsRaw) {
          const localPosts = JSON.parse(localPostsRaw);
          loadedPost = localPosts.find((p: any) => p.id === editId);
        }
      }

      if (loadedPost) {
        setCategory(loadedPost.category);
        setTitle(loadedPost.title);
        setContent(loadedPost.content);
        setNickname(loadedPost.nickname);
      } else {
        alert("수정할 게시글을 찾을 수 없습니다.");
        router.push("/community");
      }
      setIsLoading(false);
    };

    fetchPostDetail();
  }, [editId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    if (!nickname.trim()) { alert("닉네임을 입력해주세요."); return; }

    setIsSubmitting(true);
    try {
      localStorage.setItem("community_nickname", nickname.trim());
      let targetId = editId || `post-${Date.now()}`;

      if (editId) {
        // Edit mode: PUT request
        try {
          const res = await fetch(`/api/community/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              title: title.trim(),
              content: content.trim(),
              nickname: nickname.trim(),
            }),
          });
          if (!res.ok) {
            throw new Error("API update failed");
          }
        } catch (err) {
          console.warn("API PUT failed, using local update", err);
          // Fallback local edit update
          const existingLocalRaw = localStorage.getItem("local_community_posts");
          if (existingLocalRaw) {
            const localPosts = JSON.parse(existingLocalRaw);
            const idx = localPosts.findIndex((p: any) => p.id === editId);
            if (idx !== -1) {
              localPosts[idx] = {
                ...localPosts[idx],
                category,
                title: title.trim(),
                content: content.trim(),
                nickname: nickname.trim(),
              };
              localStorage.setItem("local_community_posts", JSON.stringify(localPosts));
            }
          }
        }
      } else {
        // Create mode: POST request
        try {
          const res = await fetch("/api/community", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              title: title.trim(),
              content: content.trim(),
              nickname: nickname.trim(),
            }),
          });

          if (res.ok) {
            const created = await res.json();
            if (created.id) targetId = created.id;
          }
        } catch (err) {
          console.warn("API write failed, using local post", err);
          // Fallback local save
          const newPost = {
            id: targetId,
            category: category as any,
            title: title.trim(),
            content: content.trim(),
            nickname: nickname.trim(),
            like_count: 0,
            view_count: 1,
            created_at: new Date().toISOString(),
            comment_count: 0,
          };
          const existingLocalRaw = localStorage.getItem("local_community_posts");
          const existingLocal = existingLocalRaw ? JSON.parse(existingLocalRaw) : [];
          localStorage.setItem("local_community_posts", JSON.stringify([newPost, ...existingLocal]));
        }
      }

      router.push(`/community/${targetId}`);
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertHighlightLink = () => {
    const linkText = prompt("링크에 표시할 텍스트를 입력하세요:", "▶한의원 건강보험 적용 범위 바로 보기");
    if (!linkText) return;
    const linkUrl = prompt("연결할 링크 URL 주소를 입력하세요:", "https://");
    if (!linkUrl) return;

    const markdownLink = `[${linkText}](${linkUrl})`;
    setContent((prev) => prev + (prev ? "\n" : "") + markdownLink);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3 animate-pulse">📋</div>
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white pt-20 md:pt-24 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-violet-200 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-2xl font-black">{editId ? "✏️ 글 수정하기" : "✏️ 글쓰기"}</h1>
          <p className="text-violet-200 text-sm mt-1">로그인 없이 바로 작성할 수 있어요!</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 카테고리 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <label className="block text-sm font-black text-slate-700 mb-3">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    category === cat
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <label className="block text-sm font-black text-slate-700 mb-2">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="표시될 닉네임을 입력하세요"
              maxLength={20}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">다음번에 자동으로 기억됩니다 💾</p>
          </div>

          {/* 제목 + 내용 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={100}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black text-slate-700">
                  내용 <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={insertHighlightLink}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold px-2.5 py-1 rounded-lg border border-yellow-200 transition-colors flex items-center gap-1"
                >
                  🔗 강조 링크 삽입
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 자유롭게 작성해주세요 😊&#10;&#10;방학 때 다녀온 곳, 추천 장소, 궁금한 점 모두 환영합니다!"
                rows={10}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{content.length}자</p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl text-base transition-colors shadow-md"
          >
            {isSubmitting ? (editId ? "수정 중..." : "등록 중...") : (editId ? "✅ 게시글 수정하기" : "✅ 게시글 등록하기")}
          </button>
          <p className="text-center text-xs text-slate-400">
            📌 부적절한 내용은 운영자에 의해 삭제될 수 있습니다.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CommunityWritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3 animate-pulse">📋</div>
          <p>불러오는 중...</p>
        </div>
      </div>
    }>
      <WriteForm />
    </Suspense>
  );
}
