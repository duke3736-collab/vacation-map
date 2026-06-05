"use client";

import React, { useState, useEffect } from "react";

interface GuestbookMessage {
  id: string;
  nickname: string;
  content: string;
  color: string;
  likes: number;
  createdAt: string;
  passwordHash: string; // 로컬 간단 검증용 비밀번호 (단순 텍스트 매칭)
}

export interface WordPressPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  link: string;
}

// 사용자의 워드프레스 블로그 주소 기본값 (weknews.com)
const WORDPRESS_BASE_URL = "https://weknews.com";

// 워드프레스 API 지연 또는 오류 시 노출할 기본 정보성 칼럼 데이터셋
const FALLBACK_POSTS: WordPressPost[] = [
  {
    id: 9001,
    title: "2026년 정부지원금 및 서민 생활 지원 혜택 총정리",
    excerpt: "내 소득 수준과 나이에 맞는 정부지원금은? 청년, 다자녀, 소상공인별 맞춤형 지원 정책과 실시간 신청 가이드를 소개합니다.",
    category: "정부 지원금",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "https://images.unsplash.com/photo-1579621970795-87faff2f9050?w=500&auto=format&fit=crop&q=60",
    link: `${WORDPRESS_BASE_URL}`
  },
  {
    id: 9002,
    title: "여름 휴가철 고속도로 통행료 면제 & 관광 혜택 가이드",
    excerpt: "정부에서 지원하는 국내 관광 활성화 프로젝트! 숙박 쿠폰 할인 혜택, 고속도로 통행료 감면 기간 및 대중교통 할인 정보를 알려드립니다.",
    category: "생활 꿀팁",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&auto=format&fit=crop&q=60",
    link: `${WORDPRESS_BASE_URL}`
  },
  {
    id: 9003,
    title: "숨은 내 돈 찾기! 카드포인트 통합조회 및 계좌 환급 방법",
    excerpt: "흩어져서 안 쓰고 소멸되기 직전인 내 신용카드 포인트들을 한 번에 조회하고 계좌로 즉시 현금 환급받는 초간단 프로세스 정리.",
    category: "혜택 정보",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60",
    link: `${WORDPRESS_BASE_URL}`
  }
];

// 칠판/코르크보드에 붙일 은은한 포스트잇 파스텔 색상 목록
const POSTIT_COLORS = [
  { name: "파스텔 노랑", bg: "bg-amber-100 border-amber-200 text-amber-900", dot: "bg-amber-400" },
  { name: "파스텔 핑크", bg: "bg-rose-100 border-rose-200 text-rose-900", dot: "bg-rose-400" },
  { name: "파스텔 민트", bg: "bg-emerald-100 border-emerald-200 text-emerald-900", dot: "bg-emerald-400" },
  { name: "파스텔 하늘", bg: "bg-sky-100 border-sky-200 text-sky-900", dot: "bg-sky-400" },
  { name: "파스텔 보라", bg: "bg-purple-100 border-purple-200 text-purple-900", dot: "bg-purple-400" }
];

// 초기 예시 포스트잇 데이터
const INITIAL_MESSAGES: GuestbookMessage[] = [
  {
    id: "ex-1",
    nickname: "민우맘",
    content: "이번 주말에 평창 아기동물농장 다녀왔는데 알파카 먹이주기 체험 진짜 좋아하네요! 주차장 넓어서 편해요~ 🦙",
    color: "bg-amber-100 border-amber-200 text-amber-900",
    likes: 12,
    createdAt: "2026-06-05 14:20",
    passwordHash: "1234"
  },
  {
    id: "ex-2",
    nickname: "여행조아",
    content: "서대문자연사박물관 도슨트 프로그램은 일주일 전에 미리 예약 필수입니다! 당일 현장 접수는 금방 매진돼요 🏛️",
    color: "bg-sky-100 border-sky-200 text-sky-900",
    likes: 8,
    createdAt: "2026-06-05 16:45",
    passwordHash: "1234"
  },
  {
    id: "ex-3",
    nickname: "준서아빠",
    content: "가평 키즈풀빌라 다녀왔는데 가평은 진짜 풀빌라 성지네요. 독서실 책상 추천 기획전도 엄청 유용하게 봤습니다. 👍",
    color: "bg-emerald-100 border-emerald-200 text-emerald-900",
    likes: 15,
    createdAt: "2026-06-06 01:10",
    passwordHash: "1234"
  }
];

