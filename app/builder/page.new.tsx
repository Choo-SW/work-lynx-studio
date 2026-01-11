"use client";

import { useRouter } from "next/navigation";
import { Button, Typography, Card, Row, Col, Tag } from "antd";
import { 
  ArrowLeftOutlined, 
  FileTextOutlined, 
  MessageOutlined, 
  BulbOutlined, 
  FolderOutlined,
  ArrowRightOutlined 
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function FormBuilderCategoryPage() {
  const router = useRouter();

  const categories = [
    {
      key: 'approval',
      title: '📄 전자결재 양식',
      description: '기안, 품의, 지출결의 등 결재 문서 양식을 만들 수 있습니다.',
      color: '#1890ff',
      bgColor: '#e6f7ff',
      icon: <FileTextOutlined />,
      path: '/builder/approval',
      features: ['결재선 설정', '금액 필드', '첨부 문서', '긴급 처리'],
    },
    {
      key: 'board',
      title: '💬 게시판 양식',
      description: '공지사항, FAQ, 자료실 등 게시판 게시물 양식을 만들 수 있습니다.',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: <MessageOutlined />,
      path: '/builder/board',
      features: ['카테고리 분류', '첨부 파일', '공개 설정', '고정 게시'],
    },
    {
      key: 'proposal',
      title: '💡 업무제안 양식',
      description: '개선 제안, 아이디어 제출 등 업무 제안 양식을 만들 수 있습니다.',
      color: '#faad14',
      bgColor: '#fffbe6',
      icon: <BulbOutlined />,
      path: '/builder/proposal',
      features: ['현황 분석', '개선 방안', '기대 효과', '평가 항목'],
    },
    {
      key: 'document',
      title: '📁 문서관리 양식',
      description: '문서 등록, 메타데이터 입력 등 문서 관리 양식을 만들 수 있습니다.',
      color: '#722ed1',
      bgColor: '#f9f0ff',
      icon: <FolderOutlined />,
      path: '/builder/document',
      features: ['버전 관리', '보존 기간', '문서 분류', '접근 권한'],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* 헤더 */}
      <div style={{ 
        background: "#fff", 
        borderBottom: "1px solid #e8e8e8", 
        padding: "16px 24px",
      }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          style={{ paddingLeft: 0, marginBottom: 8 }}
        >
          홈으로
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          📝 폼 빌더 카테고리 선택
        </Title>
        <Paragraph style={{ margin: "8px 0 0 0", color: "#666" }}>
          만들고자 하는 양식의 용도를 선택하세요. 각 카테고리별로 최적화된 빌더를 제공합니다.
        </Paragraph>
      </div>

      {/* 카테고리 카드 */}
      <div style={{ padding: "32px 24px" }}>
        <Row gutter={[24, 24]}>
          {categories.map((category) => (
            <Col xs={24} sm={12} lg={6} key={category.key}>
              <Card
                hoverable
                style={{ 
                  height: "100%",
                  borderColor: category.color,
                  borderWidth: 2,
                }}
                onClick={() => router.push(category.path)}
              >
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div 
                    style={{ 
                      width: 64, 
                      height: 64, 
                      margin: "0 auto 12px",
                      background: category.bgColor,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      color: category.color,
                    }}
                  >
                    {category.icon}
                  </div>
                  <Title level={4} style={{ margin: 0, color: category.color }}>
                    {category.title}
                  </Title>
                </div>

                <Paragraph style={{ textAlign: "center", color: "#666", minHeight: 48 }}>
                  {category.description}
                </Paragraph>

                <div style={{ marginTop: 16 }}>
                  {category.features.map((feature, idx) => (
                    <Tag 
                      key={idx} 
                      color={category.color}
                      style={{ marginBottom: 8 }}
                    >
                      {feature}
                    </Tag>
                  ))}
                </div>

                <Button
                  type="primary"
                  block
                  icon={<ArrowRightOutlined />}
                  style={{ 
                    marginTop: 16,
                    background: category.color,
                    borderColor: category.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(category.path);
                  }}
                >
                  양식 만들기
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
