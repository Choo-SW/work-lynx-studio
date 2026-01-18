"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  Tree, 
  Input, 
  Button, 
  Typography,
  Row,
  Col,
  Space
} from "antd";
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined
} from "@ant-design/icons";
import type { DataNode } from 'antd/es/tree';

const { Title, Text } = Typography;
const { Search } = Input;

// 결재 서식 데이터
interface FormData {
  id: string;
  title: string;
  category: string;
  description?: string;
}

const formTemplates: FormData[] = [
  { 
    id: "expense-approval", 
    title: "지출결의서", 
    category: "기안",
    description: "업무 관련 지출에 대한 결재 문서"
  },
  { 
    id: "expense-approval-company", 
    title: "기안문(대내시행)", 
    category: "기안",
    description: "회사 내부 기안 문서"
  },
  { 
    id: "expense-approval-external", 
    title: "기안문(대외시행)", 
    category: "기안",
    description: "회사 외부 발송 기안 문서"
  },
  { 
    id: "foreign-doc", 
    title: "대외공문", 
    category: "기안",
    description: "외부 기관 공문"
  },
  { 
    id: "report-doc", 
    title: "보고", 
    category: "보고",
    description: "업무 보고서"
  },
  { 
    id: "business-trip", 
    title: "업무연락", 
    category: "업무연락",
    description: "업무 관련 연락 문서"
  },
  { 
    id: "meeting-minutes", 
    title: "회의록", 
    category: "회의록",
    description: "회의 내용 기록"
  },
  { 
    id: "purchase-request", 
    title: "신청서", 
    category: "신청서",
    description: "물품 구매 신청"
  },
  { 
    id: "it-request", 
    title: "정보(IT)", 
    category: "정보(IT)",
    description: "IT 관련 요청"
  },
];

// 트리 데이터 구조
const treeData: DataNode[] = [
  {
    title: '기안',
    key: 'draft',
    icon: <FolderOutlined />,
    children: [
      { title: '기안문', key: 'draft-doc', icon: <FileTextOutlined /> },
      { title: '기안문(대내시행)', key: 'draft-internal', icon: <FileTextOutlined /> },
      { title: '기안문(대외시행)', key: 'draft-external', icon: <FileTextOutlined /> },
      { title: '대외공문', key: 'foreign-doc', icon: <FileTextOutlined /> },
    ],
  },
  {
    title: '보고',
    key: 'report',
    icon: <FolderOutlined />,
    children: [],
  },
  {
    title: '업무연락',
    key: 'business',
    icon: <FolderOutlined />,
    children: [],
  },
  {
    title: '회의록',
    key: 'meeting',
    icon: <FolderOutlined />,
    children: [],
  },
  {
    title: '신청서',
    key: 'application',
    icon: <FolderOutlined />,
    children: [],
  },
  {
    title: '정보(IT)',
    key: 'it',
    icon: <FolderOutlined />,
    children: [],
  },
];

