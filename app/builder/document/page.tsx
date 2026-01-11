"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Divider, Alert } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import FormBuilder from "@/components/FormBuilder";

const { Title } = Typography;

export default function DocumentFormBuilderPage() {
  const router = useRouter();
  const [savedJson, setSavedJson] = useState<object | null>(null);

  const handleSave = useCallback((json: object) => {
    const formWithCategory = {
      category: 'document',
      ...json,
    };
    setSavedJson(formWithCategory);
    console.log("문서관리 양식이 저장되었습니다:", formWithCategory);
    
    localStorage.setItem('lastCreatedForm', JSON.stringify(formWithCategory, null, 2));
  }, []);

  const handleExport = useCallback(() => {
    if (savedJson) {
      const dataStr = JSON.stringify(savedJson, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `document-form-${Date.now()}.json`;
      
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
          <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
            📁 문서관리 양식 빌더
          </Title>
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={() => router.push("/workflow/document")}
          >
            워크플로우 연결
          </Button>
        </div>
        
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!savedJson}
            style={{ background: "#722ed1", color: "#fff", border: "none" }}
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
        background: "#f9f0ff", 
        borderTop: "1px solid #d3adf7",
        padding: "8px 24px"
      }}>
        <Alert
          message={
            <span>
              <strong>💡 문서관리 양식 작성 팁:</strong> 
              문서 제목, 버전 번호, 작성자, 보존 기간 등 메타데이터를 포함하세요. 
              버전 관리, 체크아웃/체크인, 잠금 기능은 워크플로우에서 관리할 수 있습니다.
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
