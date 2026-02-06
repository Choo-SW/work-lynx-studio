"use client";

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Tree, 
  Card, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Button, 
  Space, 
  Typography, 
  message,
  Modal,
  InputNumber,
  Divider,
  Tag,
  Row,
  Col,
  Tabs
} from 'antd';
import { 
  HomeOutlined,
  MailOutlined,
  FileTextOutlined,
  CommentOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  NotificationOutlined,
  TeamOutlined,
  BulbOutlined,
  SaveOutlined,
  CloseOutlined,
  BranchesOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { BoardConfig, BoardTreeNode } from '@/types/board-config';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function BoardManagementPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [selectedGnb, setSelectedGnb] = useState('system');
  const [selectedLnb, setSelectedLnb] = useState('board-management');
  
  // 게시판 데이터
  const [boards, setBoards] = useState<BoardConfig[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardConfig | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['board-root']);
  
  // FormBuilder 목록
  const [formBuilders, setFormBuilders] = useState<Array<{id: string, name: string}>>([]);
  
  // 워크플로우 목록
  const [workflows, setWorkflows] = useState<Array<{id: string, name: string}>>([]);
  
  // 모달 상태
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [workflowPreviewVisible, setWorkflowPreviewVisible] = useState(false);
  const [selectedWorkflowPreview, setSelectedWorkflowPreview] = useState<any>(null);

  // GNB 메뉴 항목
  const gnbItems: MenuProps['items'] = [
    {
      key: 'mail',
      icon: <MailOutlined />,
      label: '전자우편',
    },
    {
      key: 'approval',
      icon: <FileTextOutlined />,
      label: '전자결재',
    },
    {
      key: 'board',
      icon: <CommentOutlined />,
      label: '게시판',
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '시스템 관리',
    },
  ];

  // LNB 메뉴 항목
  const lnbItems: MenuProps['items'] = [
    {
      key: 'approval-management',
      icon: <FileTextOutlined />,
      label: '전자결재 양식 관리',
    },
    {
      key: 'board-management',
      icon: <CommentOutlined />,
      label: '게시판 관리',
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: '사용자 관리',
    },
    {
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: '시스템 설정',
    },
  ];

  const handleGnbClick: MenuProps['onClick'] = (e) => {
    setSelectedGnb(e.key);
    if (e.key === 'approval') {
      router.push('/approval/select');
    } else if (e.key === 'mail') {
      router.push('/');
    } else if (e.key === 'board') {
      router.push('/board/notice');
    }
  };

  const handleLnbClick: MenuProps['onClick'] = (e) => {
    setSelectedLnb(e.key);
    if (e.key === 'approval-management') {
      router.push('/system/approval-management');
    }
  };

  // 게시판 데이터 로드
  useEffect(() => {
    fetch('/wlst/configs/boards.json')
      .then(res => res.json())
      .then(data => {
        setBoards(data.boards);
        buildTreeData(data.boards);
      })
      .catch(err => {
        console.error('게시판 설정 로드 실패:', err);
        message.error('게시판 설정을 불러오는데 실패했습니다.');
      });
  }, []);

  // FormBuilder 목록 로드 (임시)
  useEffect(() => {
    setFormBuilders([
      { id: 'board-basic', name: '게시판 기본 양식' },
      { id: 'board-advanced', name: '게시판 고급 양식' },
      { id: 'board-simple', name: '게시판 간단 양식' },
    ]);
  }, []);

  // 워크플로우 목록 로드 (임시)
  useEffect(() => {
    setWorkflows([
      { id: 'board-workflow', name: '게시판 승인 워크플로우' },
      { id: 'simple-workflow', name: '단순 승인 워크플로우' },
      { id: 'multi-step-workflow', name: '다단계 승인 워크플로우' },
    ]);
  }, []);

  // 워크플로우 미리보기
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

  // 트리 데이터 구축
  const buildTreeData = (boardList: BoardConfig[]) => {
    const buildTree = (parentId: string | null): DataNode[] => {
      return boardList
        .filter(board => board.parentId === parentId)
        .sort((a, b) => a.order - b.order)
        .map(board => ({
          key: board.id,
          title: board.name,
          icon: board.isFolder ? <FolderOutlined /> : getIconComponent(board.icon),
          children: board.isFolder ? buildTree(board.id) : undefined,
          isLeaf: !board.isFolder,
        }));
    };

    const tree = buildTree(null);
    setTreeData(tree);
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'NotificationOutlined':
        return <NotificationOutlined />;
      case 'BulbOutlined':
        return <BulbOutlined />;
      case 'TeamOutlined':
        return <TeamOutlined />;
      default:
        return <CommentOutlined />;
    }
  };

  // 트리 노드 선택
  const onTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const boardId = selectedKeys[0] as string;
      const board = boards.find(b => b.id === boardId);
      if (board && !board.isFolder) {
        setSelectedBoard(board);
        form.setFieldsValue({
          name: board.name,
          code: board.code,
          description: board.description,
          icon: board.icon,
          ...board.options,
          categories: board.options.categories?.join(', '),
          formBuilderId: board.formBuilderId,
          workflowId: board.workflowId,
          readPermissions: board.permissions.read.join(', '),
          writePermissions: board.permissions.write.join(', '),
          managePermissions: board.permissions.manage.join(', '),
        });
      } else if (board && board.isFolder) {
        setSelectedBoard(null);
        message.info('폴더를 선택하셨습니다. 게시판을 선택해주세요.');
      }
    }
  };

  // 새 게시판 추가
  const handleAddBoard = () => {
    setModalMode('create');
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      allowAnonymous: false,
      requireApproval: false,
      allowAttachment: true,
      maxAttachmentSize: 10,
      maxAttachmentCount: 5,
      allowComment: true,
      allowReply: true,
      useCategory: false,
      useTags: false,
      useNotification: false,
    });
    setIsModalVisible(true);
  };

  // 게시판 수정
  const handleEditBoard = () => {
    if (!selectedBoard) {
      message.warning('수정할 게시판을 선택해주세요.');
      return;
    }
    setModalMode('edit');
    setIsModalVisible(true);
  };

  // 게시판 저장
  const handleSaveBoard = async () => {
    try {
      const values = await form.validateFields();
      
      const newBoard: BoardConfig = {
        id: modalMode === 'create' ? `board-${Date.now()}` : selectedBoard!.id,
        name: values.name,
        code: values.code,
        description: values.description,
        icon: values.icon,
        isFolder: false,
        parentId: 'board-root',
        options: {
          isActive: values.isActive,
          allowAnonymous: values.allowAnonymous,
          requireApproval: values.requireApproval,
          allowAttachment: values.allowAttachment,
          maxAttachmentSize: values.maxAttachmentSize,
          maxAttachmentCount: values.maxAttachmentCount,
          allowComment: values.allowComment,
          allowReply: values.allowReply,
          useCategory: values.useCategory,
          categories: values.categories ? values.categories.split(',').map((c: string) => c.trim()) : [],
          useTags: values.useTags,
          useNotification: values.useNotification,
        },
        formBuilderId: values.formBuilderId,
        formBuilderName: formBuilders.find(f => f.id === values.formBuilderId)?.name,
        workflowId: values.workflowId,
        workflowName: workflows.find(w => w.id === values.workflowId)?.name,
        permissions: {
          read: values.readPermissions ? values.readPermissions.split(',').map((p: string) => p.trim()) : ['ALL'],
          write: values.writePermissions ? values.writePermissions.split(',').map((p: string) => p.trim()) : ['USER'],
          manage: values.managePermissions ? values.managePermissions.split(',').map((p: string) => p.trim()) : ['ADMIN'],
        },
        createdAt: modalMode === 'create' ? new Date().toISOString() : selectedBoard!.createdAt,
        createdBy: modalMode === 'create' ? 'admin' : selectedBoard!.createdBy,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin',
        order: modalMode === 'create' ? boards.length : selectedBoard!.order,
      };

      let updatedBoards;
      if (modalMode === 'create') {
        updatedBoards = [...boards, newBoard];
      } else {
        updatedBoards = boards.map(b => b.id === newBoard.id ? newBoard : b);
      }

      setBoards(updatedBoards);
      buildTreeData(updatedBoards);
      setSelectedBoard(newBoard);
      setIsModalVisible(false);
      
      message.success(`게시판이 ${modalMode === 'create' ? '등록' : '수정'}되었습니다.`);
      
      // 실제로는 서버에 저장해야 함
      console.log('Save board:', newBoard);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 게시판 삭제
  const handleDeleteBoard = () => {
    if (!selectedBoard) {
      message.warning('삭제할 게시판을 선택해주세요.');
      return;
    }

    Modal.confirm({
      title: '게시판 삭제',
      content: `"${selectedBoard.name}" 게시판을 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        const updatedBoards = boards.filter(b => b.id !== selectedBoard.id);
        setBoards(updatedBoards);
        buildTreeData(updatedBoards);
        setSelectedBoard(null);
        form.resetFields();
        message.success('게시판이 삭제되었습니다.');
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* GNB */}
      <Header style={{ 
        background: '#001529', 
        padding: 0,
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            padding: '0 24px', 
            color: '#fff', 
            fontSize: 20, 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/')}>
            TCC INS
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedGnb]}
            items={gnbItems}
            onClick={handleGnbClick}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        <div style={{ padding: '0 24px' }}>
          <Button 
            type="text" 
            icon={<HomeOutlined />} 
            onClick={() => router.push('/')}
            style={{ color: '#fff' }}
          >
            홈
          </Button>
        </div>
      </Header>

      <Layout style={{ marginTop: 64 }}>
        {/* LNB */}
        <Sider 
          width={200} 
          style={{ 
            background: '#fff',
            position: 'fixed',
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid #f0f0f0',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            시스템 관리
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedLnb]}
            items={lnbItems}
            onClick={handleLnbClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        {/* Main Content */}
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ background: "#f0f2f5", padding: "24px", minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ maxWidth: 1600, margin: "0 auto" }}>
              {/* Breadcrumb */}
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  시스템 관리 &gt; 게시판 관리
                </Text>
              </div>

              {/* Page Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 24 
              }}>
                <Title level={2} style={{ margin: 0 }}>
                  게시판 관리
                </Title>
                
                <Space size="middle">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBoard}
                    size="large"
                  >
                    게시판 추가
                  </Button>
                </Space>
              </div>

              {/* Main Layout */}
              <Row gutter={24}>
                {/* 좌측: 게시판 트리 */}
                <Col xs={24} lg={8}>
                  <Card 
                    title={
                      <Space>
                        <FolderOpenOutlined />
                        <span>게시판 구조</span>
                      </Space>
                    }
                    style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}
                  >
                    <Tree
                      showIcon
                      defaultExpandAll
                      expandedKeys={expandedKeys}
                      onExpand={setExpandedKeys}
                      selectedKeys={selectedBoard ? [selectedBoard.id] : []}
                      onSelect={onTreeSelect}
                      treeData={treeData}
                    />
                  </Card>
                </Col>

                {/* 우측: 게시판 상세 설정 */}
                <Col xs={24} lg={16}>
                  <Card 
                    title={
                      <Space>
                        <EditOutlined />
                        <span>{selectedBoard ? `${selectedBoard.name} 설정` : '게시판을 선택하세요'}</span>
                      </Space>
                    }
                    extra={
                      selectedBoard && (
                        <Space>
                          <Button
                            icon={<SaveOutlined />}
                            type="primary"
                            onClick={handleEditBoard}
                          >
                            수정
                          </Button>
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDeleteBoard}
                          >
                            삭제
                          </Button>
                        </Space>
                      )
                    }
                    style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}
                  >
                    {selectedBoard ? (
                      <Form
                        form={form}
                        layout="vertical"
                        disabled
                      >
                        <Tabs
                          items={[
                            {
                              key: 'basic',
                              label: '기본 정보',
                              children: (
                                <>
                                  <Form.Item label="게시판 이름" name="name">
                                    <Input />
                                  </Form.Item>
                                  <Form.Item label="게시판 코드" name="code">
                                    <Input />
                                  </Form.Item>
                                  <Form.Item label="설명" name="description">
                                    <TextArea rows={3} />
                                  </Form.Item>
                                  <Form.Item label="아이콘" name="icon">
                                    <Select>
                                      <Option value="NotificationOutlined">알림 아이콘</Option>
                                      <Option value="BulbOutlined">전구 아이콘</Option>
                                      <Option value="TeamOutlined">팀 아이콘</Option>
                                      <Option value="CommentOutlined">댓글 아이콘</Option>
                                    </Select>
                                  </Form.Item>
                                </>
                              ),
                            },
                            {
                              key: 'options',
                              label: '기능 옵션',
                              children: (
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <Form.Item label="활성화" name="isActive" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="익명 허용" name="allowAnonymous" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="승인 필요" name="requireApproval" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="첨부파일 허용" name="allowAttachment" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="댓글 허용" name="allowComment" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="답글 허용" name="allowReply" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item label="카테고리 사용" name="useCategory" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="카테고리 목록" name="categories">
                                      <Input placeholder="쉼표로 구분" />
                                    </Form.Item>
                                    <Form.Item label="태그 사용" name="useTags" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="알림 사용" name="useNotification" valuePropName="checked">
                                      <Switch />
                                    </Form.Item>
                                    <Form.Item label="최대 첨부파일 크기(MB)" name="maxAttachmentSize">
                                      <InputNumber min={1} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label="최대 첨부파일 개수" name="maxAttachmentCount">
                                      <InputNumber min={1} max={20} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ),
                            },
                            {
                              key: 'form',
                              label: 'FormBuilder 연결',
                              children: (
                                <>
                                  <Form.Item label="FormBuilder 양식" name="formBuilderId">
                                    <Select placeholder="양식을 선택하세요">
                                      {formBuilders.map(fb => (
                                        <Option key={fb.id} value={fb.id}>{fb.name}</Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                                    <Text type="secondary">
                                      💡 FormBuilder에서 생성한 양식을 게시판의 Body 영역에 적용합니다.
                                    </Text>
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
                                    <Select 
                                      placeholder="워크플로우를 선택하세요"
                                      dropdownRender={(menu) => (
                                        <>
                                          {menu}
                                          <Divider style={{ margin: '8px 0' }} />
                                          <div style={{ padding: '8px', textAlign: 'center' }}>
                                            <Button 
                                              type="link" 
                                              icon={<BranchesOutlined />}
                                              onClick={() => window.open('/workflow', '_blank')}
                                            >
                                              새 워크플로우 만들기
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    >
                                      {workflows.map(wf => (
                                        <Option key={wf.id} value={wf.id}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{wf.name}</span>
                                            <Button
                                              type="text"
                                              size="small"
                                              icon={<EyeOutlined />}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleWorkflowPreview(wf.id);
                                              }}
                                            >
                                              미리보기
                                            </Button>
                                          </div>
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                  
                                  {selectedBoard?.workflowId && (
                                    <div style={{ marginBottom: 16 }}>
                                      <Button
                                        icon={<EyeOutlined />}
                                        onClick={() => handleWorkflowPreview(selectedBoard.workflowId!)}
                                        block
                                      >
                                        현재 워크플로우 미리보기
                                      </Button>
                                    </div>
                                  )}
                                  
                                  <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                                    <Text type="secondary">
                                      💡 Workflow Builder에서 생성한 승인 프로세스를 게시판에 적용합니다.
                                    </Text>
                                  </div>
                                  
                                  {/* 워크플로우 상태 노드 정보 */}
                                  {selectedBoard?.workflowId && (
                                    <Card size="small" title="워크플로우 정보" style={{ marginTop: 16 }}>
                                      <Space direction="vertical" style={{ width: '100%' }}>
                                        <div>
                                          <Text strong>워크플로우 ID: </Text>
                                          <Text code>{selectedBoard.workflowId}</Text>
                                        </div>
                                        <div>
                                          <Text strong>워크플로우 이름: </Text>
                                          <Text>{selectedBoard.workflowName}</Text>
                                        </div>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <div>
                                          <Text type="secondary" style={{ fontSize: 12 }}>
                                            게시물 작성 시 이 워크플로우의 승인 프로세스가 적용됩니다.
                                          </Text>
                                        </div>
                                      </Space>
                                    </Card>
                                  )}
                                </>
                              ),
                            },
                            {
                              key: 'permission',
                              label: '권한 설정',
                              children: (
                                <>
                                  <Form.Item label="읽기 권한" name="readPermissions">
                                    <Input placeholder="예: ALL, USER, ADMIN (쉼표로 구분)" />
                                  </Form.Item>
                                  <Form.Item label="쓰기 권한" name="writePermissions">
                                    <Input placeholder="예: USER, ADMIN (쉼표로 구분)" />
                                  </Form.Item>
                                  <Form.Item label="관리 권한" name="managePermissions">
                                    <Input placeholder="예: ADMIN (쉼표로 구분)" />
                                  </Form.Item>
                                  <div style={{ padding: 12, background: '#fff7e6', borderRadius: 8 }}>
                                    <Text type="secondary">
                                      ⚠️ 권한 설정은 게시판의 보안에 영향을 미칩니다. 신중하게 설정하세요.
                                    </Text>
                                  </div>
                                </>
                              ),
                            },
                          ]}
                        />
                      </Form>
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: '#999'
                      }}>
                        <FolderOpenOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                        <Text type="secondary" style={{ fontSize: 16 }}>
                          좌측 트리에서 게시판을 선택하세요
                        </Text>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* 게시판 추가/수정 모달 */}
      <Modal
        title={modalMode === 'create' ? '새 게시판 추가' : '게시판 수정'}
        open={isModalVisible}
        onOk={handleSaveBoard}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="저장"
        cancelText="취소"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Tabs
            items={[
              {
                key: 'basic',
                label: '기본 정보',
                children: (
                  <>
                    <Form.Item 
                      label="게시판 이름" 
                      name="name"
                      rules={[{ required: true, message: '게시판 이름을 입력하세요' }]}
                    >
                      <Input placeholder="예: 공지사항" />
                    </Form.Item>
                    <Form.Item 
                      label="게시판 코드" 
                      name="code"
                      rules={[{ required: true, message: '게시판 코드를 입력하세요' }]}
                    >
                      <Input placeholder="예: NOTICE (영문 대문자)" />
                    </Form.Item>
                    <Form.Item label="설명" name="description">
                      <TextArea rows={3} placeholder="게시판에 대한 설명을 입력하세요" />
                    </Form.Item>
                    <Form.Item label="아이콘" name="icon">
                      <Select placeholder="아이콘을 선택하세요">
                        <Option value="NotificationOutlined">알림 아이콘</Option>
                        <Option value="BulbOutlined">전구 아이콘</Option>
                        <Option value="TeamOutlined">팀 아이콘</Option>
                        <Option value="CommentOutlined">댓글 아이콘</Option>
                      </Select>
                    </Form.Item>
                  </>
                ),
              },
              {
                key: 'options',
                label: '기능 옵션',
                children: (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="활성화" name="isActive" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="익명 허용" name="allowAnonymous" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="승인 필요" name="requireApproval" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="첨부파일 허용" name="allowAttachment" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="댓글 허용" name="allowComment" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="답글 허용" name="allowReply" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="카테고리 사용" name="useCategory" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="카테고리 목록" name="categories">
                        <Input placeholder="일반, 중요, 긴급 (쉼표로 구분)" />
                      </Form.Item>
                      <Form.Item label="태그 사용" name="useTags" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="알림 사용" name="useNotification" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="최대 첨부파일 크기(MB)" name="maxAttachmentSize">
                        <InputNumber min={1} max={100} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item label="최대 첨부파일 개수" name="maxAttachmentCount">
                        <InputNumber min={1} max={20} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'form',
                label: 'FormBuilder 연결',
                children: (
                  <>
                    <Form.Item 
                      label="FormBuilder 양식" 
                      name="formBuilderId"
                      rules={[{ required: true, message: 'FormBuilder 양식을 선택하세요' }]}
                    >
                      <Select placeholder="양식을 선택하세요">
                        {formBuilders.map(fb => (
                          <Option key={fb.id} value={fb.id}>{fb.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                      <Text type="secondary">
                        💡 FormBuilder에서 생성한 양식을 게시판의 Body 영역에 적용합니다.
                      </Text>
                    </div>
                  </>
                ),
              },
              {
                key: 'workflow',
                label: 'Workflow Builder 연결',
                children: (
                  <>
                    <Form.Item 
                      label="워크플로우" 
                      name="workflowId"
                      rules={[{ required: true, message: '워크플로우를 선택하세요' }]}
                    >
                      <Select 
                        placeholder="워크플로우를 선택하세요"
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ padding: '8px', textAlign: 'center' }}>
                              <Button 
                                type="link" 
                                icon={<BranchesOutlined />}
                                onClick={() => window.open('/workflow', '_blank')}
                              >
                                새 워크플로우 만들기
                              </Button>
                            </div>
                          </>
                        )}
                      >
                        {workflows.map(wf => (
                          <Option key={wf.id} value={wf.id}>
                            {wf.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    
                    <div style={{ marginBottom: 16, padding: 12, background: '#f0f5ff', borderRadius: 8 }}>
                      <Text type="secondary">
                        💡 Workflow Builder에서 생성한 승인 프로세스를 게시판에 적용합니다.
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', borderRadius: 8 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>워크플로우 상태 노드:</Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          <Tag color="blue">작성중 (DRAFT)</Tag>
                          <Tag color="orange">임시저장 (TEMP_SAVE)</Tag>
                          <Tag color="cyan">승인요청 (REQUEST_APPROVAL)</Tag>
                          <Tag color="green">최종승인 (FINAL_APPROVAL)</Tag>
                          <Tag color="purple">게시중 (PUBLISHED)</Tag>
                          <Tag color="red">반려됨 (REJECTED)</Tag>
                        </div>
                      </Space>
                    </div>
                  </>
                ),
              },
              {
                key: 'permission',
                label: '권한 설정',
                children: (
                  <>
                    <Form.Item label="읽기 권한" name="readPermissions">
                      <Input placeholder="예: ALL, USER, ADMIN (쉼표로 구분)" />
                    </Form.Item>
                    <Form.Item label="쓰기 권한" name="writePermissions">
                      <Input placeholder="예: USER, ADMIN (쉼표로 구분)" />
                    </Form.Item>
                    <Form.Item label="관리 권한" name="managePermissions">
                      <Input placeholder="예: ADMIN (쉼표로 구분)" />
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
        </Form>
      </Modal>

      {/* 워크플로우 미리보기 모달 */}
      <Modal
        title={
          <Space>
            <BranchesOutlined />
            <span>워크플로우 미리보기</span>
          </Space>
        }
        open={workflowPreviewVisible}
        onCancel={() => setWorkflowPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setWorkflowPreviewVisible(false)}>
            닫기
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              window.open('/workflow', '_blank');
              setWorkflowPreviewVisible(false);
            }}
          >
            Workflow Builder로 편집
          </Button>
        ]}
        width={900}
      >
        {selectedWorkflowPreview ? (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>카테고리: </Text>
                  <Tag color="blue">{selectedWorkflowPreview.category || 'board'}</Tag>
                </div>
                <div>
                  <Text strong>노드 개수: </Text>
                  <Text>{selectedWorkflowPreview.nodes?.length || 0}개</Text>
                </div>
                <div>
                  <Text strong>전환 경로: </Text>
                  <Text>{selectedWorkflowPreview.edges?.length || 0}개</Text>
                </div>
                <div>
                  <Text strong>최종 수정: </Text>
                  <Text type="secondary">
                    {selectedWorkflowPreview.timestamp ? 
                      new Date(selectedWorkflowPreview.timestamp).toLocaleString('ko-KR') : 
                      'N/A'}
                  </Text>
                </div>
              </Space>
            </Card>

            <Divider><Text strong>워크플로우 노드</Text></Divider>
            <Row gutter={[16, 16]}>
              {selectedWorkflowPreview.nodes?.map((node: any, index: number) => (
                <Col key={node.id} xs={24} sm={12} md={8}>
                  <Card 
                    size="small"
                    style={{ 
                      borderColor: node.type === 'start' ? '#1890ff' :
                                   node.type === 'end' ? '#52c41a' :
                                   node.type === 'reject' ? '#ff4d4f' : '#d9d9d9'
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{node.data.label}</Text>
                        <Tag color={
                          node.type === 'start' ? 'blue' :
                          node.type === 'end' ? 'green' :
                          node.type === 'reject' ? 'red' :
                          node.type === 'approval' ? 'purple' :
                          node.type === 'review' ? 'cyan' : 'default'
                        }>
                          {node.type}
                        </Tag>
                      </div>
                      {node.data.description && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {node.data.description}
                        </Text>
                      )}
                      {node.data.statusKey && (
                        <div>
                          <Text code style={{ fontSize: 11 }}>{node.data.statusKey}</Text>
                        </div>
                      )}
                      {node.data.allowedRoles && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {node.data.allowedRoles.map((role: string) => (
                            <Tag key={role} color="orange" style={{ fontSize: 10, margin: 0 }}>
                              {role}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider><Text strong>전환 경로 (Edges)</Text></Divider>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedWorkflowPreview.edges?.map((edge: any, index: number) => {
                  const sourceNode = selectedWorkflowPreview.nodes?.find((n: any) => n.id === edge.source);
                  const targetNode = selectedWorkflowPreview.nodes?.find((n: any) => n.id === edge.target);
                  return (
                    <Card key={edge.id} size="small" style={{ background: '#fafafa' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Tag color="blue">{sourceNode?.data.label || edge.source}</Tag>
                        <span>→</span>
                        <Tag color="cyan">{edge.label}</Tag>
                        <span>→</span>
                        <Tag color="green">{targetNode?.data.label || edge.target}</Tag>
                      </div>
                    </Card>
                  );
                })}
              </Space>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">워크플로우 정보를 불러오는 중...</Text>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
