"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Divider, Alert } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import FormBuilder from "@/components/FormBuilder";

const { Title } = Typography;

export default function ApprovalFormBuilderPage() {
  const router = useRouter();
  const [savedJson, setSavedJson] = useState<object | null>(null);

  const handleSave = useCallback((json: object) => {
    const formWithCategory = {
      category: 'approval',
      ...json,
    };
    setSavedJson(formWithCategory);
    console.log("전자결재 양식이 저장되었습니다:", formWithCategory);
    
    localStorage.setItem('lastCreatedForm', JSON.stringify(formWithCategory, null, 2));
  }, []);

  const handleExport = useCallback(() => {
    if (savedJson) {
      const dataStr = JSON.stringify(savedJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `approval-form-${Date.now()}.json`;
      
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
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            📄 전자결재 양식 빌더
          </Title>
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={() => router.push("/workflow")}
          >
            워크플로우 연결
          </Button>
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
        <FormBuilder onSave={handleSave} />
      </div>

      {/* 안내 메시지 */}
      <div style={{ 
        background: "#e6f7ff", 
        borderTop: "1px solid #91d5ff",
        padding: "8px 24px"
      }}>
        <Alert
          message={
            <span>
              <strong>💡 전자결재 양식 작성 팁:</strong> 
              기안자 정보, 결재 금액, 사유 등 필수 항목을 포함하세요. 
              조건부 로직으로 금액별 결재선을 다르게 설정할 수 있습니다.
            </span>
          }
          type="info"
          showIcon={false}
          style={{ border: "none", background: "transparent", padding: 0 }}
        />
      </div>
    </div>
  );
}
