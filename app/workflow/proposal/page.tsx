"use client";

import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge as addReactFlowEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from '@xyflow/react';
import { Button, Drawer, Form, Input, Select, Typography, Space, message, InputNumber } from 'antd';
import {
  SaveOutlined,
  ExportOutlined,
  PlusOutlined,
  DeleteOutlined,
  LinkOutlined,
  HomeOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CustomNode from '@/components/workflow/CustomNode';
import { WorkflowNodeData, NodeType } from '@/types/workflow';

const { Title } = Typography;
const { TextArea } = Input;

// 커스텀 노드 타입 매핑 (업무제안용)
const nodeTypes = {
  start: CustomNode,
  evaluate: CustomNode,
  vote: CustomNode,
  implement: CustomNode,
  reward: CustomNode,
  condition: CustomNode,
  end: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 0 },
    data: { label: '제안서 작성', description: '업무 개선 제안' },
  },
];

const initialEdges: Edge[] = [];

export default function ProposalWorkflowEditor() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [edgeDrawerOpen, setEdgeDrawerOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeForm] = Form.useForm();
  const [form] = Form.useForm();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addReactFlowEdge(params, eds)),
    [setEdges]
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    message.success('노드가 삭제되었습니다.');
  }, [setNodes, setEdges]);

  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    setEdges((eds) => eds.filter((edge) => !edgesToDelete.find((e) => e.id === edge.id)));
  }, [setEdges]);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    edgeForm.setFieldsValue({
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated || false,
    });
    setEdgeDrawerOpen(true);
  }, [edgeForm]);

  const addEdge = useCallback(() => {
    setSelectedEdge(null);
    edgeForm.resetFields();
    setEdgeDrawerOpen(true);
  }, [edgeForm]);

  const handleEdgeSave = useCallback(() => {
    edgeForm.validateFields().then((values) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((edge) =>
            edge.id === selectedEdge.id
              ? {
                  ...edge,
                  source: values.source,
                  target: values.target,
                  label: values.label,
                  animated: values.animated || false,
                }
              : edge
          )
        );
        message.success('연결선이 수정되었습니다.');
      } else {
        const newEdge: Edge = {
          id: `e${values.source}-${values.target}-${Date.now()}`,
          source: values.source,
          target: values.target,
          label: values.label,
          type: 'default',
          animated: values.animated || false,
        };
        setEdges((eds) => [...eds, newEdge]);
        message.success('연결선이 추가되었습니다.');
      }
      setEdgeDrawerOpen(false);
      setSelectedEdge(null);
    }).catch(() => {
      message.error('모든 필드를 입력해주세요.');
    });
  }, [edgeForm, selectedEdge, setEdges]);

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setEdgeDrawerOpen(false);
    setSelectedEdge(null);
    message.success('연결선이 삭제되었습니다.');
  }, [setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    const nodeData = node.data as unknown as WorkflowNodeData;
    form.setFieldsValue({
      label: nodeData.label,
      description: nodeData.description,
      evaluators: nodeData.proposalConfig?.evaluators?.join(','),
      minScore: nodeData.proposalConfig?.minScore,
      votingPeriod: nodeData.proposalConfig?.votingPeriod,
      rewardAmount: nodeData.proposalConfig?.rewardAmount,
      implementDeadline: nodeData.proposalConfig?.implementDeadline,
    });
    setDrawerOpen(true);
  }, [form]);

  const addNode = useCallback((type: NodeType) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
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
              proposalConfig: {
                evaluators: values.evaluators ? values.evaluators.split(',').map((e: string) => e.trim()) : [],
                minScore: values.minScore,
                votingPeriod: values.votingPeriod,
                rewardAmount: values.rewardAmount,
                implementDeadline: values.implementDeadline,
              },
            };

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
      category: 'proposal',
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `proposal-workflow-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    message.success('워크플로우가 저장되었습니다.');
  }, [nodes, edges]);

  // 워크플로우 불러오기
  const loadWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const workflow = JSON.parse(result);
          
          if (workflow.nodes && workflow.edges) {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
            message.success('워크플로우를 불러왔습니다.');
          } else {
            message.error('올바르지 않은 워크플로우 파일입니다.');
          }
        } catch (error) {
          console.error('파일 로드 오류:', error);
          message.error('파일을 읽을 수 없습니다.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '16px 24px', 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space>
          <Button icon={<HomeOutlined />} onClick={() => router.push('/')}>
            홈으로
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            업무제안 워크플로우 빌더
          </Title>
        </Space>
        <Space>
          <Button icon={<LinkOutlined />} onClick={addEdge}>연결선 추가</Button>
          <Button icon={<FolderOpenOutlined />} onClick={loadWorkflow}>불러오기</Button>
          <Button icon={<SaveOutlined />} onClick={saveWorkflow}>저장</Button>
          <Button type="primary" icon={<ExportOutlined />}>배포</Button>
        </Space>
      </div>

      <div style={{ 
        padding: '12px 24px', 
        background: '#fafafa', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('evaluate')}>
          평가
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('vote')}>
          투표
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('implement')}>
          실행
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('reward')}>
          보상
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('condition')}>
          조건 분기
        </Button>
        <Button size="small" icon={<PlusOutlined />} onClick={() => addNode('end')}>
          종료
        </Button>
      </div>

      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Delete"
          connectionMode={ConnectionMode.Loose}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <Drawer
        title="노드 설정"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            {selectedNode && selectedNode.type !== 'start' && (
              <Button danger icon={<DeleteOutlined />} onClick={() => {
                if (selectedNode) {
                  deleteNode(selectedNode.id);
                  setDrawerOpen(false);
                }
              }}>삭제</Button>
            )}
            <Button onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button type="primary" onClick={handleDrawerSave}>저장</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="노드 이름" name="label" rules={[{ required: true }]}>
            <Input placeholder="예: 위원회 평가" />
          </Form.Item>
          <Form.Item label="설명" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="평가자 목록" name="evaluators">
            <TextArea rows={2} placeholder="쉼표로 구분: 홍길동, 김철수" />
          </Form.Item>
          <Form.Item label="최소 점수" name="minScore">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="투표 기간 (일)" name="votingPeriod">
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="포상금 (원)" name="rewardAmount">
            <InputNumber min={0} step={10000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="실행 기한" name="implementDeadline">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={selectedEdge ? "연결선 편집" : "연결선 추가"}
        placement="right"
        width={400}
        open={edgeDrawerOpen}
        onClose={() => {
          setEdgeDrawerOpen(false);
          setSelectedEdge(null);
        }}
        extra={
          <Space>
            {selectedEdge && (
              <Button danger icon={<DeleteOutlined />} onClick={() => deleteEdge(selectedEdge.id)}>삭제</Button>
            )}
            <Button onClick={() => {
              setEdgeDrawerOpen(false);
              setSelectedEdge(null);
            }}>취소</Button>
            <Button type="primary" onClick={handleEdgeSave}>
              {selectedEdge ? "수정" : "추가"}
            </Button>
          </Space>
        }
      >
        <Form form={edgeForm} layout="vertical">
          <Form.Item label="시작 노드" name="source" rules={[{ required: true }]}>
            <Select>
              {nodes.map((node) => {
                const nodeData = node.data as unknown as WorkflowNodeData;
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {nodeData.label} (ID: {node.id})
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="끝 노드" name="target" rules={[{ required: true }]}>
            <Select>
              {nodes.map((node) => {
                const nodeData = node.data as unknown as WorkflowNodeData;
                return (
                  <Select.Option key={node.id} value={node.id}>
                    {nodeData.label} (ID: {node.id})
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="라벨" name="label">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

function getNodeLabel(type: NodeType): string {
  const labels: Record<string, string> = {
    start: '제안서 작성',
    evaluate: '평가',
    vote: '투표',
    implement: '실행',
    reward: '보상',
    condition: '조건 분기',
    end: '종료',
  };
  return labels[type] || type;
}
