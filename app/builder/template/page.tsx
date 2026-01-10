"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Typography, Row, Col, Tag, Button, Alert } from "antd";
import {
  FileTextOutlined,
  BgColorsOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const templates: Template[] = [
  {
    id: "basic-approval",
    name: "기본 전자결재",
    description: "가장 기본적인 전자결재 양식. 제목, 내용, 신청자 정보 포함",
    icon: <FileTextOutlined style={{ fontSize: 40 }} />,
    category: "기본",
    color: "#1890ff"
  },
  {
    id: "vacation-request",
    name: "휴가 신청서",
    description: "연차/반차 휴가 신청을 위한 양식. 휴가 종류, 기간, 사유 포함",
    icon: <CalendarOutlined style={{ fontSize: 40 }} />,
    category: "인사",
    color: "#52c41a"
  },
  {
    id: "purchase-request",
    name: "품의서",
    description: "구매 품의 및 지출 요청 양식. 동적 품목 테이블, 금액 자동 계산 포함",
    icon: <ShoppingCartOutlined style={{ fontSize: 40 }} />,
    category: "구매",
    color: "#fa8c16"
  },
  {
    id: "expense-approval",
    name: "지출결의서",
    description: "Legacy ERP 연동 지출결의서. Progressive Disclosure 적용",
    icon: <DollarOutlined style={{ fontSize: 40 }} />,
    category: "회계",
    color: "#722ed1"
  }
];

export default function TemplateSelectorPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 헤더 */}
          <div>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/")}
              style={{ paddingLeft: 0, marginBottom: 16 }}
            >
              홈으로
            </Button>
            <Title level={1} style={{ marginBottom: 8 }}>
              전자결재 템플릿 선택
            </Title>
            <Paragraph style={{ fontSize: 16, color: "#666" }}>
              미리 만들어진 템플릿을 선택하여 빠르게 양식을 만들어보세요
            </Paragraph>
          </div>

          {/* 빈 양식으로 시작 */}
          <Card
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "2px solid #52c41a"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <BgColorsOutlined style={{ fontSize: 48, color: "#52c41a" }} />
              <div style={{ flex: 1 }}>
                <Title level={2} style={{ color: "#389e0d", marginBottom: 8 }}>
                  빈 양식으로 시작하기
                </Title>
                <Paragraph style={{ color: "#595959", marginBottom: 16 }}>
                  처음부터 직접 양식을 디자인하고 싶으신가요? 빈 캔버스에서 시작하세요.
                </Paragraph>
                <Link href="/builder">
                  <Button type="primary" size="large" style={{ background: "#52c41a" }}>
                    빈 양식으로 시작 →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* 템플릿 섹션 */}
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              📋 템플릿 선택
            </Title>
            <Paragraph style={{ color: "#666", marginBottom: 24 }}>
              템플릿을 선택하면 기본 구조가 로드되며, 필요한 항목만 추가하거나 수정할 수 있습니다.
            </Paragraph>
          </div>

          {/* 템플릿 그리드 */}
          <Row gutter={[24, 24]}>
            {templates.map((template) => (
              <Col xs={24} md={12} key={template.id}>
                <Link href={`/builder/template/${template.id}`} style={{ textDecoration: "none" }}>
                  <Card
                    hoverable
                    style={{ height: "100%", border: "2px solid #e8e8e8" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ color: template.color }}>
                        {template.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 12 }}>
                          <Tag color="blue">{template.category}</Tag>
                        </div>
                        <Title level={4} style={{ marginBottom: 8 }}>
                          {template.name}
                        </Title>
                        <Paragraph style={{ color: "#666", marginBottom: 16 }}>
                          {template.description}
                        </Paragraph>
                        <Text style={{ color: "#1890ff", fontWeight: 500 }}>
                          이 템플릿으로 시작 →
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* 사용 팁 */}
          <Alert
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BulbOutlined />
                <Text strong>템플릿 사용 팁</Text>
              </div>
            }
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>템플릿은 시작점입니다. 필드를 자유롭게 추가, 수정, 삭제할 수 있습니다.</li>
                <li>조건부 로직(Logic 탭)을 활용하여 동적인 양식을 만들 수 있습니다.</li>
                <li>완성된 양식은 JSON으로 내보내기하여 <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>surveys/</code> 폴더에 저장하세요.</li>
                <li>저장한 양식은 <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>/survey/파일명</code>으로 바로 사용할 수 있습니다.</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </div>
      </div>
    </div>
  );
}