export default function TalkPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [selectedColor, setSelectedColor] = useState(POSTIT_COLORS[0].bg);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isClient, setIsClient] = useState(false);

  // 워드프레스 연동용 상태
  const [wpPosts, setWpPosts] = useState<WordPressPost[]>([]);
  const [isLoadingWp, setIsLoadingWp] = useState(true);

  // 컴포넌트 마운트 시 LocalStorage에서 메시지 로드 및 워드프레스 API 연동
  useEffect(() => {
    setIsClient(true);

    const fetchWpPosts = async () => {
      try {
        const res = await fetch("/api/wordpress");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setWpPosts(data);
          } else {
            setWpPosts(FALLBACK_POSTS);
          }
        } else {
          setWpPosts(FALLBACK_POSTS);
        }
      } catch (err) {
        console.error("Failed to fetch wp posts", err);
        setWpPosts(FALLBACK_POSTS);
      } finally {
        setIsLoadingWp(false);
      }
    };

    fetchWpPosts();
    const saved = localStorage.getItem("vacation_map_guestbook");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(INITIAL_MESSAGES);
      }
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem("vacation_map_guestbook", JSON.stringify(INITIAL_MESSAGES));
    }
  }, []);

  // 메시지 로컬 저장
  const saveToLocal = (newMsgs: GuestbookMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem("vacation_map_guestbook", JSON.stringify(newMsgs));
  };

  // 포스트잇 등록
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim() || !password.trim()) {
      alert("닉네임, 메시지, 비밀번호를 모두 입력해 주세요!");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newMsg: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      nickname: nickname.trim().slice(0, 10),
      content: content.trim().slice(0, 150),
      color: selectedColor,
      likes: 0,
      createdAt: formattedDate,
      passwordHash: password // 간단 비교를 위해 평문 저장
    };

    const updated = [newMsg, ...messages];
    saveToLocal(updated);
    
    // 입력 폼 초기화
    setContent("");
    setNickname("");
    setPassword("");
  };

  // 공감/좋아요 누르기
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = messages.map(msg => 
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    );
    saveToLocal(updated);
  };

  // 삭제 요청 모달 띄우기
  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
    setDeletePassword("");
  };

  // 실제 삭제 수행
  const handleDelete = () => {
    const target = messages.find(msg => msg.id === deleteId);
    if (!target) return;

    if (target.passwordHash !== deletePassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    const filtered = messages.filter(msg => msg.id !== deleteId);
    saveToLocal(filtered);
    setDeleteId(null);
    setDeletePassword("");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 pt-28 flex items-center justify-center text-white">
        <span className="animate-spin text-3xl">🔄</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#768e7d] bg-[radial-gradient(#8fae98_1px,transparent_1px)] [background-size:24px_24px] pt-28 pb-24 px-6 md:px-10 text-white font-sans relative">
      
      {/* 칠판 테두리 스타일링 */}
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* 상단 타이틀 */}
        <div className="text-center flex flex-col items-center gap-3">
          <span className="inline-block bg-[#e2f0d9]/10 border border-[#e2f0d9]/25 text-[#c5dfb8] text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase mb-1 shadow-sm">
            Community Board
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#c5dfb8] tracking-tight drop-shadow-md leading-tight mt-1">
            방학 톡톡 💬
          </h1>
          <p className="text-slate-200 text-sm md:text-base max-w-xl mx-auto break-keep mt-2 opacity-90">
            학부모들의 생생한 체험학습 후기, 꿀팁, 고민거리를 포스트잇으로 붙여보세요! 로그인 없이 익명으로 소통하는 따뜻한 칠판입니다. 📌
          </p>
        </div>

        {/* 메인 콘텐츠: 포스트잇 붙이기 입력 폼 + 게시판 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 포스트잇 작성 영역 (좌측 1칸) */}
          <div className="lg:col-span-1 bg-[#1e2721]/95 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl h-fit space-y-6">
            <h3 className="text-lg font-black text-[#c5dfb8] border-b border-white/10 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">edit_note</span>
              <span>포스트잇 작성 📌</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
              {/* 닉네임 */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-300 tracking-wider">닉네임</label>
                <input
                  type="text"
                  placeholder="최대 10자"
                  maxLength={10}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-white/90 border-0 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
                />
              </div>

              {/* 비밀번호 (본인 확인용) */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-300 tracking-wider">비밀번호 (4자리)</label>
                <input
                  type="password"
                  placeholder="본인삭제 확인용"
                  maxLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/90 border-0 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400"
                />
              </div>

              {/* 포스트잇 내용 */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-black text-slate-300 tracking-wider">메시지 내용</label>
                <textarea
                  placeholder="아이와 가볼 만한 곳, 팁 등을 자유롭게 적어주세요 (최대 150자)"
                  maxLength={150}
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/90 border-0 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* 색상 선택 */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black text-slate-300 tracking-wider block">포스트잇 색상</label>
                <div className="flex gap-2">
                  {POSTIT_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col.bg)}
                      className={`w-7 h-7 rounded-full ${col.dot} border-2 ${selectedColor === col.bg ? "border-white scale-110 shadow-md" : "border-transparent opacity-60"} transition-all`}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm py-3 px-4 rounded-xl shadow-md hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer mt-4"
              >
                <span>칠판에 붙이기 📌</span>
              </button>
            </form>
          </div>

          {/* 포스트잇 나열 보드 영역 (우측 3칸) */}
          <div className="lg:col-span-3 bg-[#243128] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
            
            {/* 나무 칠판 느낌의 디테일 데코 */}
            <div className="absolute inset-x-0 -top-2 h-2.5 bg-[#8b5a2b] rounded-t-full shadow-inner" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[720px] overflow-y-auto custom-scrollbar p-1">
              {messages.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-3 text-slate-400">
                  <span className="material-symbols-outlined text-[64px]">sticky_note_2</span>
                  <p className="font-bold">칠판에 붙은 포스트잇이 없습니다.</p>
                  <p className="text-xs">첫 번째 소식을 남겨 보세요!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group flex flex-col justify-between p-5 rounded-2xl shadow-md border hover:shadow-xl hover:-rotate-1 hover:-translate-y-1 transition-all duration-300 aspect-square ${msg.color}`}
                  >
                    {/* 상단 핀 데코 및 본문 */}
                    <div className="space-y-3 relative">
                      {/* 포스트잇 핀(동그라미 압정) 효과 */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-rose-500 border border-rose-600 shadow-md flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                      </div>
                      
                      {/* 작성자 & 작성일 */}
                      <div className="flex items-center justify-between pt-1 text-[11px] font-black opacity-60">
                        <span>{msg.nickname}</span>
                        <span>{msg.createdAt.split(" ")[0]}</span>
                      </div>

                      {/* 내용 */}
                      <p className="text-xs sm:text-sm font-bold leading-relaxed break-all whitespace-pre-wrap line-clamp-6">
                        {msg.content}
                      </p>
                    </div>

                    {/* 하단 인터랙션 영역 */}
                    <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-2">
                      {/* 공감/좋아요 */}
                      <button
                        onClick={(e) => handleLike(msg.id, e)}
                        className="flex items-center gap-1.5 text-xs font-black text-rose-600 bg-rose-500/10 px-2.5 py-1.5 rounded-full hover:bg-rose-500/20 active:scale-90 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          favorite
                        </span>
                        <span>{msg.likes}</span>
                      </button>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) => requestDelete(msg.id, e)}
                        className="text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center p-1 cursor-pointer"
                        title="포스트잇 삭제"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* 워드프레스 최신 소식 섹션 */}
        <div className="border-t border-white/10 pt-10 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2 text-left">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#c5dfb8] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                <span>오늘의 핫한 생활 꿀팁 & 혜택 정보 💡</span>
              </h3>
              <p className="text-slate-200 text-xs md:text-sm mt-1 opacity-90">
                워드프레스 블로그 최신 글을 실시간으로 연동하여 노출합니다. 혜택을 놓치지 말고 확인해 보세요!
              </p>
            </div>
            <a
              href="https://weknews.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#c5dfb8] hover:text-white bg-white/10 px-4 py-2 rounded-full border border-white/15 hover:bg-white/20 transition-all shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>블로그 전체보기</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          {isLoadingWp ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#1e2721]/50 border border-white/5 rounded-3xl p-5 space-y-4">
                  <div className="aspect-[16/10] w-full bg-white/10 rounded-2xl" />
                  <div className="h-4 bg-white/20 rounded w-1/3" />
                  <div className="h-5 bg-white/20 rounded w-5/6" />
                  <div className="h-12 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wpPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-[#1e2721]/95 border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* 이미지 영역 */}
                  <div className="relative aspect-[16/10] w-full bg-slate-800 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                      {post.category}
                    </span>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex-1 p-5 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold">{post.date}</span>
                      <h4 className="text-sm md:text-base font-black text-[#c5dfb8] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 opacity-90">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors pt-3 border-t border-white/10">
                      <span>자세히 읽어보기</span>
                      <span className="material-symbols-outlined text-[14px] ml-1 transition-transform group-hover:translate-x-1">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 포스트잇 삭제 모달 팝업 */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-slate-800 rounded-3xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h4 className="text-base font-black text-slate-800 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-rose-500">lock</span>
              <span>포스트잇 삭제</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              작성 시 설정했던 4자리 비밀번호를 입력해 주세요.
            </p>
            <input
              type="password"
              placeholder="비밀번호 4자리"
              maxLength={4}
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                삭제하기 🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
