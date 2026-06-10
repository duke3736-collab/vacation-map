"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/store/useMapStore";
import html2canvas from "html2canvas";

export default function ReportPlanPage() {
  const router = useRouter();
  const { selectedPlaceForReport, draftReports, setDraftReport } = useMapStore();
  const placeId = selectedPlaceForReport?.id || 'unknown';

  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [guardian, setGuardian] = useState("");
  
  const [planPurpose, setPlanPurpose] = useState("");
  const [planActivities, setPlanActivities] = useState("");

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
        
        setPlanPurpose(draft.planPurpose || "");
        setPlanActivities(draft.planActivities || "");
      } catch (e) {
        setDate(new Date().toISOString().split("T")[0]);
        setPlaceName(selectedPlaceForReport?.name || "");
      }
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setPlaceName(selectedPlaceForReport?.name || "");
      
      // Auto-populate hint if curriculumLinks exist
      if (selectedPlaceForReport?.curriculumLinks && selectedPlaceForReport.curriculumLinks.length > 0) {
        const link = selectedPlaceForReport.curriculumLinks[0];
        const hintText = `${link.grade} ${link.subject} - ${link.unit} 단원 학습 연계`;
        setPlanPurpose(hintText);
      }
    }
  }, [placeId, selectedPlaceForReport, draftReports]);

  const handleSave = () => {
    const currentState = {
      school, grade, name, date, placeName, guardian,
      planPurpose, planActivities
    };
    // 기존 데이터를 보존하면서 신청서 관련 내용만 덮어쓰기
    let existingData = {};
    if (draftReports[placeId]) {
      try { existingData = JSON.parse(draftReports[placeId]); } catch(e) {}
    }
    setDraftReport(placeId, JSON.stringify({ ...existingData, ...currentState }));
    setSaveStatus("✅ 자동 저장됨");
    setTimeout(() => setSaveStatus(""), 2000);
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
      link.download = `현장체험학습_신청서_${date}.png`;
      link.click();
    } catch (error) {
      console.error("이미지 저장 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  const curriculumHint = selectedPlaceForReport?.curriculumLinks?.[0]?.hint || "";
  const curriculumSubject = selectedPlaceForReport?.curriculumLinks?.[0]?.subject || "";
  const curriculumUnit = selectedPlaceForReport?.curriculumLinks?.[0]?.unit || "";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 pt-24 pb-12 print:bg-white print:py-0 overflow-x-hidden">
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

        {/* 교과 연계 힌트 박스 */}
        {curriculumHint && (
          <div className="mx-4 md:mx-0 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 print:hidden shadow-sm flex gap-4 items-start">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-black text-blue-900 mb-1">신청서 작성 팁 ({curriculumSubject} - {curriculumUnit})</h3>
              <p className="text-blue-800 text-sm font-medium leading-relaxed">
                아래 목적과 학습 계획에 이 힌트를 활용해보세요: <br/><strong>"{curriculumHint}"</strong>
              </p>
            </div>
          </div>
        )}

        {/* Report Paper A4 Size */}
        <div 
          ref={reportRef}
          className="bg-white print:m-0 shadow-lg print:shadow-none border border-gray-200 print:border-none mx-auto w-full md:w-[210mm] min-h-[297mm] p-10 md:p-14 relative box-border flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-widest">
              현장체험학습 신청서
            </h1>
          </div>

          {/* Student Info Table */}
          <table className="w-full border-collapse border-2 border-gray-900 mb-8 text-base">
            <tbody>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 w-24 font-bold text-gray-900 text-center">학교명</th>
                <td className="border border-gray-900 px-4">
                  <input type="text" value={school} onChange={(e) => {setSchool(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="ㅇㅇ초등학교" />
                </td>
                <th className="border border-gray-900 bg-gray-100 py-3 w-24 font-bold text-gray-900 text-center">학년 / 반</th>
                <td className="border border-gray-900 px-4">
                  <input type="text" value={grade} onChange={(e) => {setGrade(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="3학년 1반" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">이름</th>
                <td className="border border-gray-900 px-4">
                  <input type="text" value={name} onChange={(e) => {setName(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="홍길동" />
                </td>
                <th className="border border-gray-900 bg-gray-100 py-3 font-bold text-gray-900 text-center">보호자</th>
                <td className="border border-gray-900 px-4">
                  <div className="flex items-center gap-2">
                    <input type="text" value={guardian} onChange={(e) => {setGuardian(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" placeholder="보호자 성명" />
                    <span className="shrink-0 text-sm text-gray-500">(인)</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Form Content */}
          <table className="w-full border-collapse border-2 border-gray-900 text-base flex-1">
            <tbody>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-4 w-32 font-bold text-gray-900 text-center">체험학습<br/>장 소</th>
                <td className="border border-gray-900 px-4">
                  <input type="text" value={placeName} onChange={(e) => {setPlaceName(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-bold text-lg" placeholder="방문 장소 입력" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-4 font-bold text-gray-900 text-center">체험학습<br/>일 시</th>
                <td className="border border-gray-900 px-4">
                  <input type="date" value={date} onChange={(e) => {setDate(e.target.value); handleSave()}} className="w-full bg-transparent outline-none font-medium" />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-4 font-bold text-gray-900 text-center">목 적</th>
                <td className="border border-gray-900 px-4 py-2">
                  <textarea 
                    value={planPurpose} onChange={(e) => {setPlanPurpose(e.target.value); handleSave()}} 
                    className="w-full bg-transparent outline-none font-medium resize-none h-24" 
                    placeholder="예) 박물관 관람을 통해 교과서에서 배운 역사를 이해한다."
                  />
                </td>
              </tr>
              <tr>
                <th className="border border-gray-900 bg-gray-100 py-4 font-bold text-gray-900 text-center">학습 계획<br/>(예정)</th>
                <td className="border border-gray-900 px-4 py-2 h-full align-top">
                  <textarea 
                    value={planActivities} onChange={(e) => {setPlanActivities(e.target.value); handleSave()}} 
                    className="w-full h-full min-h-[300px] bg-transparent outline-none font-medium resize-none" 
                    placeholder="어떤 활동을 할 계획인지 구체적으로 적어주세요."
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-12 mb-8 text-center text-lg font-bold text-gray-900">
            위와 같이 현장체험학습 신청서를 제출합니다.
            <br/><br/>
            20&nbsp;&nbsp;&nbsp;&nbsp;년 &nbsp;&nbsp;&nbsp;&nbsp;월 &nbsp;&nbsp;&nbsp;&nbsp;일
          </div>

        </div>
      </div>
    </div>
  );
}
