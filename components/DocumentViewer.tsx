"use client";

import React, { useRef } from 'react';
import { Button, Descriptions, Typography, Divider, Space } from 'antd';
import { FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;

interface DocumentViewerProps {
  surveyJson: any;
  surveyData: any;
  title?: string;
  documentNumber?: string;
  category?: 'approval' | 'board' | 'proposal' | 'document';
}

export default function DocumentViewer({
  surveyJson,
  surveyData,
  title,
  documentNumber,
  category = 'approval'
}: DocumentViewerProps) {
  const documentRef = useRef<HTMLDivElement>(null);

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    if (!documentRef.current) return;

    try {
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // 여러 페이지 처리
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `${documentNumber || 'document'}_${Date.now()}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  // 브라우저 인쇄
  const handlePrint = () => {
    window.print();
  };

  // 카테고리별 색상
  const getCategoryColor = () => {
    switch (category) {
      case 'approval': return '#1890ff';
      case 'board': return '#52c41a';
      case 'proposal': return '#faad14';
      case 'document': return '#722ed1';
      default: return '#1890ff';
    }
  };

  // 카테고리별 제목
  const getCategoryTitle = () => {
    switch (category) {
      case 'approval': return '전자결재 문서';
      case 'board': return '게시판 문서';
      case 'proposal': return '업무제안서';
      case 'document': return '문서관리';
      default: return '문서';
    }
  };

  // 데이터 렌더링 함수
  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value ? '예' : '아니오';
    }
    return value || '-';
  };

  // 양식 필드 수집
  const getAllFields = () => {
    const fields: any[] = [];
    
    if (surveyJson.pages) {
      surveyJson.pages.forEach((page: any) => {
        if (page.elements) {
          page.elements.forEach((element: any) => {
            fields.push({
              name: element.name,
              title: element.title || element.name,
              type: element.type,
              value: surveyData[element.name]
            });
          });
        }
      });
    }
    
    return fields;
  };

  const fields = getAllFields();

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      {/* 액션 버튼 (인쇄 시 숨김) */}
      <div className="no-print" style={{ 
        maxWidth: '210mm', 
        margin: '0 auto 16px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 8
      }}>
        <Space>
          <Button 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
          >
            인쇄
          </Button>
          <Button 
            type="primary" 
            icon={<FilePdfOutlined />} 
            onClick={handleDownloadPDF}
          >
            PDF 다운로드
          </Button>
        </Space>
      </div>

      {/* A4 문서 */}
      <div 
        ref={documentRef}
        className="document-page"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          background: 'white',
          padding: '20mm',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}
      >
        {/* 문서 헤더 */}
        <div style={{ 
          borderBottom: `3px solid ${getCategoryColor()}`,
          paddingBottom: 16,
          marginBottom: 24
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {getCategoryTitle()}
              </Text>
              <Title level={2} style={{ margin: '8px 0 0 0', color: getCategoryColor() }}>
                {title || surveyJson.title || '문서'}
              </Title>
            </div>
            <div style={{ textAlign: 'right' }}>
              {documentNumber && (
                <Text strong style={{ fontSize: 14, display: 'block' }}>
                  문서번호: {documentNumber}
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                작성일: {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </div>
          </div>
        </div>

        {/* 문서 설명 */}
        {surveyJson.description && (
          <div style={{ 
            background: '#fafafa', 
            padding: 16, 
            borderRadius: 4,
            marginBottom: 24,
            border: '1px solid #e8e8e8'
          }}>
            <Text>{surveyJson.description}</Text>
          </div>
        )}

        {/* 문서 내용 - 표 형식 */}
        <div style={{ marginBottom: 32 }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d9d9d9',
          }}>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.name}>
                  <th style={{
                    background: '#fafafa',
                    padding: '12px 16px',
                    border: '1px solid #d9d9d9',
                    textAlign: 'left',
                    width: '30%',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#262626',
                  }}>
                    {field.title}
                  </th>
                  <td style={{
                    padding: '12px 16px',
                    border: '1px solid #d9d9d9',
                    fontSize: 14,
                    color: '#595959',
                    minHeight: '40px',
                  }}>
                    {renderValue(field.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 결재선 (전자결재인 경우만) */}
        {category === 'approval' && (
          <>
            <Divider style={{ margin: '32px 0 24px' }}>결재</Divider>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 16,
              marginTop: 24
            }}>
              {['기안자', '검토자', '승인자'].map((role, index) => (
                <div 
                  key={role}
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: 16,
                    textAlign: 'center',
                    minWidth: 120,
                  }}
                >
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    {role}
                  </Text>
                  <div style={{
                    width: 80,
                    height: 80,
                    border: '1px dashed #d9d9d9',
                    margin: '8px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#bfbfbf',
                    fontSize: 12,
                  }}>
                    서명
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (인)
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 문서 푸터 */}
        <div style={{ 
          marginTop: 48,
          paddingTop: 16,
          borderTop: '1px solid #e8e8e8',
          textAlign: 'center'
        }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            본 문서는 TCCINS Work Lynx Studio에서 생성되었습니다.
          </Text>
        </div>
      </div>

      {/* 인쇄용 스타일 */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }

          .no-print {
            display: none !important;
          }

          .document-page {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20mm !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
