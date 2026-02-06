"use client";

import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Tree, Card, Form, Input, Select, Switch, Button, Space, Typography, message,
  Modal, InputNumber, Divider, Tag, Row, Col, Tabs
} from 'antd';
import { 
  HomeOutlined, MailOutlined, FileTextOutlined, CommentOutlined, SettingOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, FolderOpenOutlined,
  SaveOutlined, BranchesOutlined, EyeOutlined, DollarOutlined, TeamOutlined,
  CalendarOutlined, SafetyCertificateOutlined, ShoppingCartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ApprovalFormConfig } from '@/types/approval-form-config';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ApprovalFormManagementPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [selectedGnb, setSelectedGnb] = useState('system');
  const [selectedLnb, setSelectedLnb] = useState('approval-management');
  
  const [forms, setForms] = useState<ApprovalFormConfig[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedForm, setSelectedForm] = useState<ApprovalFormConfig | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['approval-root']);
  
  const [formBuilders, setFormBuilders] = useState<Array<{id: string, name: string}>>([]);
  const [workflows, setWorkflows] = useState<Array<{id: string, name: string}>>([]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [workflowPreviewVisible, setWorkflowPreviewVisible] = useState(false);
  const [selectedWorkflowPreview, setSelectedWorkflowPreview] = useState<any>(null);

  const gnbItems: MenuProps['items'] = [
    { key: 'mail', icon: <MailOutlined />, label: '전자우편' },
    { key: 'approval', icon: <FileTextOutlined />, label: '전자결재' },
    { key: 'board', icon: <CommentOutlined />, label: '게시판' },
    { key: 'system', icon: <SettingOutlined />, label: '시스템 관리' },
  ];

  const lnbItems: MenuProps['items'] = [
    { key: 'approval-management', icon: <FileTextOutlined />, label: '전자결재 양식 관리' },
    { key: 'board-management', icon: <CommentOutlined />, label: '게시판 관리' },
    { key: 'user-management', icon: <TeamOutlined />, label: '사용자 관리' },
  ];

  const handleGnbClick: MenuProps['onClick'] = (e) => {
    setSelectedGnb(e.key);
    if (e.key === 'approval') router.push('/approval/select');
    else if (e.key === 'mail') router.push('/');
    else if (e.key === 'board') router.push('/board/notice');
  };

  const handleLnbClick: MenuProps['onClick'] = (e) => {
    setSelectedLnb(e.key);
    if (e.key === 'board-management') router.push('/system/board-management');
  };

  useEffect(() => {
    fetch('/wlst/configs/approval-forms.json')
      .then(res => res.json())
      .then(data => {
        setForms(data.forms);
        buildTreeData(data.forms);
      })
      .catch(err => {
        console.error('전자결재 양식 로드 실패:', err);
        message.error('전자결재 양식을 불러오는데 실패했습니다.');
      });
  }, []);

  useEffect(() => {
    setFormBuilders([
      { id: 'approval-draft', name: '기안문 양식' },
      { id: 'approval-cooperation', name: '협조문 양식' },
      { id: 'approval-report', name: '보고서 양식' },
      { id: 'approval-leave', name: '근태계 양식' },
      { id: 'approval-certificate', name: '증명서 양식' },
      { id: 'approval-expense', name: '지출결의서 양식' },
      { id: 'approval-purchase', name: '매입결의서 양식' },
    ]);
  }, []);

  useEffect(() => {
    setWorkflows([
      { id: 'approval-workflow', name: '일반 결재 워크플로우' },
      { id: 'simple-approval-workflow', name: '단순 승인 워크플로우' },
      { id: 'finance-workflow', name: '재무 승인 워크플로우' },
    ]);
  }, []);

  const buildTreeData = (formList: ApprovalFormConfig[]) => {
    const buildTree = (parentId: string | null): DataNode[] => {
      return formList
        .filter(form => form.parentId === parentId)
        .sort((a, b) => a.order - b.order)
        .map(form => ({
          key: form.id,
          title: form.name,
          icon: form.isFolder ? <FolderOutlined /> : getIconComponent(form.icon),
          children: form.isFolder ? buildTree(form.id) : undefined,
          isLeaf: !form.isFolder,
        }));
    };
    setTreeData(buildTree(null));
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'FileTextOutlined': return <FileTextOutlined />;
      case 'TeamOutlined': return <TeamOutlined />;
      case 'FormOutlined': return <FileTextOutlined />;
      case 'CalendarOutlined': return <CalendarOutlined />;
      case 'SafetyCertificateOutlined': return <SafetyCertificateOutlined />;
      case 'DollarOutlined': return <DollarOutlined />;
      case 'ShoppingCartOutlined': return <ShoppingCartOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const onTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const formId = selectedKeys[0] as string;
      const formItem = forms.find(f => f.id === formId);
      if (formItem && !formItem.isFolder) {
        setSelectedForm(formItem);
        form.setFieldsValue({
          name: formItem.name,
          code: formItem.code,
          description: formItem.description,
          ...formItem.options,
          ...formItem.approvalLine,
          formBuilderId: formItem.formBuilderId,
          workflowId: formItem.workflowId,
        });
      } else {
        setSelectedForm(null);
        if (formItem?.isFolder) message.info('폴더를 선택하셨습니다. 양식을 선택해주세요.');
      }
    }
  };

  const handleAddForm = () => {
    setModalMode('create');
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      requireAttachment: false,
      allowDraft: true,
      autoNumbering: true,
      retentionPeriod: 10,
      securityLevel: 'INTERNAL',
      allowEmergency: false,
      allowProxy: true,
      allowAgree: false,
      minApprovers: 1,
      maxApprovers: 5,
      allowSkip: false,
      allowReturn: true,
    });
    setIsModalVisible(true);
  };

  const handleEditForm = () => {
    if (!selectedForm) {
      message.warning('수정할 양식을 선택해주세요.');
      return;
    }
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleSaveForm = async () => {
    try {
      const values = await form.validateFields();
      message.success(`양식이 ${modalMode === 'create' ? '등록' : '수정'}되었습니다.`);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDeleteForm = () => {
    if (!selectedForm) {
      message.warning('삭제할 양식을 선택해주세요.');
      return;
    }
    Modal.confirm({
      title: '양식 삭제',
      content: `"${selectedForm.name}" 양식을 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        message.success('양식이 삭제되었습니다.');
      },
    });
  };

  const handleWorkflowPreview = async (workflowId: string) => {
    try {
      const response = await fetch(`/wlst/workflows/${workflowId}.json`);
      if (!response.ok) throw new Error('워크플로우를 불러올 수 없습니다.');
      const data = await response.json();
      setSelectedWorkflowPreview(data);
      setWorkflowPreviewVisible(true);
    } catch (error) {
      message.error('워크플로우 미리보기를 불러오는데 실패했습니다.');
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: '#001529', padding: 0, position: 'fixed', width: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ padding: '0 24px', color: '#fff', fontSize: 20, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => router.push('/')}>TCC INS</div>
          <Menu theme="dark" mode="horizontal" selectedKeys={[selectedGnb]} items={gnbItems} onClick={handleGnbClick} style={{ flex: 1, minWidth: 0 }} />
        </div>
        <div style={{ padding: '0 24px' }}>
          <Button type="text" icon={<HomeOutlined />} onClick={() => router.push('/')} style={{ color: '#fff' }}>홈</Button>
        </div>
      </Header>

      <Layout style={{ marginTop: 64 }}>
        <Sider width={200} style={{ background: '#fff', position: 'fixed', height: 'calc(100vh - 64px)', overflow: 'auto', boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', fontWeight: 'bold', fontSize: 16 }}>시스템 관리</div>
          <Menu mode="inline" selectedKeys={[selectedLnb]} items={lnbItems} onClick={handleLnbClick} style={{ height: '100%', borderRight: 0 }} />
        </Sider>

        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ background: "#f0f2f5", padding: "24px", minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ maxWidth: 1600, margin: "0 auto" }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">시스템 관리 &gt; 전자결재 양식 관리</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>전자결재 양식 관리</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddForm} size="large">양식 추가</Button>
              </div>

              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <Card title={<Space><FolderOpenOutlined /><span>양식 구조</span></Space>} style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>
                    <Tree showIcon defaultExpandAll expandedKeys={expandedKeys} onExpand={setExpandedKeys} selectedKeys={selectedForm ? [selectedForm.id] : []} onSelect={onTreeSelect} treeData={treeData} />
                  </Card>
                </Col>

                <Col xs={24} lg={16}>
                  <Card 
                    title={<Space><EditOutlined /><span>{selectedForm ? `${selectedForm.name} 설정` : '양식을 선택하세요'}</span></Space>}
                    extra={selectedForm && <Space><Button icon={<SaveOutlined />} type="primary" onClick={handleEditForm}>수정</Button><Button icon={<DeleteOutlined />} danger onClick={handleDeleteForm}>삭제</Button></Space>}
                    style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}
                  >
                    {selectedForm ? (
                      <Form form={form} layout="vertical" disabled>
                        <Tabs items={[
                          {
                            key: 'basic',
                            label: '기본 정보',
                            children: (
                              <>
                                <Form.Item label="양식 이름" name="name"><Input /></Form.Item>
                                <Form.Item label="양식 코드" name="code"><Input /></Form.Item>
                                <Form.Item label="설명" name="description"><TextArea rows={3} /></Form.Item>
                                <Form.Item label="문서번호 접두사" name="numberingPrefix"><Input placeholder="예: DFT, EXP" /></Form.Item>
                              </>
                            ),
                          },
                          {
                            key: 'options',
                            label: '기능 옵션',
                            children: (
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item label="활성화" name="isActive" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="첨부 필수" name="requireAttachment" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="임시저장 허용" name="allowDraft" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="자동 채번" name="autoNumbering" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="긴급결재 허용" name="allowEmergency" valuePropName="checked"><Switch /></Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label="대결 허용" name="allowProxy" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="합의 기능" name="allowAgree" valuePropName="checked"><Switch /></Form.Item>
                                  <Form.Item label="보존 기간(년)" name="retentionPeriod"><InputNumber min={1} max={30} style={{ width: '100%' }} /></Form.Item>
                                  <Form.Item label="보안 등급" name="securityLevel">
                                    <Select>
                                      <Option value="PUBLIC">공개</Option>
                                      <Option value="INTERNAL">내부</Option>
                                      <Option value="CONFIDENTIAL">대외비</Option>
                                      <Option value="SECRET">비밀</Option>
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>
                            ),
                          },
                          {
                            key: 'approvalLine',
                            label: '결재선 설정',
                            children: (
                              <>
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item label="최소 결재자 수" name="minApprovers"><InputNumber min={1} max={10} style={{ width: '100%' }} /></Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item label="최대 결재자 수" name="maxApprovers"><InputNumber min={1} max={20} style={{ width: '100%' }} /></Form.Item>
                                  </Col>
                                </Row>
                                <Form.Item label="결재 건너뛰기 허용" name="allowSkip" valuePropName="checked"><Switch /></Form.Item>
                                <Form.Item label="반려 허용" name="allowReturn" valuePropName="checked"><Switch /></Form.Item>
                              </>
                            ),
                          },
                          {
                            key: 'formbuilder',
                            label: 'FormBuilder 연결',
                            children: (
                              <>
                                <Form.Item label="FormBuilder 양식" name="formBuilderId">
                                  <Select placeholder="양식을 선택하세요">
                                    {formBuilders.map(fb => <Option key={fb.id} value={fb.id}>{fb.name}</Option>)}
                                  </Select>
                                </Form.Item>
                                <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                                  <Text type="secondary">💡 FormBuilder에서 생성한 양식을 전자결재 문서에 적용합니다.</Text>
                                </div>
                              </>
                            ),
                          },
                          {
                            key: 'workflow',
                            label: 'Workflow Builder 연결',
                            children: (
                              <>
                                <Form.Item label="워크플로우" name="workflowId">
                                  <Select placeholder="워크플로우를 선택하세요">
                                    {workflows.map(wf => <Option key={wf.id} value={wf.id}>{wf.name}</Option>)}
                                  </Select>
                                </Form.Item>
                                {selectedForm?.workflowId && (
                                  <Button icon={<EyeOutlined />} onClick={() => handleWorkflowPreview(selectedForm.workflowId!)} block style={{ marginBottom: 16 }}>워크플로우 미리보기</Button>
                                )}
                                <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                                  <Text type="secondary">💡 Workflow Builder에서 생성한 결재 프로세스를 적용합니다.</Text>
                                </div>
                              </>
                            ),
                          },
                        ]} />
                      </Form>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                        <FolderOpenOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                        <Text type="secondary" style={{ fontSize: 16 }}>좌측 트리에서 양식을 선택하세요</Text>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* 양식 추가/수정 모달 */}
      <Modal title={modalMode === 'create' ? '새 양식 추가' : '양식 수정'} open={isModalVisible} onOk={handleSaveForm} onCancel={() => setIsModalVisible(false)} width={800} okText="저장" cancelText="취소">
        <Form form={form} layout="vertical">
          <Tabs items={[
            { key: 'basic', label: '기본 정보', children: (
              <>
                <Form.Item label="양식 이름" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="양식 코드" name="code" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item label="설명" name="description"><TextArea rows={3} /></Form.Item>
              </>
            )},
            { key: 'formbuilder', label: 'FormBuilder', children: (
              <Form.Item label="FormBuilder 양식" name="formBuilderId" rules={[{ required: true }]}>
                <Select>{formBuilders.map(fb => <Option key={fb.id} value={fb.id}>{fb.name}</Option>)}</Select>
              </Form.Item>
            )},
            { key: 'workflow', label: 'Workflow', children: (
              <Form.Item label="워크플로우" name="workflowId" rules={[{ required: true }]}>
                <Select>{workflows.map(wf => <Option key={wf.id} value={wf.id}>{wf.name}</Option>)}</Select>
              </Form.Item>
            )},
          ]} />
        </Form>
      </Modal>

      {/* 워크플로우 미리보기 모달 (간략화) */}
      <Modal title="워크플로우 미리보기" open={workflowPreviewVisible} onCancel={() => setWorkflowPreviewVisible(false)} footer={<Button onClick={() => setWorkflowPreviewVisible(false)}>닫기</Button>} width={700}>
        {selectedWorkflowPreview ? (
          <div>
            <Text>노드: {selectedWorkflowPreview.nodes?.length || 0}개</Text><br/>
            <Text>경로: {selectedWorkflowPreview.edges?.length || 0}개</Text>
          </div>
        ) : <Text type="secondary">로딩 중...</Text>}
      </Modal>
    </Layout>
  );
}
