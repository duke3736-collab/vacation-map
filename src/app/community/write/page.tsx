"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  Link as LinkIcon, 
  ChevronDown,
  Highlighter,
  Type
} from "lucide-react";

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
  const editorRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState("자유");
  const [title, setTitle] = useState("");
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
        setNickname(loadedPost.nickname);
        if (editorRef.current) {
          editorRef.current.innerHTML = loadedPost.content;
        }
      } else {
        alert("수정할 게시글을 찾을 수 없습니다.");
        router.push("/community");
      }
      setIsLoading(false);
    };

    fetchPostDetail();
  }, [editId, router]);

  // Execute browser commands for rich text editing
  const execCmd = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Custom action to insert the yellow highlighted link
  const insertHighlightLink = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let selectedText = range.toString().trim();
      
      const linkText = prompt("링크에 표시할 텍스트를 입력하세요:", selectedText || "▶한의원 건강보험 적용 범위 바로 보기");
      if (!linkText) return;
      const linkUrl = prompt("연결할 링크 URL 주소를 입력하세요:", "https://");
      if (!linkUrl) return;

      const link = document.createElement("a");
      link.href = linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "text-blue-600 font-bold px-1.5 py-0.5 rounded hover:underline inline-flex items-center";
      link.style.backgroundColor = "#fef08a"; // Tailwind yellow-200
      link.textContent = linkText;

      range.deleteContents();
      range.insertNode(link);

      // Move cursor after the inserted link
      range.setStartAfter(link);
      range.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!nickname.trim()) { alert("닉네임을 입력해주세요."); return; }

    const contentHtml = editorRef.current?.innerHTML || "";
    if (!contentHtml.trim() || contentHtml === "<br>") {
      alert("내용을 입력해주세요.");
      return;
    }

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
              content: contentHtml,
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
                content: contentHtml,
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
              content: contentHtml,
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
            content: contentHtml,
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
        <div className="max-w-3xl mx-auto">
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

      <div className="max-w-3xl mx-auto px-4 py-6">
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

          {/* 에디터 컴포넌트 */}
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
            
            {/* 에디터 영역 */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              
              {/* WYSIWYG 에디터 툴바 */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200 rounded-t-xl p-2.5 border-b-0 text-slate-600 select-none">
                {/* 문단 스타일 */}
                <select 
                  onChange={(e) => execCmd("formatBlock", e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none text-slate-700"
                  defaultValue="<p>"
                >
                  <option value="<p>">본문</option>
                  <option value="<h1>">제목 1</option>
                  <option value="<h2>">제목 2</option>
                  <option value="<h3>">제목 3</option>
                </select>

                {/* 글꼴 크기 */}
                <select 
                  onChange={(e) => execCmd("fontSize", e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none text-slate-700"
                  defaultValue="3"
                >
                  <option value="1">작게</option>
                  <option value="3">기본</option>
                  <option value="5">크게</option>
                  <option value="7">아주 크게</option>
                </select>

                <span className="text-slate-300 mx-1">|</span>

                {/* 서식 단추 */}
                <button 
                  type="button" 
                  onClick={() => execCmd("bold")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="굵게"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("italic")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="기울임꼴"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("underline")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="밑줄"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("strikeThrough")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="취소선"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <span className="text-slate-300 mx-1">|</span>

                {/* 텍스트 색상 및 형광펜 */}
                <button 
                  type="button" 
                  onClick={() => {
                    const color = prompt("텍스트 색상을 입력하세요 (예: red, blue, #333):", "#000000");
                    if (color) execCmd("foreColor", color);
                  }} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors flex items-center gap-0.5" 
                  title="글자 색상"
                >
                  <Type className="w-4 h-4" />
                  <span className="text-[9px]">A</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("backColor", "#fef08a")} 
                  className="p-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded border border-yellow-200 transition-colors" 
                  title="형광펜 강조"
                >
                  <Highlighter className="w-4 h-4" />
                </button>

                <span className="text-slate-300 mx-1">|</span>

                {/* 정렬 */}
                <button 
                  type="button" 
                  onClick={() => execCmd("justifyLeft")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="왼쪽 정렬"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("justifyCenter")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="가운데 정렬"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => execCmd("justifyRight")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="오른쪽 정렬"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                
                {/* 리스트 */}
                <button 
                  type="button" 
                  onClick={() => execCmd("insertUnorderedList")} 
                  className="p-1 hover:bg-slate-200 rounded transition-colors" 
                  title="글머리 기호"
                >
                  <List className="w-4 h-4" />
                </button>

                <span className="text-slate-300 mx-1">|</span>

                {/* 노란색 강조 링크 삽입 */}
                <button 
                  type="button" 
                  onClick={insertHighlightLink} 
                  className="px-2 py-1 bg-yellow-100 hover:bg-yellow-250 text-yellow-900 border border-yellow-300 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm" 
                  title="노란색 강조 링크 삽입"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>강조 링크</span>
                </button>
              </div>

              {/* 편집창 영역 */}
              <div 
                ref={editorRef}
                contentEditable={true}
                className="w-full min-h-[350px] border border-slate-200 rounded-b-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 bg-white overflow-y-auto"
                style={{ outline: "none" }}
                data-placeholder="내용을 자유롭게 작성해주세요 😊&#10;방학 때 다녀온 곳, 추천 장소, 질문 모두 환영합니다!"
              />
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
