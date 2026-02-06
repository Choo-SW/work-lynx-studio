"use client";

import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  message, 
  Tag 
} from 'antd';
import { 
  HomeOutlined,
  MailOutlined,
  FileTextOutlined,
  CommentOutlined,
  SettingOutlined,
  NotificationOutlined,
  TeamOutlined,
  BulbOutlined,
  SaveOutlined, 
  SendOutlined, 
  RollbackOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import FormBuilderRenderer from '@/components/FormBuilderRenderer';
import { WorkflowEngine } from '@/utils/workflowEngine';
import type { WorkflowDefinition, UserRole } from '@/types/workflow';
import type { FormBuilderDefinition } from '@/types/formbuilder';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function NoticeWritePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedGnb, setSelectedGnb] = useState('board');
  const [selectedLnb, setSelectedLnb] = useState('notice');
  
  // 워크플로우 상태
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [currentStatusKey, setCurrentStatusKey] = useState('DRAFT');
  const [userRoles] = useState<UserRole[]>(['AUTHOR', 'ADMIN']); // 실제로는 로그인 정보에서 가져옴
  
  // FormBuilder 상태
  const [formDefinition, setFormDefinition] = useState<FormBuilderDefinition | null>(null);
  
  // 워크플로우 엔진
  const [workflowEngine, setWorkflowEngine] = useState<WorkflowEngine | null>(null);
  const [availableActions, setAvailableActions] = useState<Array<{
    edge: any;
    targetNode: any;
    actionLabel: string;
  }>>([]);

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
      key: 'notice',
      icon: <NotificationOutlined />,
      label: '공지사항',
    },
    {
      key: 'free',
      icon: <TeamOutlined />,
      label: '자유게시판',
    },
    {
      key: 'promo',
      icon: <BulbOutlined />,
      label: '홍보뉴스',
    },
  ];

  const handleGnbClick: MenuProps['onClick'] = (e) => {
    setSelectedGnb(e.key);
    if (e.key === 'approval') {
      router.push('/approval/select');
    } else if (e.key === 'mail') {
      router.push('/');
    } else if (e.key === 'system') {
      router.push('/');
    }
  };

  const handleLnbClick: MenuProps['onClick'] = (e) => {
    setSelectedLnb(e.key);
    if (e.key === 'notice') {
      router.push('/board/notice');
    } else if (e.key === 'free') {
      router.push('/board/free');
    } else if (e.key === 'promo') {
      router.push('/board/promo');
    }
  };

  // 워크플로우 JSON 로드
  useEffect(() => {
    fetch('/wlst/workflows/board-workflow.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setWorkflow(data);
      })
      .catch(err => {
        console.error('워크플로우 로드 실패:', err);
        message.error('워크플로우를 불러오는데 실패했습니다.');
      });
  }, []);

  // FormBuilder JSON 로드
  useEffect(() => {
    fetch('/wlst/formbuilder/board-basic.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setFormDefinition(data);
      })
      .catch(err => {
        console.error('폼 정의 로드 실패:', err);
        message.error('폼 정의를 불러오는데 실패했습니다.');
      });
  }, []);

  // 워크플로우 엔진 초기화 및 액션 버튼 갱신
  useEffect(() => {
    if (workflow) {
      const engine = new WorkflowEngine(workflow, currentStatusKey, userRoles);
      setWorkflowEngine(engine);
      
      const actions = engine.getAuthorizedActions();
      setAvailableActions(actions);
    }
  }, [workflow, currentStatusKey, userRoles]);

  // 워크플로우 액션 실행
  const handleWorkflowAction = async (edgeId: string, actionLabel: string) => {
    if (!workflowEngine) return;

    setLoading(true);
    try {
      // 폼 검증
      await form.validateFields();
      
      // 워크플로우 액션 실행
      const result = await workflowEngine.executeAction(edgeId);
      
      if (result.success && result.newStatusKey) {
        message.success(result.message || `${actionLabel} 처리되었습니다.`);
        setCurrentStatusKey(result.newStatusKey);
        
        // 완료 상태면 목록으로 이동
        if (result.newStatusKey === 'DONE' || result.newStatusKey === 'PUBLISHED') {
          setTimeout(() => router.push('/board/notice'), 1500);
        }
      } else {
        message.error(result.message || '처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      message.error('필수 항목을 입력해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 액션 버튼 색상 매핑
  const getButtonType = (actionLabel: string): "primary" | "default" | "dashed" => {
    if (actionLabel.includes('승인') || actionLabel.includes('게시')) return 'primary';
    if (actionLabel.includes('반려') || actionLabel.includes('거부')) return 'default';
    return 'dashed';
  };

  const getButtonDanger = (actionLabel: string): boolean => {
    return actionLabel.includes('반려') || actionLabel.includes('거부');
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* GNB (Global Navigation Bar) */}
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
        {/* LNB (Local Navigation Bar) */}
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
            게시판
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
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
              {/* Breadcrumb */}
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  게시판 &gt; 공지사항 &gt; 작성
                </Text>
              </div>

              {/* Page Header with Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 24 
              }}>
                <Space>
                  <Title level={2} style={{ margin: 0 }}>
                    공지사항 작성
                  </Title>
                  <Tag color={WorkflowEngine.getStatusBadgeColor(currentStatusKey)}>
                    {currentStatusKey === 'DRAFT' ? '작성중' :
                     currentStatusKey === 'TEMP_SAVE' ? '임시저장' :
                     currentStatusKey === 'REQUEST_APPROVAL' ? '승인요청' :
                     currentStatusKey === 'FINAL_APPROVAL' ? '최종승인' :
                     currentStatusKey === 'PUBLISHED' ? '게시중' :
                     currentStatusKey === 'REJECTED' ? '반려됨' : currentStatusKey}
                  </Tag>
                </Space>
                
                {/* 워크플로우 액션 버튼 - 상단으로 이동 */}
                <Space size="middle">
                  {availableActions.map(action => (
                    <Button
                      key={action.edge.id}
                      type={getButtonType(action.actionLabel)}
                      danger={getButtonDanger(action.actionLabel)}
                      icon={
                        action.actionLabel.includes('저장') ? <SaveOutlined /> :
                        action.actionLabel.includes('요청') || action.actionLabel.includes('승인') ? <SendOutlined /> :
                        undefined
                      }
                      loading={loading}
                      onClick={() => handleWorkflowAction(action.edge.id, action.actionLabel)}
                      size="large"
                    >
                      {action.actionLabel}
                    </Button>
                  ))}
                  
                  <Button
                    icon={<RollbackOutlined />}
                    onClick={() => router.push('/board/notice')}
                    size="large"
                  >
                    목록
                  </Button>
                </Space>
              </div>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                category: '일반공지',
              }}
            >
              {/* FormBuilder 렌더링 */}
              {formDefinition ? (
                <FormBuilderRenderer
                  definition={formDefinition}
                  form={form}
                  onChange={(fieldName, value) => {
                    console.log(`Field ${fieldName} changed:`, value);
                  }}
                />
              ) : (
                <Card loading style={{ marginBottom: 16 }}>
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    폼 정의를 불러오는 중...
                  </div>
                </Card>
              )}
            </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
