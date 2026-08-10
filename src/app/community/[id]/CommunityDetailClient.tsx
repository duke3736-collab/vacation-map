"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post, Comment } from "@/data/initialPosts";

const CATEGORY_ICONS: Record<string, string> = {
  방학후기: "🏖️",
  질문: "❓",
  정보공유: "📢",
  자유: "💬",
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

export default function CommunityDetailClient({ id, initialPost }: { id: string; initialPost?: Post | null }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [liked, setLiked] = useState(false);
  const [commentNickname, setCommentNickname] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNickname = localStorage.getItem("community_nickname");
      if (savedNickname) setCommentNickname(savedNickname);
      const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
      setLiked(likedPosts.includes(id));
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      let loadedPost: Post | null = initialPost || null;
      let loadedComments: Comment[] = [];

      try {
        const res = await fetch(`/api/community/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) loadedPost = data.post;
          if (data.comments) loadedComments = data.comments;
        }
      } catch (err) {
        console.warn("Internal API fetch failed", err);
      }

      if (!loadedPost && typeof window !== "undefined") {
        const localPostsRaw = localStorage.getItem("local_community_posts");
        const localPosts: Post[] = localPostsRaw ? JSON.parse(localPostsRaw) : [];
        const found = localPosts.find((p) => p.id === id);
        if (found) {
          loadedPost = { ...found, view_count: (found.view_count || 0) + 1 };
        }
      }

      if (loadedComments.length === 0 && typeof window !== "undefined") {
        const localCommentsRaw = localStorage.getItem(`local_comments_${id}`);
        const localComments: Comment[] = localCommentsRaw ? JSON.parse(localCommentsRaw) : [];
        loadedComments = localComments;
      }

      if (loadedPost) setPost(loadedPost);
      setComments(loadedComments);
      setIsLoading(false);
    };

    fetchData();
  }, [id, initialPost]);

  const handleLike = async () => {
    if (!post) return;
    const likedPosts: string[] = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    const newCount = liked ? Math.max(0, post.like_count - 1) : post.like_count + 1;
    const nextLiked = !liked;

    setPost({ ...post, like_count: newCount });
    setLiked(nextLiked);

    if (nextLiked) {
      localStorage.setItem("liked_posts", JSON.stringify([...likedPosts, id]));
    } else {
      localStorage.setItem("liked_posts", JSON.stringify(likedPosts.filter((p) => p !== id)));
    }

    try {
      await fetch(`/api/community/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "like", action: nextLiked ? "like" : "unlike" }),
      });
    } catch (e) {}
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) { alert("댓글 내용을 입력해주세요."); return; }
    if (!commentNickname.trim()) { alert("닉네임을 입력해주세요."); return; }

    setIsSubmittingComment(true);
    try {
      localStorage.setItem("community_nickname", commentNickname.trim());

      let createdComment: Comment | null = null;

      try {
        const res = await fetch(`/api/community/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "comment",
            content: commentContent.trim(),
            nickname: commentNickname.trim(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.comment) createdComment = data.comment;
        }
      } catch (err) {}

      if (!createdComment) {
        createdComment = {
          id: `c-${Date.now()}`,
          post_id: id,
          content: commentContent.trim(),
          nickname: commentNickname.trim(),
          created_at: new Date().toISOString(),
        };
        const localCommentsRaw = localStorage.getItem(`local_comments_${id}`);
        const localComments: Comment[] = localCommentsRaw ? JSON.parse(localCommentsRaw) : [];
        localStorage.setItem(`local_comments_${id}`, JSON.stringify([...localComments, createdComment]));
      }

      setComments((prev) => [...prev, createdComment!]);
      setCommentContent("");
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      const localPostsRaw = localStorage.getItem("local_community_posts");
      if (localPostsRaw) {
        const localPosts: Post[] = JSON.parse(localPostsRaw);
        const updated = localPosts.filter((p) => p.id !== id);
        localStorage.setItem("local_community_posts", JSON.stringify(updated));
      }

      try {
        await fetch(`/api/community/${id}`, { method: "DELETE" });
      } catch (e) {}

      router.push("/community");
    } catch (err) {
      console.error("Delete error:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const localCommentsRaw = localStorage.getItem(`local_comments_${id}`);
    if (localCommentsRaw) {
      const localComments: Comment[] = JSON.parse(localCommentsRaw);
      localStorage.setItem(`local_comments_${id}`, JSON.stringify(localComments.filter((c) => c.id !== commentId)));
    }

    try {
      await fetch(`/api/community/${id}?commentId=${commentId}`, { method: "DELETE" });
    } catch (e) {}
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

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">😢</div>
          <p className="font-bold text-slate-700">게시글을 찾을 수 없습니다.</p>
          <Link href="/community" className="mt-4 inline-block text-violet-600 font-bold hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white pt-20 md:pt-24 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/community" className="text-violet-200 hover:text-white text-sm flex items-center gap-1 mb-3 w-fit transition-colors">
            ← 방학 이야기
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-black px-2.5 py-1 rounded-full bg-white/20 text-white`}>
              {CATEGORY_ICONS[post.category]} {post.category}
            </span>
          </div>
          <h1 className="text-xl font-black leading-snug">{post.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-violet-200 text-sm">
            <span className="font-bold text-white">{post.nickname}</span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
            <span className="ml-auto flex items-center gap-3">
              <span>❤️ {post.like_count}</span>
              <span>👁️ {post.view_count}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* 본문 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div 
            className="text-gray-700 leading-relaxed text-sm rich-editor-content"
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 좋아요 */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                liked
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-red-200 hover:text-red-400"
              }`}
            >
              {liked ? "❤️" : "🤍"} 좋아요 {post.like_count}
            </button>
            <div className="flex items-center gap-3">
              <Link
                href={`/community/write?edit=${id}`}
                className="text-xs text-slate-400 hover:text-violet-600 transition-colors"
              >
                게시글 수정
              </Link>
              <span className="text-xs text-slate-200">|</span>
              <button
                onClick={handleDeletePost}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                게시글 삭제
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            💬 댓글 <span className="text-sm text-gray-400 font-bold">{comments.length}개</span>
          </h2>

          {comments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">첫 번째 댓글을 남겨보세요!</p>
          ) : (
            <div className="space-y-3 mb-5">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 rounded-xl p-4 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900">{comment.nickname}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{timeAgo(comment.created_at)}</span>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 작성 */}
          <form onSubmit={handleCommentSubmit} className="border-t border-slate-100 pt-4 space-y-2">
            <input
              type="text"
              value={commentNickname}
              onChange={(e) => setCommentNickname(e.target.value)}
              placeholder="닉네임"
              maxLength={20}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400"
            />
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              {isSubmittingComment ? "등록 중..." : "댓글 등록"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
