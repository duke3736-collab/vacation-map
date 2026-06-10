"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import html2canvas from "html2canvas";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function ReportPage() {
  const router = useRouter();
  const { selectedPlaceForReport, draftReports, setDraftReport } = useMapStore();
  const placeId = selectedPlaceForReport?.id || 'unknown';

  const [date, setDate] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [activities, setActivities] = useState("");
  const [feelings, setFeelings] = useState("");
  const [guardian, setGuardian] = useState("");

  const [photos, setPhotos] = useState<string[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isBgMoving, setIsBgMoving] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    // Load draft if exists
    if (draftReports[placeId]) {
      try {
        const draft = JSON.parse(draftReports[placeId]);
        if (draft.date) setDate(draft.date);
        else setDate(new Date().toISOString().split("T")[0]);
        
        if (draft.placeName) setPlaceName(draft.placeName);
        else setPlaceName(selectedPlaceForReport?.name || "");
        
        if (draft.purpose) setPurpose(draft.purpose);
        if (draft.activities) setActivities(draft.activities);
        if (draft.feelings) setFeelings(draft.feelings);
        if (draft.guardian) setGuardian(draft.guardian);
      } catch (e) {
        // parse error
        setDate(new Date().toISOString().split("T")[0]);
        setPlaceName(selectedPlaceForReport?.name || "");
      }
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setPlaceName(selectedPlaceForReport?.name || "");
    }
  }, [placeId, selectedPlaceForReport, draftReports]);

  // Handle auto-save
  const handleSave = (field: string, value: string) => {
    const currentState = {
      date: field === 'date' ? value : date,
      placeName: field === 'placeName' ? value : placeName,
      purpose: field === 'purpose' ? value : purpose,
      activities: field === 'activities' ? value : activities,
      feelings: field === 'feelings' ? value : feelings,
      guardian: field === 'guardian' ? value : guardian,
    };
    setDraftReport(placeId, JSON.stringify(currentState));
    setSaveStatus("✅ 방금 전 자동 저장됨");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 4)); // Max 4 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      
      // html2canvas가 input/textarea의 현재 값을 잘 캡처하도록 DOM 업데이트 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `체험학습보고서_${date}.png`;
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24 print:bg-white print:py-0 overflow-hidden">
      
      {/* Background Stickers (Hidden on Print) */}
      <div 
        className={`absolute inset-0 z-0 opacity-15 pointer-events-none print:hidden scale-150 ${isBgMoving ? 'animate-[spin_600s_linear_infinite]' : ''}`}
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 print:px-0">
        
        {/* Top Navigation (Hidden on Print) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 print:hidden">
          <button 
            onClick={() => router.push('/report')}
            className="group flex items-center gap-2 bg-white text-slate-600 px-5 py-3 rounded-full font-black shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-2 border-transparent hover:border-slate-200 hover:-translate-x-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            문서 선택으로
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="group flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-6 py-3 rounded-full font-black shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.5)] hover:-translate-y-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">{isExporting ? 'hourglass_empty' : 'save_alt'}</span>
              <span className="tracking-wide">보고서 저장 📸</span>
            </button>
            <button 
              onClick={handlePrint}
              disabled={isExporting}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-black shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.5)] hover:-translate-y-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">print</span>
              <span className="tracking-wide">보고서 인쇄 🖨️</span>
            </button>
          </div>
        </div>
        
        {saveStatus && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-emerald-600 font-bold px-4 py-2 rounded-full shadow-md text-sm z-50 animate-in fade-in slide-in-from-top-4 transition-all print:hidden">
            {saveStatus}
          </div>
        )}

        {/* Report Paper */}
        <div 
          ref={reportRef}
          className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] print:shadow-none print:p-8 border-4 border-dashed border-sky-300 print:border-sky-300 print:rounded-3xl mx-auto max-w-3xl min-h-[1056px] relative print:[color-adjust:exact] print:[-webkit-print-color-adjust:exact] mb-20"
        >
          
          <div className="text-center mb-10 pb-6 relative">
            <div className="absolute top-0 left-0 text-5xl opacity-20">🚀</div>
            <div className="absolute top-0 right-0 text-5xl opacity-20">✨</div>
            <h1 className="text-4xl font-black text-sky-600 tracking-tight drop-shadow-sm">신나는 체험학습 결과 보고서</h1>
            <div className="h-2 w-32 bg-yellow-300 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-10 text-lg bg-sky-50 print:bg-sky-50 rounded-2xl p-6 border-2 border-sky-100">
            <div className="flex items-center gap-4">
              <label className="font-bold text-sky-800 whitespace-nowrap min-w-[60px] flex items-center gap-1"><span className="material-symbols-outlined text-sm">school</span>학 교</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-sky-200 outline-none focus:border-sky-500 py-1 text-slate-900 font-bold" placeholder="예) 서울초등학교" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-bold text-sky-800 whitespace-nowrap min-w-[60px] flex items-center gap-1"><span className="material-symbols-outlined text-sm">face</span>이 름</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-sky-200 outline-none focus:border-sky-500 py-1 text-slate-900 font-bold" placeholder="홍길동" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-bold text-sky-800 whitespace-nowrap min-w-[60px] flex items-center gap-1"><span className="material-symbols-outlined text-sm">groups</span>학 년</label>
              <input type="text" className="w-full bg-transparent border-b-2 border-sky-200 outline-none focus:border-sky-500 py-1 text-slate-900 font-bold" placeholder="3학년 2반" />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-bold text-sky-800 whitespace-nowrap min-w-[60px] flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span>방문일</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => { setDate(e.target.value); handleSave('date', e.target.value); }} 
                className="w-full bg-transparent border-b-2 border-sky-200 outline-none focus:border-sky-500 py-1 text-slate-900 font-bold" 
              />
            </div>
          </div>

          {/* Experience Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 print:bg-amber-50 rounded-2xl p-4 border-2 border-amber-100">
                <label className="block text-xl font-black text-amber-800 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">location_on</span>
                  어디로 다녀왔나요?
                </label>
                <input 
                  type="text" 
                  value={placeName}
                  onChange={(e) => { setPlaceName(e.target.value); handleSave('placeName', e.target.value); }}
                  className="w-full bg-white border-2 border-amber-200 rounded-xl p-3 text-lg font-bold outline-none focus:ring-4 focus:ring-amber-200 text-slate-800" 
                  placeholder="방문 장소 입력" 
                />
              </div>

              <div className="bg-green-50 print:bg-green-50 rounded-2xl p-4 border-2 border-green-100">
                <label className="block text-xl font-black text-green-800 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500">flag</span>
                  무엇을 알아보고 싶었나요?
                </label>
                <input 
                  type="text" 
                  value={purpose}
                  onChange={(e) => { setPurpose(e.target.value); handleSave('purpose', e.target.value); }}
                  className="w-full bg-white border-2 border-green-200 rounded-xl p-3 text-lg font-bold outline-none focus:ring-4 focus:ring-green-200 text-slate-800" 
                  placeholder="체험 주제 및 목적" 
                />
              </div>
            </div>

            {/* Photo Attachment */}
            <div className="bg-purple-50 print:bg-purple-50 rounded-2xl p-6 border-2 border-purple-100">
              <label className="block text-xl font-black text-purple-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">photo_camera</span>
                사진 찰칵! (최대 4장)
              </label>
              
              <div className={`grid gap-3 ${photos.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                {photos.map((photoUrl, idx) => (
                  <div key={idx} className="relative border-4 border-white shadow-sm rounded-xl overflow-hidden h-32 bg-white flex items-center justify-center group transform rotate-1 hover:rotate-0 transition-transform">
                    <img src={photoUrl} alt={`체험 사진 ${idx+1}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removePhoto(idx)} 
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 print:hidden"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                {photos.length < 4 && (
                  <div className="relative border-4 border-dashed border-purple-200 rounded-xl bg-white hover:bg-purple-50 transition-colors flex flex-col items-center justify-center p-4 cursor-pointer print:hidden h-32">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <span className="material-symbols-outlined text-3xl text-purple-300 mb-1">add_photo_alternate</span>
                    <span className="text-purple-600 font-bold text-sm">사진 추가</span>
                  </div>
                )}
              </div>

              {/* Fallback box for print if no photo */}
              <div className="hidden print:block border-4 border-dashed border-purple-200 bg-white rounded-xl w-full h-32 text-center text-purple-300 mt-2 flex items-center justify-center">
                {photos.length === 0 && <div className="font-bold text-lg">사진 붙이는 곳 📸 (빈 공간)</div>}
              </div>
            </div>

            <div className="bg-orange-50 print:bg-orange-50 rounded-2xl p-6 border-2 border-orange-100">
              <label className="block text-xl font-black text-orange-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">edit_note</span>
                어떤 재미있는 일이 있었나요?
              </label>
              <textarea 
                value={activities}
                onChange={(e) => { setActivities(e.target.value); handleSave('activities', e.target.value); }}
                className="w-full bg-white border-2 border-orange-200 rounded-xl p-4 text-lg font-bold outline-none focus:ring-4 focus:ring-orange-200 resize-none min-h-[250px] overflow-hidden print:h-auto text-slate-800 leading-relaxed" 
                placeholder="시간대별로 어떤 활동을 했는지 구체적으로 적어보세요."
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              ></textarea>
            </div>

            <div className="bg-pink-50 print:bg-pink-50 rounded-2xl p-6 border-2 border-pink-100">
              <label className="block text-xl font-black text-pink-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500">emoji_objects</span>
                새롭게 알게 된 점과 느낀 점
              </label>
              <textarea 
                value={feelings}
                onChange={(e) => { setFeelings(e.target.value); handleSave('feelings', e.target.value); }}
                className="w-full bg-white border-2 border-pink-200 rounded-xl p-4 text-lg font-bold outline-none focus:ring-4 focus:ring-pink-200 resize-none min-h-[250px] overflow-hidden print:h-auto text-slate-800 leading-relaxed" 
                placeholder="가장 기억에 남는 것은 무엇인가요? 배운 점을 적어보세요."
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              ></textarea>
            </div>
            
            <div className="pt-8 flex justify-end items-end gap-4 print:border-slate-800 mt-10">
              <span className="text-xl font-black text-slate-700">보호자 확인 :</span>
              <input 
                type="text" 
                value={guardian}
                onChange={(e) => { setGuardian(e.target.value); handleSave('guardian', e.target.value); }}
                className="w-40 border-b-4 border-slate-300 text-center pb-1 text-slate-900 font-black text-2xl outline-none focus:border-blue-500 bg-transparent placeholder-slate-300"
                placeholder="이름 입력"
              />
              <span className="text-xl font-black text-slate-700">(인)</span>
            </div>

          </div>

        </div>

        <div className="print:hidden">
          <AdBanner slot="report-bottom" className="h-28 bg-white/50 backdrop-blur-sm" />
        </div>
      </div>

      {/* Background Animation Toggle Button */}
      <button
        onClick={() => setIsBgMoving(!isBgMoving)}
        className="fixed bottom-6 right-6 z-50 print:hidden bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 border border-slate-200 shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title={isBgMoving ? "배경 움직임 멈추기" : "배경 움직임 재생"}
      >
        <span className="material-symbols-outlined text-2xl group-hover:text-blue-500 transition-colors">
          {isBgMoving ? 'pause_circle' : 'play_circle'}
        </span>
      </button>

    </div>
  );
}
