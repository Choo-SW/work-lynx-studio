"use client";

import Link from "next/link";
import { Card, Typography, Row, Col, Tag } from "antd";
import {
  FileTextOutlined,
  FormOutlined,
  BgColorsOutlined,
  AppstoreAddOutlined,
  RocketOutlined,
  CloudServerOutlined,
  ApiOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header */}
          <div>
            <Title level={1} style={{ marginBottom: 8 }}>
              TCCINS Work Lynx Studio
            </Title>
            <Title level={3} style={{ color: "#1890ff", marginTop: 0 }}>
              Form Builder Module
            </Title>
            <Paragraph style={{ fontSize: 16 }}>
              Progressive Disclosure 기반 LowCode 결재 양식 빌더
            </Paragraph>
          </div>

          {/* 실전 시나리오 */}
          <Card title={<><FileTextOutlined /> 💼 실전 시나리오</>}>
            <Paragraph>
              Lynx Studio 기획서의 통합 시나리오를 구현한 실제 양식입니다.
            </Paragraph>
            
            <Link href="/survey/expense-approval" style={{ textDecoration: "none" }}>
              <Card hoverable style={{ border: "2px solid #1890ff" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileTextOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                    <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                      지출결의서 (시나리오 4.1)
                    </Title>
                  </div>
                  <Text type="secondary">
                    Gateway Server를 통한 Legacy ERP 실시간 연동 시나리오
                  </Text>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <Text>✓ Progressive Disclosure - 프로젝트 선택 시 동적 필드 노출</Text>
                    <Text>✓ 실시간 예산 조회 - Legacy ERP API 시뮬레이션</Text>
                    <Text>✓ 조건부 경고 - 예산 부족/초과 시 자동 알림</Text>
                    <Text>✓ 동적 그리드 - 지출 항목 동적 추가/삭제</Text>
                  </div>
                </div>
              </Card>
            </Link>
          </Card>

          {/* Form Builder */}
          <Card title={<><FormOutlined /> 🛠️ Form Builder (LowCode 도구)</>}>
            <Paragraph>
              드래그 앤 드롭 방식으로 결재 양식을 직접 만들어 보세요.
            </Paragraph>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Link href="/builder/template" style={{ textDecoration: "none" }}>
                <Card hoverable style={{ border: "2px solid #722ed1" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <AppstoreAddOutlined style={{ fontSize: 32, color: "#722ed1" }} />
                      <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
                        템플릿으로 시작하기 <Tag color="purple">추천</Tag>
                      </Title>
                    </div>
                    <Text type="secondary">
                      미리 만들어진 전자결재 템플릿을 선택하고 필요한 항목만 수정
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <Text>✓ 기본 전자결재, 휴가신청서, 품의서 등</Text>
                      <Text>✓ 템플릿 기반으로 빠른 양식 제작</Text>
                      <Text>✓ 필드 추가/수정/삭제 자유롭게</Text>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/builder" style={{ textDecoration: "none" }}>
                <Card hoverable style={{ border: "2px solid #52c41a" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <BgColorsOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                      <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                        빈 양식으로 시작하기
                      </Title>
                    </div>
                    <Text type="secondary">
                      처음부터 직접 양식을 디자인하고 JSON으로 내보내기
                    </Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <Text>✓ 드래그 앤 드롭 필드 추가</Text>
                      <Text>✓ 조건부 로직 시각적 설정</Text>
                      <Text>✓ 실시간 미리보기</Text>
                      <Text>✓ JSON 내보내기/가져오기</Text>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </Card>

          {/* 학습 예제 */}
          <Card title={<><RocketOutlined /> 🎓 학습 예제</>}>
            <Paragraph>
              Form Builder의 다양한 기능을 학습할 수 있는 예제입니다.
            </Paragraph>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Link href="/survey/basic" style={{ textDecoration: "none" }}>
                <Card hoverable size="small">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
                      기본 양식 예제
                    </Title>
                    <Text type="secondary">
                      텍스트, 이메일, 선택, 체크박스 등 기본 필드 타입
                    </Text>
                  </div>
                </Card>
              </Link>
              
              <Link href="/survey/advanced" style={{ textDecoration: "none" }}>
                <Card hoverable size="small">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
                      고급 양식 예제
                    </Title>
                    <Text type="secondary">
                      조건부 로직, 다중 페이지, 매트릭스, 파일 업로드 등
                    </Text>
                  </div>
                </Card>
              </Link>
            </div>
          </Card>

          {/* 아키텍처 */}
          <Card 
            title={<><ApiOutlined /> 🏗️ Lynx Studio 아키텍처</>}
            style={{ background: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)" }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Title level={5} style={{ color: "#1890ff" }}>
                    <CloudServerOutlined /> Control Plane (SaaS)
                  </Title>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text><Tag color="blue">Form Builder</Tag> ← 현재 모듈</Text>
                    <Text>• LowCode Builder Apps</Text>
                    <Text>• AI Mapping Engine</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Title level={5} style={{ color: "#1890ff" }}>
                    <ApiOutlined /> Data Plane (Edge)
                  </Title>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text>• Gateway Server (고객사 내부망)</Text>
                    <Text>• Legacy System Adapters</Text>
                    <Text>• RPA Bot Engine</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
}
