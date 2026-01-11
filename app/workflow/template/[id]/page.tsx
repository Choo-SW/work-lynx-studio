"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { use } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { Button, Drawer, Form, Input, Select, Typography, Space, message, Spin, Tag } from 'antd';
import {
  SaveOutlined,
  FolderOpenOutlined,
  ExportOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CustomNode from '@/components/workflow/CustomNode';
import { WorkflowNodeData, NodeType } from '@/types/workflow';

const { Title } = Typography;
const { TextArea } = Input;

// 커스텀 노드 타입 매핑
const nodeTypes = {
  start: CustomNode,
  review: CustomNode,
  agreement: CustomNode,
  approval: CustomNode,
  execution: CustomNode,
  receipt: CustomNode,
  reject: CustomNode,
  condition: CustomNode,
  end: CustomNode,
};

export default function WorkflowTemplate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [form] = Form.useForm();

  // 템플릿 로드
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch(`/workflows/${resolvedParams.id}.json`);
        if (!response.ok) throw new Error('템플릿을 찾을 수 없습니다');
        
        const template = await response.json();
        setTemplateName(template.name);
        setNodes(template.nodes);
        setEdges(template.edges);
        message.success(`템플릿 "${template.name}"을(를) 로드했습니다`);
      } catch (error) {
        message.error('템플릿 로드 실패: ' + (error as Error).message);
        router.push('/workflow/templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [resolvedParams.id, setNodes, setEdges, router]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    const nodeData = node.data as unknown as WorkflowNodeData;
    form.setFieldsValue({
      label: nodeData.label,
      description: nodeData.description,
      approverName: nodeData.approver?.name,
      approverDepartment: nodeData.approver?.department,
      approverPosition: nodeData.approver?.position,
      approverOrder: nodeData.approver?.order,
      canReject: nodeData.reviewConfig?.canReject,
      isRequired: nodeData.reviewConfig?.isRequired,
      parallelMode: nodeData.reviewConfig?.parallelMode,
      generateDocNumber: nodeData.approvalConfig?.generateDocNumber,
      lockContent: nodeData.approvalConfig?.lockContent,
      docNumberPrefix: nodeData.approvalConfig?.docNumberPrefix,
      generateReceiptNumber: nodeData.receiptConfig?.generateReceiptNumber,
      recipientDepartment: nodeData.receiptConfig?.recipientDepartment,
      restartApproval: nodeData.receiptConfig?.restartApproval,
      conditionField: nodeData.condition?.field,
      conditionOperator: nodeData.condition?.operator,
      conditionValue: nodeData.condition?.value,
    });
    setDrawerOpen(true);
  }, [form]);

  const addNode = useCallback((type: NodeType) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { x: 250, y: (nodes.length) * 150 },
      data: { 
        label: getNodeLabel(type),
        description: '새 노드'
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const handleDrawerSave = useCallback(() => {
    if (!selectedNode) return;

    form.validateFields().then((values) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            const updatedData: Partial<WorkflowNodeData> = {
              label: values.label,
              description: values.description,
            };

            if (values.approverName) {
              updatedData.approver = {
                id: selectedNode.id,
                name: values.approverName,
                department: values.approverDepartment,
                position: values.approverPosition,
                order: values.approverOrder ? parseInt(values.approverOrder) : undefined,
              };
            }

            if (selectedNode.type === 'review' || selectedNode.type === 'agreement') {
              updatedData.reviewConfig = {
                canReject: values.canReject !== undefined ? values.canReject : (selectedNode.type === 'review'),
                isRequired: values.isRequired !== undefined ? values.isRequired : true,
                parallelMode: values.parallelMode || false,
              };
            }

            if (selectedNode.type === 'approval' || selectedNode.type === 'execution') {
              updatedData.approvalConfig = {
                generateDocNumber: values.generateDocNumber !== undefined ? values.generateDocNumber : true,
                lockContent: values.lockContent !== undefined ? values.lockContent : true,
                docNumberPrefix: values.docNumberPrefix,
              };
            }

            if (selectedNode.type === 'receipt') {
              updatedData.receiptConfig = {
                generateReceiptNumber: values.generateReceiptNumber !== undefined ? values.generateReceiptNumber : true,
                recipientDepartment: values.recipientDepartment,
                restartApproval: values.restartApproval !== undefined ? values.restartApproval : true,
              };
            }

            if (values.conditionField) {
              updatedData.condition = {
                field: values.conditionField,
                operator: values.conditionOperator,
                value: values.conditionValue,
              };
            }

            return {
              ...node,
              data: { ...node.data, ...updatedData },
            };
          }
          return node;
        })
      );
      setDrawerOpen(false);
      message.success('노드가 업데이트되었습니다.');
    });
  }, [selectedNode, form, setNodes]);

  const saveWorkflow = useCallback(() => {
    const workflow = {
      name: templateName,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `workflow-${resolvedParams.id}-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    message.success('워크플로우가 저장되었습니다.');
  }, [templateName, nodes, edges, resolvedParams.id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="템플릿을 로드하는 중..." />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ 
        padding: '16px 24px', 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/workflow/templates')}>
            돌아가기
          </Button>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {templateName} <Tag color="blue">템플릿</Tag>
            </Title>
          </div>
        </div>
        <Space>
          <Button icon={<FolderOpenOutlined />}>불러오기</Button>
          <Button icon={<SaveOutlined />} onClick={saveWorkflow}>저장</Button>
          <Button type="primary" icon={<ExportOutlined />}>배포</Button>
        </Space>
      </div>

      {/* 노드 팔레트 */}
      <div style={{ 
        padding: '12px 24px', 
        background: '#fafafa', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('review')}>
          검토
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('agreement')}>
          합의
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('approval')}>
          승인
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('execution')}>
          시행
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('receipt')}>
          접수
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('reject')}>
          반려
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('condition')}>
          조건 분기
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('end')}>
          종료
        </Button>
      </div>

      {/* React Flow 캔버스 */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* 노드 설정 Drawer - 동일한 폼 구조 재사용 */}
      <Drawer
        title="노드 설정"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button type="primary" onClick={handleDrawerSave}>
              저장
            </Button>
          </Space>
        }
      >
        {/* Form 내용은 page.tsx와 동일 */}
        <p>노드를 클릭하여 설정을 변경하세요.</p>
      </Drawer>
    </div>
  );
}

function getNodeLabel(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    start: '기안',
    review: '검토',
    agreement: '합의',
    approval: '승인',
    execution: '시행',
    receipt: '접수',
    reject: '반려',
    condition: '조건 분기',
    end: '종료',
    publish: '게시',
    moderate: '검수',
    pin: '공지 고정',
    archive: '보관',
    evaluate: '평가',
    vote: '투표',
    implement: '시행',
    reward: '보상',
    version: '버전 생성',
    checkout: '체크아웃',
    checkin: '체크인',
    lock: '문서 잠금',
    unlock: '잠금 해제',
  };
  return labels[type];
}
