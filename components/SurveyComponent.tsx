"use client";

import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { useEffect, useState } from "react";

interface SurveyComponentProps {
  json: object;
  onComplete?: (survey: Model) => void;
}

export default function SurveyComponent({ json, onComplete }: SurveyComponentProps) {
  const [survey, setSurvey] = useState<Model | null>(null);

  useEffect(() => {
    const surveyModel = new Model(json);
    
    // 설문 완료 핸들러
    surveyModel.onComplete.add((sender) => {
      console.log("Survey results:", JSON.stringify(sender.data, null, 2));
      if (onComplete) {
        onComplete(sender);
      }
    });

    setSurvey(surveyModel);
  }, [json, onComplete]);

  if (!survey) {
    return <div className="p-4">Loading survey...</div>;
  }

  return (
    <div className="survey-container">
      <Survey model={survey} />
    </div>
  );
}
