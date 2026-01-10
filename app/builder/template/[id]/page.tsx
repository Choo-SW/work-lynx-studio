"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Divider, Spin, Alert, Tag } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import FormBuilder from "@/components/FormBuilder";

// 템플릿 import
import basicApprovalTemplate from "@/templates/basic-approval.json";
import vacationRequestTemplate from "@/templates/vacation-request.json";
import purchaseRequestTemplate from "@/templates/purchase-request.json";
import expenseApprovalTemplate from "@/surveys/expense-approval.json";

const { Title, Text } = Typography;

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 16, color: "#666" }}>템플릿을 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ 
        background: "#fff", 
        borderBottom: "1px solid #e8e8e8", 
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/builder/template")}
            style={{ paddingLeft: 0 }}
          >
            템플릿 목록
          </Button>
          <Divider type="vertical" style={{ height: 24 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Title level={4} style={{ margin: 0 }}>
                {templateName}
              </Title>
              <Tag color="purple">템플릿 모드</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Form Builder - 템플릿 기반 편집
            </Text>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!savedJson}
            style={{ background: "#52c41a", color: "#fff", border: "none" }}
          >
            JSON 내보내기
          </Button>
          
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              const json = localStorage.getItem('lastCreatedForm');
              if (json) {
                alert('미리보기 기능은 개발 중입니다.\n\n저장된 JSON을 콘솔에서 확인하세요.');
                console.log('Saved Form JSON:', JSON.parse(json));
              }
            }}
          >
            미리보기
          </Button>
        </div>
      </div>

      {/* Form Builder */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <FormBuilder json={templateJson} onSave={handleSave} />
      </div>

      {/* 안내 메시지 */}
      <div style={{ 
        background: "#f6ffed", 
        borderTop: "1px solid #b7eb8f",
        padding: "8px 24px"
      }}>
        <Alert
          message={<span><strong>✨ 템플릿 모드:</strong> 기본 구조가 로드되었습니다. 필드를 추가하거나 수정하여 원하는 양식을 완성하세요.</span>}
          type="success"
          showIcon={false}
          style={{ border: "none", background: "transparent", padding: 0 }}
        />
      </div>
    </div>
  );
}
