"use client";

import React from 'react';
import { Card, Row, Col, Typography, Tag, Space } from 'antd';
import { useRouter } from 'next/navigation';
import {
  FileTextOutlined,
  CommentOutlined,
  BulbOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const workflowCategories = [
  {
    id: 'approval',
    title: '전자결재 워크플로우',
    description: '기안, 검토, 합의, 승인 등 전자결재 프로세스를 관리합니다.',
    icon: <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
    color: '#1890ff',
    features: [
      '문서번호 자동 채번',
      '다단계 검토/합의',
      '반려 및 재상신',
      '승인 후 내용 잠금',
      '외부 발송 (시행)',
    ],
    nodeTypes: ['기안', '검토', '합의', '승인', '시행', '접수', '반려'],
    path: '/workflow/approval',
  },
  {
    id: 'board',
    title: '게시판 워크플로우',
    description: '게시물 작성, 검수, 게시, 보관 등 게시판 생명주기를 관리합니다.',
    icon: <CommentOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
    color: '#52c41a',
    features: [
      '게시물 검수',
      '상단 고정',
      '게시 기간 설정',
      '자동 보관',
      '댓글 관리',
    ],
    nodeTypes: ['작성', '검수', '게시', '상단고정', '보관'],
    path: '/workflow/board',
  },
  {
    id: 'proposal',
    title: '업무제안 워크플로우',
    description: '아이디어 제안, 평가, 투표, 실행, 보상까지 관리합니다.',
    icon: <BulbOutlined style={{ fontSize: 48, color: '#faad14' }} />,
    color: '#faad14',
    features: [
      '제안서 평가',
      '다수결 투표',
      '실행 계획 수립',
      '진행 상황 추적',
      '우수 제안 포상',
    ],
    nodeTypes: ['제안', '평가', '투표', '실행', '보상'],
    path: '/workflow/proposal',
  },
  {
    id: 'document',
    title: '문서관리 워크플로우',
    description: '버전 관리, 체크아웃/체크인, 잠금 등 문서 버전을 관리합니다.',
    icon: <FolderOpenOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
    color: '#722ed1',
    features: [
      '자동 버전 생성',
      '체크아웃/체크인',
      '동시 편집 방지',
      '변경 이력 추적',
      '보존 기간 관리',
    ],
    nodeTypes: ['생성', '버전', '체크아웃', '체크인', '잠금', '보관'],
    path: '/workflow/document',
  },
];

export default function WorkflowCategoryPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={2}>워크플로우 빌더 선택</Title>
        <Paragraph style={{ fontSize: 16, color: '#666' }}>
          용도에 맞는 워크플로우 타입을 선택하세요. 각 타입별로 최적화된 노드와 설정을 제공합니다.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {workflowCategories.map((category) => (
          <Col xs={24} sm={12} lg={12} key={category.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                borderLeft: `4px solid ${category.color}`,
              }}
              onClick={() => router.push(category.path)}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {category.icon}
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {category.title}
                    </Title>
                    <Tag color={category.color} style={{ marginTop: 8 }}>
                      {category.id.toUpperCase()}
                    </Tag>
                  </div>
                </div>

                <Paragraph style={{ margin: 0, fontSize: 15 }}>
                  {category.description}
                </Paragraph>

                <div>
                  <Title level={5} style={{ marginBottom: 12 }}>
                    <CheckCircleOutlined /> 주요 기능
                  </Title>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {category.features.map((feature, index) => (
                      <li key={index} style={{ marginBottom: 8 }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Title level={5} style={{ marginBottom: 12 }}>
                    <TeamOutlined /> 사용 가능한 노드
                  </Title>
                  <Space wrap>
                    {category.nodeTypes.map((nodeType, index) => (
                      <Tag key={index} color="default">
                        {nodeType}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f5f5f5', 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <RocketOutlined style={{ color: category.color }} />
                  <span style={{ fontWeight: 500 }}>
                    클릭하여 {category.title} 시작
                  </span>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ 
        marginTop: 48, 
        padding: 24, 
        background: '#e6f7ff', 
        borderRadius: 8,
        border: '1px solid #91d5ff',
      }}>
        <Space direction="vertical" size="small">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <Title level={5} style={{ margin: 0 }}>
              TCCINS Work Lynx Studio
            </Title>
          </div>
          <Paragraph style={{ margin: 0, color: '#666' }}>
            각 워크플로우 빌더는 해당 업무 영역에 특화된 노드 타입과 설정을 제공합니다.
            필요에 따라 여러 워크플로우를 조합하여 사용할 수 있습니다.
          </Paragraph>
        </Space>
      </div>
    </div>
  );
}
