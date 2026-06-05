"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PlanItem {
  id: string;
  title: string;
  startHour: number;
  endHour: number;
  color: string; // Tailwind 클래스명 대신 순수 hex 또는 rgb 색상
}

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  memo?: string;
}

// 부채꼴 색상 팔레트 (파스텔톤)
const PLANNER_COLORS = [
  "#ffccd5", // 솜사탕 핑크
  "#ffeb3b", // 레몬 옐로우
  "#c8e6c9", // 연한 민트
  "#bbdefb", // 베이비 블루
  "#e1bee7", // 라벤더 퍼플
  "#ffe0b2", // 살구 오렌지
  "#d7ccc8", // 코코아 브라운
  "#cfd8dc"  // 소프트 그레이
];

// 초기 기본 일과표 예시
const INITIAL_PLAN_ITEMS: PlanItem[] = [
  { id: "p1", title: "단잠 및 기상 😴", startHour: 0, endHour: 7.5, color: "#cfd8dc" },
  { id: "p2", title: "방학 숙제 ✍️", startHour: 9, endHour: 11, color: "#ffeb3b" },
  { id: "p3", title: "맛있는 점심 😋", startHour: 12, endHour: 13, color: "#ffe0b2" },
  { id: "p4", title: "방학 맵 나들이 🚀", startHour: 13.5, endHour: 18, color: "#bbdefb" },
  { id: "p5", title: "독서 및 휴식 📚", startHour: 19, endHour: 21, color: "#e1bee7" },
  { id: "p6", title: "꿈나라로 여행 🌟", startHour: 22, endHour: 24, color: "#ffccd5" }
];

// 초기 예시 달력 일정
const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "e1", date: "2026-07-15", title: "서대문자연사박물관 체험 학습", memo: "도슨트 가이드 10:30분 무료 예약 완료!" },
  { id: "e2", date: "2026-07-22", title: "가평 키즈풀빌라 가족 여행", memo: "준비물: 아동 구명조끼, 아동 선크림 꼭 챙기기!" },
  { id: "e3", date: "2026-07-29", title: "국립과천과학관 미래 캠프", memo: "인강용 태블릿 챙겨가서 필기하기" }
];

