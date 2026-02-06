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
  BranchesOutlined,
  CommentOutlined,
  BulbOutlined,
  FolderOpenOutlined,
  SettingOutlined,
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
            
            <Row gutter={[16, 16]}>
              {/* 지출결의서 시나리오 */}
              <Col xs={24} md={12}>
                <Link href="/approval/select" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ border: "2px solid #1890ff", height: '100%' }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FileTextOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                          지출결의서 시나리오
                        </Title>
                      </div>
                      <Text type="secondary">
                        전자결재 시스템의 실제 결재작성 화면
                      </Text>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Text>✓ 결재 서식 선택 - 폴더 트리 구조</Text>
                        <Text>✓ Progressive Disclosure 적용</Text>
                        <Text>✓ Legacy ERP API 연동</Text>
                        <Text>✓ 조건부 경고 - 예산 초과 알림</Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 게시판 작성 시나리오 */}
              <Col xs={24} md={12}>
                <Link href="/board/promo" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ border: "2px solid #52c41a", height: '100%' }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CommentOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                        <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                          게시판 작성 시나리오
                        </Title>
                      </div>
                      <Text type="secondary">
                        게시판 콘텐츠 작성 및 승인 프로세스
                      </Text>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Text>✓ 게시물 목록 - 그리드 형식</Text>
                        <Text>✓ 게시물 작성 - 리치 에디터</Text>
                        <Text>✓ 카테고리 및 중요도 설정</Text>
                        <Text>✓ 임시저장 및 승인 요청</Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Card>

          {/* 시스템 관리 */}
          <Card title={<><SettingOutlined /> ⚙️ 시스템 관리</>}>
            <Paragraph>
              시스템 전반의 설정을 관리합니다.
            </Paragraph>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Link href="/system/approval-management" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #722ed1" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FileTextOutlined style={{ fontSize: 32, color: "#722ed1" }} />
                        <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
                          📄 전자결재 양식 관리
                        </Title>
                      </div>
                      <Text type="secondary">전자결재 양식 등록, 수정, 삭제 및 Builder 연결</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#722ed1">트리 구조</Tag>
                        <Tag color="#722ed1">결재선</Tag>
                        <Tag color="#722ed1">워크플로우</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12}>
                <Link href="/system/board-management" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #1890ff" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CommentOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                          📋 게시판 관리
                        </Title>
                      </div>
                      <Text type="secondary">게시판 등록, 수정, 삭제 및 FormBuilder 연결</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#1890ff">트리 구조</Tag>
                        <Tag color="#1890ff">기본옵션</Tag>
                        <Tag color="#1890ff">양식 연결</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Card>

          {/* Form Builder */}
          <Card title={<><FormOutlined /> 🛠️ Form Builder (다목적 양식 빌더)</>}>
            <Paragraph>
              카테고리별로 최적화된 양식 빌더로 다양한 업무 양식을 만들어 보세요.
            </Paragraph>
            
            <Row gutter={[16, 16]}>
              {/* 전자결재 양식 */}
              <Col xs={24} sm={12}>
                <Link href="/builder/approval" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #1890ff" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FileTextOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                          📄 전자결재 양식
                        </Title>
                      </div>
                      <Text type="secondary">기안, 품의, 지출결의 등 결재 문서 양식</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#1890ff">결재선</Tag>
                        <Tag color="#1890ff">금액 필드</Tag>
                        <Tag color="#1890ff">첨부문서</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 게시판 양식 */}
              <Col xs={24} sm={12}>
                <Link href="/builder/board" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #52c41a" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CommentOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                        <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                          💬 게시판 양식
                        </Title>
                      </div>
                      <Text type="secondary">공지사항, FAQ, 자료실 게시물 양식</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#52c41a">카테고리</Tag>
                        <Tag color="#52c41a">첨부파일</Tag>
                        <Tag color="#52c41a">공개설정</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 업무제안 양식 */}
              <Col xs={24} sm={12}>
                <Link href="/builder/proposal" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #faad14" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <BulbOutlined style={{ fontSize: 32, color: "#faad14" }} />
                        <Title level={4} style={{ margin: 0, color: "#faad14" }}>
                          💡 업무제안 양식
                        </Title>
                      </div>
                      <Text type="secondary">개선 제안, 아이디어 제출 양식</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#faad14">현황분석</Tag>
                        <Tag color="#faad14">개선방안</Tag>
                        <Tag color="#faad14">기대효과</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 문서관리 양식 */}
              <Col xs={24} sm={12}>
                <Link href="/builder/document" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #722ed1" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FolderOpenOutlined style={{ fontSize: 32, color: "#722ed1" }} />
                        <Title level={4} style={{ margin: 0, color: "#722ed1" }}>
                          📁 문서관리 양식
                        </Title>
                      </div>
                      <Text type="secondary">문서 등록, 메타데이터 입력 양식</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <Tag color="#722ed1">버전관리</Tag>
                        <Tag color="#722ed1">보존기간</Tag>
                        <Tag color="#722ed1">문서분류</Tag>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            </Row>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/builder" style={{ textDecoration: "none" }}>
                <Card hoverable style={{ border: "1px solid #d9d9d9" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <AppstoreAddOutlined style={{ fontSize: 24 }} />
                    <Text strong>모든 카테고리 보기</Text>
                  </div>
                </Card>
              </Link>
            </div>
          </Card>

          {/* Workflow Builder */}
          <Card title={<><BranchesOutlined /> 🔄 Workflow Builder (다목적 프로세스 빌더)</>}>
            <Paragraph>
              React Flow를 사용하여 다양한 업무 프로세스를 시각적으로 디자인하세요.
            </Paragraph>
            
            <Row gutter={[16, 16]}>
              {/* 전자결재 */}
              <Col xs={24} sm={12}>
                <Link href="/workflow" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #1890ff" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
                          전자결재 <Tag color="blue">결재</Tag>
                        </Title>
                      </div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        기안, 검토, 합의, 승인, 시행, 접수
                      </Text>
                      <div style={{ fontSize: 12 }}>
                        <div>✓ 문서번호 자동 채번</div>
                        <div>✓ 다단계 결재선</div>
                        <div>✓ 반려 및 재상신</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 게시판 */}
              <Col xs={24} sm={12}>
                <Link href="/workflow/board" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #52c41a" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CommentOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                        <Title level={5} style={{ margin: 0, color: "#52c41a" }}>
                          게시판 <Tag color="green">콘텐츠</Tag>
                        </Title>
                      </div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        작성, 검수, 게시, 상단고정, 보관
                      </Text>
                      <div style={{ fontSize: 12 }}>
                        <div>✓ 게시물 생명주기 관리</div>
                        <div>✓ 자동 보관 기능</div>
                        <div>✓ 게시 기간 설정</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 업무제안 */}
              <Col xs={24} sm={12}>
                <Link href="/workflow/proposal" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #faad14" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <BulbOutlined style={{ fontSize: 24, color: "#faad14" }} />
                        <Title level={5} style={{ margin: 0, color: "#faad14" }}>
                          업무제안 <Tag color="orange">혁신</Tag>
                        </Title>
                      </div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        제안, 평가, 투표, 실행, 보상
                      </Text>
                      <div style={{ fontSize: 12 }}>
                        <div>✓ 제안서 심사 프로세스</div>
                        <div>✓ 다수결 투표</div>
                        <div>✓ 우수 제안 포상</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>

              {/* 문서관리 */}
              <Col xs={24} sm={12}>
                <Link href="/workflow/document" style={{ textDecoration: "none" }}>
                  <Card hoverable style={{ height: "100%", border: "2px solid #722ed1" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FolderOpenOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                        <Title level={5} style={{ margin: 0, color: "#722ed1" }}>
                          문서관리 <Tag color="purple">버전</Tag>
                        </Title>
                      </div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        생성, 버전, 체크아웃, 체크인, 잠금
                      </Text>
                      <div style={{ fontSize: 12 }}>
                        <div>✓ 자동 버전 관리</div>
                        <div>✓ 동시 편집 방지</div>
                        <div>✓ 변경 이력 추적</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            </Row>

            <div style={{ marginTop: 16, padding: 12, background: "#f0f5ff", borderRadius: 8 }}>
              <Text strong style={{ color: "#1890ff" }}>
                💡 각 워크플로우 타입별로 최적화된 노드와 설정을 제공합니다
              </Text>
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
