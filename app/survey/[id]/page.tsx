"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SurveyComponent from "@/components/SurveyComponent";
import { Model } from "survey-core";

// 정적 JSON import
import basicSurvey from "@/surveys/basic.json";
import advancedSurvey from "@/surveys/advanced.json";
import expenseApprovalSurvey from "@/surveys/expense-approval.json";

// 설문 매핑
const surveys: Record<string, any> = {
  basic: basicSurvey,
  advanced: advancedSurvey,
  "expense-approval": expenseApprovalSurvey,
};

// JSON 설문 파일 로드
function loadSurvey(id: string) {
  return surveys[id] || null;
}

export default function SurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [surveyJson, setSurveyJson] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = loadSurvey(resolvedParams.id);
    if (data) {
      setSurveyJson(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [resolvedParams.id]);

  const handleSurveyComplete = (survey: Model) => {
    alert("결재가 완료되었습니다!\n\nGateway Server로 전송되었습니다.\n결과는 콘솔에서 확인할 수 있습니다.");
    console.log("Survey completed with data:", survey.data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">양식을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !surveyJson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">양식을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 양식 ID: {resolvedParams.id}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← 뒤로 가기
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SurveyComponent json={surveyJson} onComplete={handleSurveyComplete} />
        </div>
      </div>
    </div>
  );
}
