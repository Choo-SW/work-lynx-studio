"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import FormBuilder from "@/components/FormBuilder";

// 템플릿 import
import basicApprovalTemplate from "@/templates/basic-approval.json";
import vacationRequestTemplate from "@/templates/vacation-request.json";
import purchaseRequestTemplate from "@/templates/purchase-request.json";
import expenseApprovalTemplate from "@/surveys/expense-approval.json";

const templates: Record<string, any> = {
  "basic-approval": basicApprovalTemplate,
  "vacation-request": vacationRequestTemplate,
  "purchase-request": purchaseRequestTemplate,
  "expense-approval": expenseApprovalTemplate,
};

const templateNames: Record<string, string> = {
  "basic-approval": "기본 전자결재",
  "vacation-request": "휴가 신청서",
  "purchase-request": "품의서",
  "expense-approval": "지출결의서",
};

export default function TemplateBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [savedJson, setSavedJson] = useState<object | null>(null);
  const [templateJson, setTemplateJson] = useState<object | null>(null);
  const [templateName, setTemplateName] = useState<string>("");

  useEffect(() => {
    const template = templates[resolvedParams.id];
    const name = templateNames[resolvedParams.id];
    
    if (template) {
      setTemplateJson(template);
      setTemplateName(name);
    } else {
      router.push("/builder/template");
    }
  }, [resolvedParams.id, router]);

  const handleSave = useCallback((json: object) => {
    setSavedJson(json);
    console.log("양식이 저장되었습니다:", json);
    localStorage.setItem('lastCreatedForm', JSON.stringify(json, null, 2));
  }, []);

  const handleExport = useCallback(() => {
    if (savedJson) {
      const dataStr = JSON.stringify(savedJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `${resolvedParams.id}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }, [savedJson, resolvedParams.id]);

  if (!templateJson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">템플릿을 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/builder/template")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 템플릿 목록
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {templateName} - Form Builder
            </h1>
            <p className="text-xs text-gray-500">템플릿 기반 편집 모드</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={!savedJson}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            💾 JSON 내보내기
          </button>
          
          <button
            onClick={() => {
              const json = localStorage.getItem('lastCreatedForm');
              if (json) {
                alert('미리보기 기능은 개발 중입니다.\n\n저장된 JSON을 콘솔에서 확인하세요.');
                console.log('Saved Form JSON:', JSON.parse(json));
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            👁️ 미리보기
          </button>
        </div>
      </div>

      {/* Form Builder */}
      <div className="flex-1 overflow-hidden">
        <FormBuilder json={templateJson} onSave={handleSave} />
      </div>

      {/* 안내 메시지 */}
      <div className="bg-green-50 border-t border-green-200 px-6 py-2 text-sm text-green-800">
        <strong>✨ 템플릿 모드:</strong> 기본 구조가 로드되었습니다. 
        필드를 추가하거나 수정하여 원하는 양식을 완성하세요.
      </div>
    </div>
  );
}
