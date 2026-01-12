"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import DocumentViewer from '@/components/DocumentViewer';

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [surveyJson, setSurveyJson] = useState<any>(null);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 데이터 가져오기
    const loadData = () => {
      try {
        // 양식 JSON 가져오기
        const savedJson = localStorage.getItem('lastCreatedForm');
        if (savedJson) {
          setSurveyJson(JSON.parse(savedJson));
        }

        // 응답 데이터 가져오기
        const savedData = localStorage.getItem('lastSurveyData');
        if (savedData) {
          setSurveyData(JSON.parse(savedData));
        } else {
          // 데이터가 없으면 목데이터 사용
          const mockData = {
            drafter: '홍길동',
            department: '재무팀',
            requestDate: new Date().toISOString().split('T')[0],
            expenseType: '출장비',
            amount: '1,500,000',
            purpose: '거래처 미팅 및 제품 데모',
            detail: '서울-부산 출장 경비\n- 교통비: 500,000원\n- 숙박비: 800,000원\n- 식비: 200,000원',
            attachments: '영수증.pdf, 출장보고서.docx'
          };
          setSurveyData(mockData);
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="문서 로딩 중..." />
      </div>
    );
  }

  if (!surveyJson || !surveyData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 16
      }}>
        <p>문서를 찾을 수 없습니다.</p>
        <Button type="primary" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* 헤더 (인쇄 시 숨김) */}
      <div className="no-print" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderBottom: '1px solid #e8e8e8',
        padding: '12px 24px',
        zIndex: 1000,
      }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          돌아가기
        </Button>
      </div>

      {/* 상단 여백 (헤더 때문에) */}
      <div style={{ height: 56 }} className="no-print" />

      {/* 문서 뷰어 */}
      <DocumentViewer
        surveyJson={surveyJson}
        surveyData={surveyData}
        title={surveyJson.title}
        documentNumber={`APPR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`}
        category={surveyJson.category || 'approval'}
      />
    </>
  );
}
