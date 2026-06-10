"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import html2canvas from "html2canvas";

export default function ReportResultPage() {
  const router = useRouter();
  const { selectedPlaceForReport, draftReports, setDraftReport } = useMapStore();
  const placeId = selectedPlaceForReport?.id || 'unknown';

  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [guardian, setGuardian] = useState("");
  
  const [resultPurpose, setResultPurpose] = useState("");
  const [resultActivities, setResultActivities] = useState("");
  const [resultFeelings, setResultFeelings] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    if (draftReports[placeId]) {
      try {
        const draft = JSON.parse(draftReports[placeId]);
        setSchool(draft.school || "");
        setGrade(draft.grade || "");
        setName(draft.name || "");
        setDate(draft.date || new Date().toISOString().split("T")[0]);
        setPlaceName(draft.placeName || selectedPlaceForReport?.name || "");
        setGuardian(draft.guardian || "");
        
        setResultPurpose(draft.resultPurpose || "");
        setResultActivities(draft.resultActivities || "");
        setResultFeelings(draft.resultFeelings || "");
      } catch (e) {
        setDate(new Date().toISOString().split("T")[0]);
        setPlaceName(selectedPlaceForReport?.name || "");
      }
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setPlaceName(selectedPlaceForReport?.name || "");
      
      if (selectedPlaceForReport?.curriculumLinks && selectedPlaceForReport.curriculumLinks.length > 0) {
        const link = selectedPlaceForReport.curriculumLinks[0];
        const hintText = `${link.grade} ${link.subject} - ${link.unit} 단원 학습 연계`;
        setResultPurpose(hintText);
      }
    }
  }, [placeId, selectedPlaceForReport, draftReports]);

  const handleSave = () => {
    const currentState = {
      school, grade, name, date, placeName, guardian,
      resultPurpose, resultActivities, resultFeelings
    };
    let existingData = {};
    if (draftReports[placeId]) {
      try { existingData = JSON.parse(draftReports[placeId]); } catch(e) {}
    }
    setDraftReport(placeId, JSON.stringify({ ...existingData, ...currentState }));
    setSaveStatus("✅ 자동 저장됨");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 2));
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
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `현장체험학습_결과보고서_${date}.png`;
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  const curriculumHint = selectedPlaceForReport?.curriculumLinks?.[0]?.hint || "";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-100 pt-24 pb-12 print:bg-white print:py-0 overflow-x-hidden">
      {/* Background Stickers */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none print:hidden"
        style={{
          backgroundImage: "url('/images/bg_stickers.png')",
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-avoid-break { page-break-inside: avoid; }
        }
      `}} />

      <div className="max-w-[210mm] mx-auto relative z-10 print:w-[210mm] print:h-[297mm] print:m-0 print:p-0">
        
        {/* Top Navigation */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 print:hidden px-4 md:px-0">
          <button 
            onClick={() => router.push('/report')}
            className="flex items-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-bold shadow-sm border border-gray-200 hover:border-gray-400 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            문서 선택으로
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-sm hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">{isExporting ? 'hourglass_empty' : 'save_alt'}</span>
              이미지로 저장
            </button>
            <button 
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              인쇄하기
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-bold px-4 py-2 rounded-lg shadow-md text-sm z-50 transition-all print:hidden">
            {saveStatus}
          </div>
        )}

        {/* Report Paper A4 Size */}
        <div 
          ref={reportRef}
          className="bg-white print:m-0 shadow-lg print:shadow-none border border-gray-200 print:border-none mx-auto w-full md:w-[210mm] min-h-[297mm] p-8 md:p-12 relative box-border flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-gray-900 pb-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-widest">
              현장체험학습 결과보고서
            </h1>
          </div>

          {/* Student Info Table */}
          <table className="w-full border-collapse border-2 border-gray-900 mb-6 text-sm">
            <tbody>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-2 w-20 font-bold text-gray-900 text-center">학교명</th>
                <td className="border border-gray-900 px-3">
                  <input type="text" value={school} onChange={(e) => {setSchool(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="ㅇㅇ초등학교" />
                </td>
                <th className="border border-gray-900 bg-gray-100 py-2 w-20 font-bold text-gray-900 text-center">학년 / 반</th>
                <td className="border border-gray-900 px-3">
                  <input type="text" value={grade} onChange={(e) => {setGrade(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="3학년 1반" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-2 font-bold text-gray-900 text-center">이름</th>
                <td className="border border-gray-900 px-3">
                  <input type="text" value={name} onChange={(e) => {setName(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="홍길동" />
                </td>
                <th className="border border-gray-900 bg-gray-100 py-2 font-bold text-gray-900 text-center">보호자</th>
                <td className="border border-gray-900 px-3">
                  <div className="flex items-center gap-2">
                    <input type="text" value={guardian} onChange={(e) => {setGuardian(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="보호자 성명" />
                    <span className="shrink-0 text-xs text-gray-500">(인)</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Form Content */}
          <table className="w-full border-collapse border-2 border-gray-900 text-sm flex-1 print-avoid-break">
            <tbody>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 w-24 font-bold text-gray-900 text-center">체험학습<br/>장 소</th>
                <td className="border border-gray-900 px-3">
                  <input type="text" value={placeName} onChange={(e) => {setPlaceName(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-bold text-base" placeholder="방문 장소 입력" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">체험학습<br/>일 시</th>
                <td className="border border-gray-900 px-3">
                  <input type="date" value={date} onChange={(e) => {setDate(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">목 적</th>
                <td className="border border-gray-900 px-3 py-2">
                  <textarea 
                    value={resultPurpose} onChange={(e) => {setResultPurpose(e.target.value); handleSave()}} 
                    className="w-full bg-transparent outline-none font-medium resize-none h-16" 
                    placeholder="체험학습의 목적"
                  />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">활동 내용</th>
                <td className="border border-gray-900 px-3 py-2 align-top">
                  <textarea 
                    value={resultActivities} onChange={(e) => {setResultActivities(e.target.value); handleSave()}} 
                    className="w-full bg-transparent outline-none font-medium resize-none h-40" 
                    placeholder={curriculumHint || "시간대별로 어떤 활동을 했는지 적어주세요."}
                  />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">느낀 점</th>
                <td className="border border-gray-900 px-3 py-2 align-top">
                  <textarea 
                    value={resultFeelings} onChange={(e) => {setResultFeelings(e.target.value); handleSave()}} 
                    className="w-full bg-transparent outline-none font-medium resize-none h-40" 
                    placeholder="가장 기억에 남는 것과 배운 점을 적어주세요."
                  />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">
                  관련 사진<br/>및 자료
                </th>
                <td className="border border-gray-900 p-3 h-48 align-top">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative w-full h-full border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={url} alt={`사진 ${idx+1}`} className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center print:hidden text-[10px]">X</button>
                      </div>
                    ))}
                    {photos.length < 2 && (
                      <div className="relative w-full h-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center print:hidden cursor-pointer hover:bg-gray-100">
                        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <span className="material-symbols-outlined text-gray-400 text-xl mb-1">add_a_photo</span>
                        <span className="text-gray-500 text-[10px] font-bold">사진 첨부 (1~2장)</span>
                      </div>
                    )}
                    {photos.length === 0 && (
                      <div className="hidden print:flex col-span-2 items-center justify-center h-full text-gray-400 font-bold">
                        (사진 부착란)
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 mb-4 text-center text-base font-bold text-gray-900 print-avoid-break">
            위와 같이 현장체험학습 결과보고서를 제출합니다.
            <br/><br/>
            20&nbsp;&nbsp;&nbsp;&nbsp;년 &nbsp;&nbsp;&nbsp;&nbsp;월 &nbsp;&nbsp;&nbsp;&nbsp;일
          </div>

        </div>
      </div>
    </div>
  );
}
