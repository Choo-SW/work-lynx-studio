"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormBuilder from "@/components/FormBuilder";

export default function BuilderPage() {
  const router = useRouter();
  const [savedJson, setSavedJson] = useState<object | null>(null);

  const handleSave = useCallback((json: object) => {
    setSavedJson(json);
    console.log("양식이 저장되었습니다:", json);
    
    // localStorage에 저장 (실제로는 서버로 전송)
    localStorage.setItem('lastCreatedForm', JSON.stringify(json, null, 2));
  }, []);

  const handleExport = useCallback(() => {
    if (savedJson) {
      const dataStr = JSON.stringify(savedJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `form-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }, [savedJson]);

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 홈으로
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-bold text-gray-900">
            Lynx Studio Form Builder
          </h1>
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
        <FormBuilder onSave={handleSave} />
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-2 text-sm text-blue-800">
        <strong>💡 팁:</strong> 왼쪽 도구상자에서 필드를 드래그하여 양식을 만들 수 있습니다. 
        조건부 로직(visibleIf)은 Logic 탭에서 설정하세요.
      </div>
    </div>
  );
}
