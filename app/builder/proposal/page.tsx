"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Divider, Alert } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import FormBuilder from "@/components/FormBuilder";

const { Title } = Typography;

export default function ProposalFormBuilderPage() {
  const router = useRouter();
  const [savedJson, setSavedJson] = useState<object | null>(null);

  const handleSave = useCallback((json: object) => {
    const formWithCategory = {
      category: 'proposal',
      ...json,
    };
    setSavedJson(formWithCategory);
    console.log("업무제안 양식이 저장되었습니다:", formWithCategory);
    
    localStorage.setItem('lastCreatedForm', JSON.stringify(formWithCategory, null, 2));
  }, []);

  const handleExport = useCallback(() => {
    if (savedJson) {
      const dataStr = JSON.stringify(savedJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `proposal-form-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }, [savedJson]);

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
            onClick={() => router.push("/")}
            style={{ paddingLeft: 0 }}
          >
            홈으로
          </Button>
          <Divider type="vertical" style={{ height: 24 }} />
          <Title level={4} style={{ margin: 0, color: "#faad14" }}>
            💡 업무제안 양식 빌더
          </Title>
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={() => router.push("/workflow/proposal")}
          >
            워크플로우 연결
          </Button>
        </div>
        
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!savedJson}
            style={{ background: "#faad14", color: "#fff", border: "none" }}
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
        <FormBuilder onSave={handleSave} />
      </div>

      {/* 안내 메시지 */}
      <div style={{ 
        background: "#fffbe6", 
        borderTop: "1px solid #ffe58f",
        padding: "8px 24px"
      }}>
        <Alert
          message={
            <span>
              <strong>💡 업무제안 양식 작성 팁:</strong> 
              제안 제목, 현황 분석, 개선 방안, 기대 효과, 소요 예산 등을 포함하세요. 
              평가자 정보와 투표 기간 설정은 워크플로우에서 관리할 수 있습니다.
            </span>
          }
          type="warning"
          showIcon={false}
          style={{ border: "none", background: "transparent", padding: 0 }}
        />
      </div>
    </div>
  );
}
