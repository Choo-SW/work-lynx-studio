"use client";

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { useEffect, useState, useRef } from "react";

interface FormBuilderProps {
  json?: object;
  onSave?: (json: object) => void;
}

export default function FormBuilder({ json, onSave }: FormBuilderProps) {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);
  const onSaveRef = useRef(onSave);

  // onSave 함수 참조 업데이트
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Creator 초기화 (한 번만 실행)
  useEffect(() => {
    const creatorOptions = {
      showLogicTab: true,
      showTranslationTab: true,
      isAutoSave: true,
    };

    const surveyCreator = new SurveyCreator(creatorOptions);
    
    // 초기 JSON이 있으면 로드
    if (json) {
      surveyCreator.JSON = json;
    }

    // 자동 저장 이벤트
    surveyCreator.saveSurveyFunc = (saveNo: number, callback: (num: number, success: boolean) => void) => {
      const surveyJson = surveyCreator.JSON;
      console.log("Auto-saving survey:", surveyJson);
      
      if (onSaveRef.current) {
        onSaveRef.current(surveyJson);
      }
      
      callback(saveNo, true);
    };

    setCreator(surveyCreator);

    // cleanup 함수
    return () => {
      surveyCreator.dispose();
    };
  }, []); // 빈 배열로 변경 - 한 번만 실행

  // JSON이 변경되면 creator에 업데이트 (creator 재생성 없이)
  useEffect(() => {
    if (creator && json) {
      creator.JSON = json;
    }
  }, [creator, json]);

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Form Builder를 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
