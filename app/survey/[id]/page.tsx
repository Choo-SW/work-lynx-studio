"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Result, Button, Card, message } from "antd";
import { LoadingOutlined, ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
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
  const [completed, setCompleted] = useState(false);
  const [surveyData, setSurveyData] = useState<any>(null);

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
    const data = survey.data;
    setSurveyData(data);
    setCompleted(true);
    
    // localStorage에 저장
    localStorage.setItem('lastSurveyData', JSON.stringify(data));
    if (surveyJson) {
      localStorage.setItem('lastCreatedForm', JSON.stringify(surveyJson));
    }
    
    message.success('결재가 완료되었습니다!');
    console.log("Survey completed with data:", data);
  };

  const handleViewDocument = () => {
    router.push(`/survey/${resolvedParams.id}/document`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 16, color: "#666" }}>양식을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !surveyJson) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Result
          status="404"
          title="양식을 찾을 수 없습니다"
          subTitle={`요청하신 양식 ID: ${resolvedParams.id}`}
          extra={
            <Button type="primary" onClick={() => router.push("/")}>
              홈으로 돌아가기
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          style={{ marginBottom: 24, paddingLeft: 0 }}
        >
          뒤로 가기
        </Button>
        
        {completed ? (
          <Card>
            <Result
              status="success"
              title="결재가 완료되었습니다!"
              subTitle="Gateway Server로 전송되었습니다."
              extra={[
                <Button 
                  type="primary" 
                  key="document" 
                  icon={<FileTextOutlined />}
                  onClick={handleViewDocument}
                  size="large"
                >
                  문서 보기 / PDF 다운로드
                </Button>,
                <Button key="home" onClick={() => router.push("/")}>
                  홈으로 돌아가기
                </Button>,
              ]}
            />
          </Card>
        ) : (
          <Card>
            <SurveyComponent json={surveyJson} onComplete={handleSurveyComplete} />
          </Card>
        )}
      </div>
    </div>
  );
}