export default function PlannerPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 계획 추가 입력 폼 상태
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState<number>(9);
  const [newEnd, setNewEnd] = useState<number>(12);
  const [newColor, setNewColor] = useState(PLANNER_COLORS[0]);

  // 달력 일정 추가 입력 폼 상태
  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventMemo, setEventMemo] = useState("");

  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // LocalStorage에서 일과표 불러오기
    const savedPlans = localStorage.getItem("vacation_map_plans");
    if (savedPlans) {
      try { setPlans(JSON.parse(savedPlans)); } catch { setPlans(INITIAL_PLAN_ITEMS); }
    } else {
      setPlans(INITIAL_PLAN_ITEMS);
      localStorage.setItem("vacation_map_plans", JSON.stringify(INITIAL_PLAN_ITEMS));
    }

    // LocalStorage에서 달력 일정 불러오기
    const savedEvents = localStorage.getItem("vacation_map_events");
    if (savedEvents) {
      try { setEvents(JSON.parse(savedEvents)); } catch { setEvents(INITIAL_EVENTS); }
    } else {
      setEvents(INITIAL_EVENTS);
      localStorage.setItem("vacation_map_events", JSON.stringify(INITIAL_EVENTS));
    }
  }, []);

  const savePlans = (newPlans: PlanItem[]) => {
    setPlans(newPlans);
    localStorage.setItem("vacation_map_plans", JSON.stringify(newPlans));
  };

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem("vacation_map_events", JSON.stringify(newEvents));
  };

  // SVG 부채꼴 패스(d) 생성을 위한 수학 헬퍼 함수
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  };

  // 생활일과표 등록
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("일정 이름을 입력해 주세요!");
      return;
    }
    if (newStart >= newEnd) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다!");
      return;
    }

    // 중복 시간대 체크 (간단하게 메시지만 경고)
    const hasOverlap = plans.some(
      p => (newStart < p.endHour && newEnd > p.startHour)
    );
    if (hasOverlap) {
      if (!confirm("설정한 시간대에 이미 등록된 다른 일정이 있습니다. 그래도 등록하시겠습니까?")) {
        return;
      }
    }

    const newItem: PlanItem = {
      id: `plan-${Date.now()}`,
      title: newTitle.trim(),
      startHour: newStart,
      endHour: newEnd,
      color: newColor
    };

    const updated = [...plans, newItem].sort((a, b) => a.startHour - b.startHour);
    savePlans(updated);
    setNewTitle("");
  };

  // 일과 삭제
  const handleDeletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    savePlans(updated);
  };

  // 달력 일정 등록
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate || !eventTitle.trim()) {
      alert("날짜와 나들이 장소/일정명을 정확히 적어 주세요!");
      return;
    }

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      date: eventDate,
      title: eventTitle.trim(),
      memo: eventMemo.trim()
    };

    const updated = [...events, newEv].sort((a, b) => a.date.localeCompare(b.date));
    saveEvents(updated);
    setEventDate("");
    setEventTitle("");
    setEventMemo("");
  };

  // 달력 일정 삭제
  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  // 브라우저 기본 인쇄창 호출 (CSS 미디어가 계획서만 인쇄되게 유도)
  const handlePrint = () => {
    window.print();
  };

  // html2canvas 기반 이미지로 다운로드하기 (클라이언트에서 동적 로드)
  const handleDownloadImage = async () => {
    if (!printAreaRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(printAreaRef.current, {
        useCORS: true,
        scale: 2, // 고해상도 캡처
        backgroundColor: "#ffffff"
      });
      const link = document.createElement("a");
      link.download = `방학계획서_${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장 중 오류가 발생했습니다. 브라우저 인쇄(PDF 저장)를 이용해 주세요!");
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center text-slate-800">
        <span className="animate-spin text-3xl">🔄</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-slate-900 pt-32 md:pt-36 pb-24 px-6 md:px-10 font-sans relative">
      
      {/* 인쇄 최적화 스타일 주입 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* 인쇄 시 흰색 배경 강제 및 테두리/그림자 리셋 */
          .print-area-bg {
            background-color: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .print-card-bg {
            background-color: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
          }
          .print-circle-bg {
            fill: #ffffff !important;
          }
          /* 인쇄 화면에서 동그라미 계획표의 크기를 크게 고정합니다 */
          .print-svg-container {
            width: 520px !important;
            height: 520px !important;
            margin: 0 auto 20px auto !important;
          }
          /* 인쇄 시 가로 배치 대신 한 열로 나열하여 크기를 확대시킵니다 */
          .print-layout-flex {
            flex-direction: column !important;
            align-items: center !important;
            gap: 30px !important;
          }
          .print-layout-flex > div {
            width: 100% !important;
            max-width: 500px !important;
            margin: 0 auto !important;
          }
        }
      `}} />
      
      {/* 본문 레이아웃 */}
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* 설명 및 타이틀 (프린트 시 숨겨짐, 겹침 방지 정렬) */}
        <div className="text-center flex flex-col items-center gap-4 print:hidden">
          <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase shadow-sm">
            Study & Travel Planner
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm leading-snug mt-2">
            알찬 방학 계획서 📅
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto break-keep mt-3 opacity-90">
            아이와 함께 동그라미 하루 계획표를 이쁘게 채워보세요! 주간/달력 스케줄러에 방학 나들이 일정까지 정리한 뒤 종이로 프린트하거나 이미지 파일로 저장할 수 있습니다. 🖨️
          </p>

          {/* 인쇄 및 이미지 다운로드 제어기 */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-slate-800 text-white font-black text-xs py-3.5 px-6 rounded-2xl shadow-md hover:bg-slate-900 transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>A4 종이로 즉시 프린트 🖨️</span>
            </button>
            <button
              onClick={handleDownloadImage}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs py-3.5 px-6 rounded-2xl shadow-md hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>이미지(PNG)로 파일 저장 💾</span>
            </button>
          </div>
        </div>

        {/* 메인 에디터 및 렌더링 보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 일과 추가 및 목록 관리창 (좌측 1칸) - 프린트할 때는 숨김 */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            
            {/* 1. 일과표 편집 (눈부심 방지를 위해 톤다운) */}
            <div className="bg-[#e9ecf0] rounded-3xl p-6 border border-slate-250/80 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-850 border-b border-slate-200/60 pb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-indigo-600">schedule</span>
                <span>하루 일과 등록 ⏱️</span>
              </h3>
              
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">일정 이름</label>
                  <input
                    type="text"
                    placeholder="예: 늦잠자기 😴, 독서 📚"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">시작 시간</label>
                    <select
                      value={newStart}
                      onChange={(e) => setNewStart(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {Array.from({ length: 49 }, (_, i) => i * 0.5).map(h => (
                        <option key={h} value={h}>
                          {Math.floor(h)}시{h % 1 === 0.5 ? "30분" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">종료 시간</label>
                    <select
                      value={newEnd}
                      onChange={(e) => setNewEnd(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {Array.from({ length: 49 }, (_, i) => i * 0.5).map(h => (
                        <option key={h} value={h}>
                          {Math.floor(h)}시{h % 1 === 0.5 ? "30분" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 파스텔 색상 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">색상 칠하기</label>
                  <div className="flex flex-wrap gap-2">
                    {PLANNER_COLORS.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${newColor === color ? "border-slate-800 scale-110 shadow-sm" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  생활표에 일정 추가 📌
                </button>
              </form>
            </div>

            {/* 2. 달력 나들이 일정 편집 (눈부심 방지를 위해 톤다운) */}
            <div className="bg-[#e9ecf0] rounded-3xl p-6 border border-slate-250/80 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-855 border-b border-slate-200/60 pb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-indigo-600">calendar_month</span>
                <span>방학 나들이 스케줄 등록 🗺️</span>
              </h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">나들이 날짜</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">여행 장소 / 활동명</label>
                  <input
                    type="text"
                    placeholder="예: 가평 키즈풀빌라 여행 🏊"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">간단 꿀팁 / 준비물</label>
                  <input
                    type="text"
                    placeholder="예: 물놀이 구명조끼 필수!"
                    value={eventMemo}
                    onChange={(e) => setEventMemo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  캘린더에 일정 추가 📌
                </button>
              </form>
            </div>

          </div>

          {/* 실제 일과표 출력 보드 영역 (우측 2칸) - 인쇄 영역 */}
          <div className="lg:col-span-2 space-y-8 print:col-span-full">
            
            {/* 캡처/인쇄 대상 래퍼 (눈부심 방지 톤다운, 인쇄 시에는 흰색 강제) */}
            <div 
              ref={printAreaRef} 
              className="bg-[#e9ecf0] border border-slate-250/80 rounded-3xl p-8 md:p-10 shadow-sm print-area-bg space-y-12"
            >
              
              {/* 인쇄 모드 헤더 (일반 화면에선 숨김) */}
              <div className="hidden print:flex flex-col items-center text-center gap-1.5 border-b border-slate-200 pb-5">
                <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">My Vacation Plan Book</span>
                <h2 className="text-3xl font-black text-slate-800">우리아이 알찬 방학 계획서 📅</h2>
                <p className="text-xs text-slate-400">지도로 찾는 방학 놀이터, 방학 맵 (vacation.weknews.com)</p>
              </div>

              {/* 1. 24시간 원형 일과표 */}
              <div className="flex flex-col md:flex-row items-center gap-8 justify-center print-layout-flex">
                
                {/* SVG 24시간 원형 계획표 (웹 창 및 인쇄에서 크게 확대) */}
                <div className="relative w-full aspect-square max-w-[380px] sm:max-w-[420px] md:max-w-[460px] flex-shrink-0 mx-auto print-svg-container">
                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                  >
                    {/* 기본 24시간 시간 눈금과 부채꼴들 */}
                    <circle cx="100" cy="100" r="90" fill="#fafbfc" stroke="#cbd5e1" strokeWidth="2" className="print-circle-bg" />
                    
                    {/* 시간 조각들 렌더링 */}
                    {plans.map((item) => {
                      const startAngle = (item.startHour / 24) * 360;
                      const endAngle = (item.endHour / 24) * 360;
                      return (
                        <g key={item.id} className="group/slice">
                          <path
                            d={describeArc(100, 100, 90, startAngle, endAngle)}
                            fill={item.color}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="transition-colors hover:brightness-95"
                          />
                          {/* 조각 내에 들어갈 텍스트 배치 (중앙 부분 각도 삼각함수로 배치) */}
                          {(() => {
                            const middleAngle = (startAngle + endAngle) / 2;
                            const coords = polarToCartesian(100, 100, 52, middleAngle);
                            return (
                              <text
                                x={coords.x}
                                y={coords.y}
                                fill="#2d3748"
                                fontSize="6.5"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="pointer-events-none drop-shadow-sm"
                              >
                                {item.title.length > 8 ? `${item.title.slice(0, 8)}..` : item.title}
                              </text>
                            );
                          })()}
                        </g>
                      );
                    })}

                    {/* 정중앙 도넛 흰색 구멍 */}
                    <circle cx="100" cy="100" r="22" fill="#fafbfc" stroke="#cbd5e1" strokeWidth="1" className="print-circle-bg" />
                    <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fontWeight="black" fill="#4a5568">
                      하루 일과
                    </text>

                    {/* 시간 가이드라인 원 */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

                    {/* 24시간 시계 눈금 숫자 렌더링 (2시간 간격) */}
                    {Array.from({ length: 12 }, (_, i) => i * 2).map(hour => {
                      const angle = (hour / 24) * 360;
                      const coords = polarToCartesian(100, 100, 94, angle);
                      return (
                        <text
                          key={hour}
                          x={coords.x}
                          y={coords.y}
                          fill="#718096"
                          fontSize="5.5"
                          fontWeight="black"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {hour}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* 등록된 시간표 일과 목록 리스트 */}
                <div className="flex-1 w-full space-y-3">
                  <h4 className="text-sm font-black text-slate-700 flex items-center gap-1 pb-2 border-b border-slate-100">
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                    <span>시간표 상세 일과표</span>
                  </h4>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                    {plans.length === 0 ? (
                      <p className="text-xs text-slate-400">등록된 일과가 없습니다. 왼쪽 폼에서 일과를 등록하세요!</p>
                    ) : (
                      plans.map(p => (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between bg-[#edf1f5] p-2.5 rounded-xl border border-slate-200 group print-card-bg"
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                              style={{ backgroundColor: p.color }}
                            />
                            <div className="text-left">
                              <span className="text-xs font-black text-slate-800">{p.title}</span>
                              <span className="text-[10px] text-slate-500 font-semibold block">
                                {Math.floor(p.startHour)}시{p.startHour % 1 === 0.5 ? "30분" : ""} ~ {Math.floor(p.endHour)}시{p.endHour % 1 === 0.5 ? "30분" : ""}
                              </span>
                            </div>
                          </div>
                          
                          {/* 삭제 버튼 (인쇄 시 숨김) */}
                          <button
                            onClick={() => handleDeletePlan(p.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 flex items-center justify-center shrink-0 print:hidden cursor-pointer"
                            title="삭제"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* 2. 달력 스케줄러 영역 */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <span className="material-symbols-outlined text-indigo-500">campaign</span>
                  <span>여름방학 특별 나들이 스케줄표 🗺️</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-slate-400">
                      등록된 나들이 일정이 없습니다.
                    </div>
                  ) : (
                    events.map(ev => (
                      <div 
                        key={ev.id}
                        className="bg-[#edf1f5] border border-slate-200 p-4 rounded-2xl flex justify-between items-start gap-3 text-left relative group/ev print-card-bg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                              {ev.date}
                            </span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-black text-slate-800 break-keep leading-snug">
                            {ev.title}
                          </h5>
                          {ev.memo && (
                            <p className="text-[11px] text-slate-500 leading-relaxed break-keep font-medium">
                              💡 {ev.memo}
                            </p>
                          )}
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 flex items-center justify-center shrink-0 print:hidden cursor-pointer"
                          title="스케줄 삭제"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
