"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button, Drawer, Form, Input, Select, Typography, Space, message } from 'antd';
import {
  SaveOutlined,
  FolderOpenOutlined,
  ExportOutlined,
  PlusOutlined,
  DeleteOutlined,
  LinkOutlined,
  HomeOutlined,
} from '@ant-design/icons';
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

// 초기 노드 및 엣지
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 0 },
    data: { label: '기안', description: '전자결재 시작' },
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowEditor() {
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

  // 노드 삭제
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    message.success('노드가 삭제되었습니다.');
  }, [setNodes, setEdges]);

  // 엣지(연결선) 삭제
  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    setEdges((eds) => eds.filter((edge) => !edgesToDelete.find((e) => e.id === edge.id)));
  }, [setEdges]);

  // 연결선 클릭 (편집)
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

  // 연결선 추가 (UI로 생성)
  const addEdge = useCallback(() => {
    setSelectedEdge(null);
    edgeForm.resetFields();
    setEdgeDrawerOpen(true);
  }, [edgeForm]);

  // 연결선 저장 (추가 또는 편집)
  const handleEdgeSave = useCallback(() => {
    edgeForm.validateFields().then((values) => {
      if (selectedEdge) {
        // 편집 모드
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
        // 추가 모드
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

  // 연결선 삭제 (개별)
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
            };

            // 담당자 정보
            if (values.approverName) {
              updatedData.approver = {
                id: selectedNode.id,
                name: values.approverName,
                department: values.approverDepartment,
                position: values.approverPosition,
                order: values.approverOrder ? parseInt(values.approverOrder) : undefined,
              };
            }

            // 검토/합의 설정
            if (selectedNode.type === 'review' || selectedNode.type === 'agreement') {
              updatedData.reviewConfig = {
                canReject: values.canReject !== undefined ? values.canReject : (selectedNode.type === 'review'),
                isRequired: values.isRequired !== undefined ? values.isRequired : true,
                parallelMode: values.parallelMode || false,
              };
            }

            // 승인/시행 설정
            if (selectedNode.type === 'approval' || selectedNode.type === 'execution') {
              updatedData.approvalConfig = {
                generateDocNumber: values.generateDocNumber !== undefined ? values.generateDocNumber : true,
                lockContent: values.lockContent !== undefined ? values.lockContent : true,
                docNumberPrefix: values.docNumberPrefix,
              };
            }

            // 접수 설정
            if (selectedNode.type === 'receipt') {
              updatedData.receiptConfig = {
                generateReceiptNumber: values.generateReceiptNumber !== undefined ? values.generateReceiptNumber : true,
                recipientDepartment: values.recipientDepartment,
                restartApproval: values.restartApproval !== undefined ? values.restartApproval : true,
              };
            }

            // 조건 분기
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

  // 워크플로우 순서 자동 계산
  const calculateSequence = useCallback(() => {
    const visited = new Set<string>();
    const sequence = new Map<string, number>();
    let order = 1;

    // 시작 노드 찾기
    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) {
      message.warning('시작 노드(기안)를 먼저 추가하세요.');
      return;
    }

    // DFS로 순서 계산
    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      sequence.set(nodeId, order++);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => dfs(edge.target));
    };

    dfs(startNode.id);

    // 노드에 순서 정보 업데이트
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = node.data as unknown as WorkflowNodeData;
        return {
          ...node,
          data: {
            ...nodeData,
            sequence: sequence.get(node.id) || 0,
          },
        };
      })
    );

    message.success(`워크플로우 순서가 계산되었습니다. (총 ${sequence.size}개 노드)`);
  }, [nodes, edges, setNodes]);

  // 자동 정렬 (세로 방향)
  const autoLayout = useCallback(() => {
    calculateSequence(); // 먼저 순서 계산

    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) return;

    const visited = new Set<string>();
    const positions = new Map<string, { x: number; y: number }>();
    
    const layout = (nodeId: string, x: number, y: number) => {
      if (visited.has(nodeId)) return y;
      visited.add(nodeId);
      positions.set(nodeId, { x, y });

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      let maxY = y;

      if (outgoingEdges.length === 0) {
        return y + 150;
      } else if (outgoingEdges.length === 1) {
        // 단일 경로: 직선으로 배치
        return layout(outgoingEdges[0].target, x, y + 150);
      } else {
        // 분기: 가로로 분산 배치
        const spacing = 300;
        const startX = x - (spacing * (outgoingEdges.length - 1)) / 2;
        
        outgoingEdges.forEach((edge, index) => {
          const branchX = startX + spacing * index;
          const branchY = layout(edge.target, branchX, y + 150);
          maxY = Math.max(maxY, branchY);
        });

        return maxY;
      }
    };

    layout(startNode.id, 400, 50);

    // 위치 업데이트
    setNodes((nds) =>
      nds.map((node) => {
        const pos = positions.get(node.id);
        return pos ? { ...node, position: pos } : node;
      })
    );

    message.success('워크플로우가 자동 정렬되었습니다.');
  }, [nodes, edges, setNodes, calculateSequence]);

  const saveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `workflow-${Date.now()}.json`;

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
      {/* 헤더 */}
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
            워크플로우 빌더
          </Title>
        </Space>
        <Space>
          <Button icon={<LinkOutlined />} onClick={addEdge}>연결선 추가</Button>
          <Button icon={<FolderOpenOutlined />} onClick={loadWorkflow}>불러오기</Button>
          <Button onClick={calculateSequence}>순서 계산</Button>
          <Button onClick={autoLayout}>자동 정렬</Button>
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

      {/* 노드 설정 Drawer */}
      <Drawer
        title="노드 설정"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            {selectedNode && selectedNode.type !== 'start' && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (selectedNode) {
                    deleteNode(selectedNode.id);
                    setDrawerOpen(false);
                  }
                }}
              >
                삭제
              </Button>
            )}
            <Button onClick={() => setDrawerOpen(false)}>취소</Button>
            <Button type="primary" onClick={handleDrawerSave}>
              저장
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="노드 이름"
            name="label"
            rules={[{ required: true, message: '노드 이름을 입력하세요' }]}
          >
            <Input placeholder="예: 부서장 결재" />
          </Form.Item>

          <Form.Item label="설명" name="description">
            <TextArea rows={3} placeholder="노드에 대한 설명을 입력하세요" />
          </Form.Item>

          {/* 검토/합의/승인/시행/접수 노드 - 담당자 정보 */}
          {(selectedNode?.type === 'review' || 
            selectedNode?.type === 'agreement' || 
            selectedNode?.type === 'approval' ||
            selectedNode?.type === 'execution' ||
            selectedNode?.type === 'receipt') && (
            <>
              <Form.Item label="담당자 이름" name="approverName">
                <Input placeholder="예: 홍길동" />
              </Form.Item>
              <Form.Item label="부서" name="approverDepartment">
                <Input placeholder="예: 재무팀" />
              </Form.Item>
              <Form.Item label="직급" name="approverPosition">
                <Select placeholder="직급 선택">
                  <Select.Option value="사원">사원</Select.Option>
                  <Select.Option value="주임">주임</Select.Option>
                  <Select.Option value="대리">대리</Select.Option>
                  <Select.Option value="과장">과장</Select.Option>
                  <Select.Option value="차장">차장</Select.Option>
                  <Select.Option value="부장">부장</Select.Option>
                  <Select.Option value="이사">이사</Select.Option>
                  <Select.Option value="상무">상무</Select.Option>
                  <Select.Option value="전무">전무</Select.Option>
                  <Select.Option value="대표이사">대표이사</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="순서 (다중 담당자)" name="approverOrder">
                <Input type="number" placeholder="1, 2, 3..." />
              </Form.Item>
            </>
          )}

          {/* 검토/합의 노드 - 추가 설정 */}
          {(selectedNode?.type === 'review' || selectedNode?.type === 'agreement') && (
            <>
              <Form.Item label="반려 가능 여부" name="canReject" valuePropName="checked">
                <Select defaultValue={selectedNode?.type === 'review' ? true : false}>
                  <Select.Option value={true}>가능</Select.Option>
                  <Select.Option value={false}>불가능</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="필수 여부" name="isRequired" valuePropName="checked">
                <Select defaultValue={true}>
                  <Select.Option value={true}>필수</Select.Option>
                  <Select.Option value={false}>선택</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="병렬 처리" name="parallelMode" valuePropName="checked">
                <Select defaultValue={false}>
                  <Select.Option value={true}>병렬 (동시 진행)</Select.Option>
                  <Select.Option value={false}>순차 (순서대로)</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* 승인/시행 노드 - 문서 설정 */}
          {(selectedNode?.type === 'approval' || selectedNode?.type === 'execution') && (
            <>
              <Form.Item label="문서번호 채번" name="generateDocNumber" valuePropName="checked">
                <Select defaultValue={true}>
                  <Select.Option value={true}>채번함</Select.Option>
                  <Select.Option value={false}>채번 안함</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="내용 변경 잠금" name="lockContent" valuePropName="checked">
                <Select defaultValue={true}>
                  <Select.Option value={true}>잠금 (수정 불가)</Select.Option>
                  <Select.Option value={false}>허용 (수정 가능)</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="문서번호 접두사" name="docNumberPrefix">
                <Input placeholder="예: APPR-2024-" />
              </Form.Item>
            </>
          )}

          {/* 접수 노드 - 접수 설정 */}
          {selectedNode?.type === 'receipt' && (
            <>
              <Form.Item label="접수번호 채번" name="generateReceiptNumber" valuePropName="checked">
                <Select defaultValue={true}>
                  <Select.Option value={true}>채번함</Select.Option>
                  <Select.Option value={false}>채번 안함</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="수신 부서" name="recipientDepartment">
                <Input placeholder="예: 총무팀" />
              </Form.Item>
              <Form.Item label="내부 승인 재시작" name="restartApproval" valuePropName="checked">
                <Select defaultValue={true}>
                  <Select.Option value={true}>재시작함</Select.Option>
                  <Select.Option value={false}>재시작 안함</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {selectedNode?.type === 'condition' && (
            <>
              <Form.Item label="조건 필드" name="conditionField">
                <Select placeholder="필드 선택">
                  <Select.Option value="amount">금액</Select.Option>
                  <Select.Option value="department">부서</Select.Option>
                  <Select.Option value="position">직급</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="연산자" name="conditionOperator">
                <Select placeholder="연산자 선택">
                  <Select.Option value=">">{'>'} 초과</Select.Option>
                  <Select.Option value=">=">{'≥'} 이상</Select.Option>
                  <Select.Option value="<">{'<'} 미만</Select.Option>
                  <Select.Option value="<=">{'≤'} 이하</Select.Option>
                  <Select.Option value="=">{'='} 같음</Select.Option>
                  <Select.Option value="!=">{'≠'} 다름</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="조건 값" name="conditionValue">
                <Input placeholder="예: 5000000" />
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>

      {/* 연결선 추가/편집 Drawer */}
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
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteEdge(selectedEdge.id)}
              >
                삭제
              </Button>
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
          <Form.Item 
            label="시작 노드" 
            name="source"
            rules={[{ required: true, message: '시작 노드를 선택해주세요' }]}
          >
            <Select placeholder="시작 노드 선택">
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

          <Form.Item 
            label="끝 노드" 
            name="target"
            rules={[{ required: true, message: '끝 노드를 선택해주세요' }]}
          >
            <Select placeholder="끝 노드 선택">
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

          <Form.Item label="라벨 (선택사항)" name="label">
            <Input placeholder="예: 승인, 500만원 초과" />
          </Form.Item>

          <Form.Item label="애니메이션" name="animated" valuePropName="checked">
            <Select defaultValue={false}>
              <Select.Option value={true}>활성화 (흐르는 점선)</Select.Option>
              <Select.Option value={false}>비활성화</Select.Option>
            </Select>
          </Form.Item>
        </Form>
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
