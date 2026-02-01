"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Tag, Typography } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  SendOutlined,
  InboxOutlined,
  BranchesOutlined,
  FlagOutlined,
  CommentOutlined,
  EyeOutlined,
  PushpinOutlined,
  FileProtectOutlined,
  TrophyOutlined,
  LikeOutlined,
  RocketOutlined,
  GiftOutlined,
  HistoryOutlined,
  LockOutlined,
  UnlockOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { WorkflowNodeData } from '@/types/workflow';

const { Text } = Typography;

// 노드 타입별 스타일 및 아이콘
const nodeStyles = {
  start: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <FileTextOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '기안',
  },
  review: {
    background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    icon: <AuditOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '검토',
  },
  agreement: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: <UserAddOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '합의',
  },
  approval: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '승인',
  },
  execution: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: <SendOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '시행',
  },
  receipt: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: <InboxOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '접수',
  },
  reject: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    icon: <CloseCircleOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '반려',
  },
  condition: {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    icon: <BranchesOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '조건 분기',
  },
  end: {
    background: 'linear-gradient(135deg, #e0e0e0 0%, #9e9e9e 100%)',
    icon: <FlagOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '종료',
  },
  // 게시판 전용
  publish: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: <CommentOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '게시',
  },
  moderate: {
    background: 'linear-gradient(135deg, #ffeaa7 0%, #dfe6e9 100%)',
    icon: <EyeOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '검수',
  },
  pin: {
    background: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
    icon: <PushpinOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '상단고정',
  },
  archive: {
    background: 'linear-gradient(135deg, #c7ecee 0%, #a8e6cf 100%)',
    icon: <FileProtectOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '보관',
  },
  // 업무제안 전용
  evaluate: {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    icon: <TrophyOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '평가',
  },
  vote: {
    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    icon: <LikeOutlined style={{ fontSize: 24, color: '#555' }} />,
    color: '#555',
    title: '투표',
  },
  implement: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: <RocketOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '실행',
  },
  reward: {
    background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
    icon: <GiftOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '보상',
  },
  // 문서관리 전용
  version: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <HistoryOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '버전',
  },
  checkout: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: <ExportOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '체크아웃',
  },
  checkin: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: <ImportOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '체크인',
  },
  lock: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    icon: <LockOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '잠금',
  },
  unlock: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: <UnlockOutlined style={{ fontSize: 24, color: '#fff' }} />,
    color: '#fff',
    title: '잠금해제',
  },
};

const CustomNode = memo(({ data, type }: NodeProps) => {
  const nodeData = data as unknown as WorkflowNodeData;
  const style = nodeStyles[type as keyof typeof nodeStyles] || nodeStyles.start;

  return (
    <div style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Top} />
      
      <Card
        style={{
          background: style.background,
          border: 'none',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        bodyStyle={{ padding: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {nodeData.sequence && (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 14,
                color: style.color,
              }}
            >
              {nodeData.sequence}
            </div>
          )}
          {style.icon}
          <div style={{ flex: 1 }}>
            <Text strong style={{ color: style.color, fontSize: 16 }}>
              {nodeData.label}
            </Text>
          </div>
        </div>
        
        {nodeData.description && (
          <Text style={{ color: style.color, fontSize: 12, opacity: 0.9 }}>
            {nodeData.description}
          </Text>
        )}

        {nodeData.approver && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Tag color="blue" style={{ width: 'fit-content' }}>
              {nodeData.approver.position}
            </Tag>
            <Text style={{ color: style.color, fontSize: 12 }}>
              {nodeData.approver.name} ({nodeData.approver.department})
            </Text>
            {nodeData.approver.order && (
              <Tag color="purple" style={{ width: 'fit-content' }}>
                {nodeData.approver.order}번째
              </Tag>
            )}
          </div>
        )}

        {nodeData.reviewConfig && (
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {nodeData.reviewConfig.canReject && (
              <Tag color="red">반려 가능</Tag>
            )}
            {nodeData.reviewConfig.isRequired && (
              <Tag color="orange">필수</Tag>
            )}
            {nodeData.reviewConfig.parallelMode && (
              <Tag color="cyan">병렬</Tag>
            )}
          </div>
        )}

        {nodeData.approvalConfig && (
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {nodeData.approvalConfig.generateDocNumber && (
              <Tag color="green">문서번호 채번</Tag>
            )}
            {nodeData.approvalConfig.lockContent && (
              <Tag color="red">변경 불가</Tag>
            )}
          </div>
        )}

        {nodeData.receiptConfig && (
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {nodeData.receiptConfig.generateReceiptNumber && (
              <Tag color="green">접수번호 채번</Tag>
            )}
            {nodeData.receiptConfig.restartApproval && (
              <Tag color="blue">내부 승인 재시작</Tag>
            )}
          </div>
        )}

        {nodeData.condition && (
          <div style={{ marginTop: 8 }}>
            <Tag color="orange">
              {nodeData.condition.field} {nodeData.condition.operator} {nodeData.condition.value}
            </Tag>
          </div>
        )}

        {nodeData.actionKey && (
          <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Tag color="geekblue">ACTION: {nodeData.actionKey}</Tag>
          </div>
        )}

        {nodeData.statusKey && (
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Tag color="gold">STATUS: {nodeData.statusKey}</Tag>
          </div>
        )}

        {nodeData.allowedRoles && nodeData.allowedRoles.length > 0 && (
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {nodeData.allowedRoles.map((role) => (
              <Tag key={role} color="purple">
                {role}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