export default function ApprovalSelectPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("기안");

  // 검색 필터링
  const filteredForms = formTemplates.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 서식 선택 핸들러
  const handleFormSelect = (formId: string, device?: 'pc' | 'tablet' | 'mobile') => {
    console.log("선택된 양식:", formId, "디바이스:", device);
    
    // 지출결의서를 선택한 경우 기존 survey 페이지로 이동
    if (formId === "expense-approval") {
      // 디바이스별 쿼리 파라미터 추가
      const deviceParam = device ? `?device=${device}` : '';
      router.push(`/survey/expense-approval${deviceParam}`);
    } else {
      // 다른 양식들은 아직 준비 중
      alert(`${formTemplates.find(f => f.id === formId)?.title} 양식은 준비 중입니다.`);
    }
  };

  // 트리 선택 핸들러
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      // 카테고리 매핑
      const categoryMap: Record<string, string> = {
        'draft': '기안',
        'report': '보고',
        'business': '업무연락',
        'meeting': '회의록',
        'application': '신청서',
        'it': '정보(IT)',
      };
      setSelectedCategory(categoryMap[key] || '기안');
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f0f2f5" }}>
      {/* 헤더 */}
      <div style={{ 
        background: "#fff", 
        borderBottom: "1px solid #e8e8e8",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Space size="large">
          <Button 
            icon={<HomeOutlined />} 
            onClick={() => router.push("/")}
          >
            홈으로
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            📋 전자결재
          </Title>
        </Space>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* 왼쪽 사이드바 - 결재서식 트리 */}
        <div style={{ 
          width: 260, 
          background: "#fff", 
          borderRight: "1px solid #e8e8e8",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* 검색 */}
          <div style={{ padding: "12px 16px" }}>
            <Search
              placeholder="검색"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          {/* 트리 */}
          <div style={{ 
            flex: 1, 
            overflowY: "auto",
            padding: "0 8px"
          }}>
            <div style={{ 
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <Space>
                <FolderOpenOutlined style={{ color: "#1890ff" }} />
                <Text strong>결재서식</Text>
              </Space>
              <Button 
                type="text" 
                size="small" 
                icon={<ReloadOutlined />}
              />
            </div>
            
            <Tree
              showIcon
              defaultExpandAll
              treeData={treeData}
              onSelect={handleTreeSelect}
              style={{ background: "transparent" }}
            />
          </div>
        </div>

        {/* 오른쪽 컨텐츠 영역 */}
        <div style={{ 
          flex: 1, 
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* 브레드크럼 */}
          <div style={{ 
            padding: "16px 24px",
            background: "#fff",
            borderBottom: "1px solid #e8e8e8"
          }}>
            <Space>
              <Text type="secondary">전자결재</Text>
              <Text type="secondary">›</Text>
              <Text strong>결재작성</Text>
            </Space>
          </div>

          {/* 서식 카드 그리드 */}
          <div style={{ 
            flex: 1, 
            padding: "24px",
            overflowY: "auto",
            background: "#fafafa"
          }}>
            <Title level={5} style={{ marginBottom: 16 }}>
              자주 사용하는 양식
            </Title>
            
            <Row gutter={[16, 16]}>
              {filteredForms.map((form) => (
                <Col key={form.id} xs={24} sm={12} md={8} lg={6}>
                  {form.id === "expense-approval" ? (
                    // 지출결의서 카드 - 디바이스 선택 버튼 포함
                    <Card
                      style={{ 
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        border: "2px solid #1890ff"
                      }}
                      bodyStyle={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px",
                        flex: 1
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseCircleOutlined />}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#999"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Remove from favorites");
                        }}
                      />
                      
                      <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <FileTextOutlined 
                          style={{ 
                            fontSize: 32, 
                            color: "#1890ff",
                            marginBottom: 12
                          }} 
                        />
                        <div>
                          <Text strong style={{ fontSize: 14 }}>
                            {form.title}
                          </Text>
                          {form.description && (
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {form.category}
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 디바이스 선택 버튼 */}
                      <div style={{ 
                        width: "100%", 
                        borderTop: "1px solid #f0f0f0", 
                        paddingTop: 12,
                        display: "flex",
                        justifyContent: "space-around",
                        gap: 4
                      }}>
                        <Button
                          type="text"
                          size="small"
                          icon={<DesktopOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFormSelect(form.id, 'pc');
                          }}
                          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "auto", padding: "4px" }}
                        >
                          <span style={{ fontSize: 11, marginTop: 2 }}>PC</span>
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<TabletOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFormSelect(form.id, 'tablet');
                          }}
                          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "auto", padding: "4px" }}
                        >
                          <span style={{ fontSize: 11, marginTop: 2 }}>태블릿</span>
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<MobileOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFormSelect(form.id, 'mobile');
                          }}
                          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "auto", padding: "4px" }}
                        >
                          <span style={{ fontSize: 11, marginTop: 2 }}>모바일</span>
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    // 다른 카드들 - 기존 디자인
                    <Card
                      hoverable
                      onClick={() => handleFormSelect(form.id)}
                      style={{ 
                        height: 140,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        cursor: "pointer",
                        position: "relative"
                      }}
                      bodyStyle={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px"
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseCircleOutlined />}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#999"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Remove from favorites");
                        }}
                      />
                      
                      <FileTextOutlined 
                        style={{ 
                          fontSize: 32, 
                          color: "#999",
                          marginBottom: 12
                        }} 
                      />
                      <div>
                        <Text strong style={{ fontSize: 14 }}>
                          {form.title}
                        </Text>
                        {form.description && (
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {form.category}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </Col>
              ))}
            </Row>

            {filteredForms.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "60px 20px",
                color: "#999"
              }}>
                <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>검색 결과가 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
