"use client";

import React from 'react';
import Link from 'next/link';
import { Card, Typography, Row, Col, Button, Tag } from 'antd';
import {
  FileTextOutlined,
  UserAddOutlined,
  SendOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const workflows = [
  {
    id: 'basic-approval',
    name: '기본 결재 프로세스',
    description: '기안 → 검토 → 승인',
    icon: <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
    steps: ['기안', '부서장 검토', '대표이사 승인', '완료'],
    color: '#1890ff',
    features: [
      '검토자 반려 가능',
      '승인 시 문서번호 채번',
      '승인 후 내용 변경 불가',
    ],
  },
  {
    id: 'agreement-approval',
    name: '합의 포함 결재 프로세스',
    description: '기안 → 검토 → 합의 → 승인',
    icon: <UserAddOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
    steps: ['기안', '부서장 검토', '법무팀 합의', '대표이사 승인', '완료'],
    color: '#52c41a',
    features: [
      '검토자 반려 가능',
      '합의자 반려 불가 (의견만 제시)',
      '승인 시 문서번호 채번',
    ],
  },
  {
    id: 'external-document',
    name: '외부 발송 결재 프로세스',
    description: '기안 → 검토 → 합의 → 시행 → 접수 → 기안 → 검토 → 승인',
    icon: <SendOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
    steps: [
      '외부 발송 기안',
      '검토',
      '합의',
      '시행 (외부 발송)',
      '접수 (회신 수신)',
      '내부 기안',
      '검토',
      '최종 승인',
      '완료',
    ],
    color: '#fa8c16',
    features: [
      '시행 시 문서번호 채번',
      '접수 시 접수번호 채번',
      '접수 후 내부 승인 재시작',
      '최종 승인 시 문서번호 미채번',
    ],
  },
];

export default function WorkflowTemplates() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2}>워크플로우 템플릿 선택</Title>
          <Paragraph style={{ fontSize: 16 }}>
            TCCINS 전자결재 시스템의 표준 결재 프로세스 템플릿입니다.
            <br />
            템플릿을 선택하면 워크플로우 빌더에서 수정할 수 있습니다.
          </Paragraph>
        </div>

        {/* 템플릿 카드 */}
        <Row gutter={[24, 24]}>
          {workflows.map((workflow) => (
            <Col key={workflow.id} xs={24} lg={8}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderTop: `4px solid ${workflow.color}`,
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {workflow.icon}
                  <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                    {workflow.name}
                  </Title>
                  <Text type="secondary">{workflow.description}</Text>
                </div>

                {/* 단계 표시 */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong>프로세스 단계:</Text>
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {workflow.steps.map((step, index) => (
                      <div
                        key={index}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <Tag color={workflow.color}>{index + 1}</Tag>
                        <Text>{step}</Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 특징 */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong>주요 특징:</Text>
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    {workflow.features.map((feature, index) => (
                      <li key={index}>
                        <Text type="secondary">{feature}</Text>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 버튼 */}
                <Link href={`/workflow/template/${workflow.id}`}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<ArrowRightOutlined />}
                    style={{ backgroundColor: workflow.color, borderColor: workflow.color }}
                  >
                    이 템플릿으로 시작하기
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 빈 워크플로우 시작 */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Card>
            <Title level={4}>또는 빈 워크플로우로 시작하기</Title>
            <Paragraph>
              처음부터 직접 워크플로우를 디자인하고 싶다면 빈 캔버스로 시작하세요.
            </Paragraph>
            <Link href="/workflow">
              <Button size="large">빈 워크플로우 시작</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
