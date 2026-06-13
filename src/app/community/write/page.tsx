"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["방학후기", "질문", "정보공유", "자유"];
const CATEGORY_ICONS: Record<string, string> = {
  방학후기: "🏖️",
  질문: "❓",
  정보공유: "📢",
  자유: "💬",
};

export default function CommunityWritePage() {
  const router = useRouter();
  const [category, setCategory] = useState("자유");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // localStorage에서 닉네임 복원
  useEffect(() => {
    const savedNickname = localStorage.getItem("community_nickname");
    if (savedNickname) setNickname(savedNickname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    if (!nickname.trim()) { alert("닉네임을 입력해주세요."); return; }
    if (!supabase) { alert("서버 연결 오류입니다."); return; }

    setIsSubmitting(true);
    try {
      // 닉네임 저장
      localStorage.setItem("community_nickname", nickname.trim());

      const { data, error } = await supabase
        .from("community_posts")
        .insert([{
          category,
          title: title.trim(),
          content: content.trim(),
          nickname: nickname.trim(),
        }])
        .select("id")
        .single();

      if (error) throw error;
      router.push(`/community/${data.id}`);
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(`오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-violet-200 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-2xl font-black">✏️ 글쓰기</h1>
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
              <label className="block text-sm font-black text-slate-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
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
            {isSubmitting ? "등록 중..." : "✅ 게시글 등록하기"}
          </button>
          <p className="text-center text-xs text-slate-400">
            📌 부적절한 내용은 운영자에 의해 삭제될 수 있습니다.
          </p>
        </form>
      </div>
    </div>
  );
}
