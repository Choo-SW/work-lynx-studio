"use client";

import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  Radio, 
  Space, 
  Typography, 
  Divider,
  message,
  Row,
  Col,
  Menu,
  Layout,
  Modal,
  List
} from 'antd';
import { 
  UploadOutlined, 
  SaveOutlined, 
  SendOutlined,
  HomeOutlined,
  FileImageOutlined,
  LockOutlined,
  MailOutlined,
  FileTextOutlined,
  CommentOutlined,
  SettingOutlined,
  NotificationOutlined,
  TeamOutlined,
  BulbOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { UploadFile } from 'antd/es/upload/interface';
import type { MenuProps } from 'antd';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import RichTextEditor from '@/components/RichTextEditor';

// SurveyJS 테마 CSS import
import 'survey-core/defaultV2.min.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Header, Sider, Content } = Layout;

// 사용 가능한 양식 템플릿
const availableSurveys = [
  {
    id: 'board-form',
    name: '게시판 전용 양식',
    description: '폼빌더로 생성한 게시판 작성 양식 (조건부 로직 포함)',
    file: '/surveys/board-form.json'
  },
  {
    id: 'board-basic',
    name: '기본 게시판 양식',
    description: '제목, 내용, 첨부파일 등 기본 필드',
    file: '/surveys/basic.json'
  },
  {
    id: 'board-advanced',
    name: '확장 게시판 양식',
    description: '카테고리, 태그, 공개범위 등 확장 필드',
    file: '/surveys/advanced.json'
  },
  {
    id: 'custom',
    name: '커스텀 양식',
    description: 'Form Builder에서 직접 생성한 양식',
    file: null
  }
];

export default function BoardWritePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGnb, setSelectedGnb] = useState('board');
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [loadedSurvey, setLoadedSurvey] = useState<any>(null);
  const [surveyModel, setSurveyModel] = useState<Model | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [selectedLnb, setSelectedLnb] = useState('promo');

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
      message.info('전자우편 기능은 준비 중입니다.');
    } else if (e.key === 'system') {
      message.info('시스템 관리 기능은 준비 중입니다.');
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

  const categoryOptions = [
    { label: '공지사항', value: 'notice' },
    { label: '자유게시판', value: 'free' },
    { label: 'IT운영팀', value: 'it_operation' },
    { label: '전체', value: 'all' }
  ];

  const statusOptions = [
    { label: '일반', value: 'normal' },
    { label: '임반', value: 'important' }
  ];

  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handleSave = async (isDraft: boolean) => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success(isDraft ? '임시 저장되었습니다.' : '게시물이 작성되었습니다.');
      
      // 게시판 목록으로 이동 (추후 구현)
      // router.push('/board/list');
      
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleSave(false);
  };

  const handleDraft = () => {
    handleSave(true);
  };

  // 양식 불러오기 버튼 클릭
  const handleLoadSurvey = () => {
    setSurveyModalOpen(true);
  };

  // 양식 선택
  const handleSelectSurvey = async (surveyItem: typeof availableSurveys[0]) => {
    try {
      if (surveyItem.file) {
        const response = await fetch(surveyItem.file);
        const surveyJson = await response.json();
        
        setLoadedSurvey(surveyJson);
        const survey = new Model(surveyJson);
        survey.onComplete.add((sender) => {
          console.log('Survey completed:', sender.data);
          message.success('양식이 작성되었습니다.');
        });
        setSurveyModel(survey);
        
        message.success(`${surveyItem.name}이(가) 로드되었습니다.`);
        setSurveyModalOpen(false);
      } else {
        message.info('커스텀 양식 빌더로 이동합니다.');
        router.push('/builder/board');
      }
    } catch (error) {
      console.error('Survey load error:', error);
      message.error('양식을 불러오는데 실패했습니다.');
    }
  };

  // 양식 제거
  const handleRemoveSurvey = () => {
    setLoadedSurvey(null);
    setSurveyModel(null);
    setUploadedFileName('');
    message.info('양식이 제거되었습니다.');
  };

  // 파일 업로드로 양식 불러오기
  const handleUploadSurvey = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const surveyJson = JSON.parse(e.target?.result as string);
        setLoadedSurvey(surveyJson);
        const survey = new Model(surveyJson);
        survey.onComplete.add((sender) => {
          console.log('Survey completed:', sender.data);
          message.success('양식이 작성되었습니다.');
        });
        setSurveyModel(survey);
        setUploadedFileName(file.name);
        message.success(`${file.name}이(가) 로드되었습니다.`);
        setSurveyModalOpen(false);
      } catch (error) {
        console.error('JSON parse error:', error);
        message.error('유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
    return false; // 자동 업로드 방지
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
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              {/* Breadcrumb */}
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  게시판 &gt; 홍보뉴스 &gt; [식생]홍보뉴스 &gt; 작성
                </Text>
              </div>

              {/* Page Title */}
              <Title level={2} style={{ marginBottom: 24 }}>
                게시물 작성
              </Title>

              {/* 액션 버튼 영역 - 상단으로 이동 */}
              <Card style={{ marginBottom: 16 }}>
                <Space size="middle">
                  <Button 
                    size="large"
                    onClick={() => router.push('/board/promo')}
                  >
                    취소
                  </Button>
                  <Button 
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleDraft}
                    loading={loading}
                  >
                    임시저장
                  </Button>
                  <Button 
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    onClick={handleSubmit}
                    loading={loading}
                  >
                    작성완료
                  </Button>
                </Space>
              </Card>

              {/* 폼 영역 구조화 */}
              <Card>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    writer: '관리자',
                    createDate: '2026.02.06 09:57',
                    categoryId: 'notice',
                    status: 'normal',
                    importance: 'normal'
                  }}
                >
                  {/* ===== 타이틀 영역 ===== */}
                  <div style={{ 
                    background: '#f0f2f5', 
                    padding: '16px', 
                    marginBottom: 16,
                    borderRadius: 4,
                    border: '2px dashed #d9d9d9'
                  }}>
                    <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                      📝 타이틀 영역
                    </Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Form.Item 
                      label="제목" 
                      name="title"
                      rules={[{ required: true, message: '제목을 입력해주세요' }]}
                    >
                      <Input 
                        placeholder="제목을 입력하세요" 
                        size="large"
                        suffix={
                          <Space>
                            <Button 
                              size="small" 
                              icon={<FileImageOutlined />}
                              onClick={() => message.info('썸네일 선택 기능')}
                            >
                              썸네일 선택
                            </Button>
                            <Button 
                              size="small"
                              onClick={() => message.info('붙여넣기')}
                            >
                              붙혀쓰기
                            </Button>
                          </Space>
                        }
                      />
                    </Form.Item>
                  </div>

                  {/* ===== 헤더 영역 ===== */}
                  <div style={{ 
                    background: '#fff7e6', 
                    padding: '16px', 
                    marginBottom: 16,
                    borderRadius: 4,
                    border: '2px dashed #ffd591'
                  }}>
                    <Text strong style={{ color: '#fa8c16', fontSize: 16 }}>
                      📋 헤더 영역 (메타데이터)
                    </Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    {/* 작성자 정보 */}
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="작성자" name="writer">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="게시일" name="createDate">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 게시기간 */}
                    <Form.Item label="게시기간">
                      <Input.Group compact>
                        <Select defaultValue="all" style={{ width: '30%' }}>
                          <Select.Option value="all">무기한</Select.Option>
                          <Select.Option value="period">기간설정</Select.Option>
                        </Select>
                      </Input.Group>
                    </Form.Item>

                    {/* 게시대상 */}
                    <Form.Item label="게시대상">
                      <Select defaultValue="all" style={{ width: '100%' }}>
                        <Select.Option value="all">전체</Select.Option>
                        <Select.Option value="department">부서별</Select.Option>
                        <Select.Option value="position">직급별</Select.Option>
                      </Select>
                    </Form.Item>

                    {/* 중요도 */}
                    <Form.Item label="중요도" name="importance">
                      <Radio.Group options={statusOptions} />
                    </Form.Item>
                  </div>

                  {/* ===== 바디 영역 (Form Builder 결과물 반영) ===== */}
                  <div style={{ 
                    background: '#f6ffed', 
                    padding: '16px', 
                    marginBottom: 16,
                    borderRadius: 4,
                    border: '2px dashed #b7eb8f'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                        📄 바디 영역 (Form Builder 콘텐츠)
                      </Text>
                      <Space>
                        {loadedSurvey && (
                          <Button 
                            danger
                            onClick={handleRemoveSurvey}
                          >
                            양식 제거
                          </Button>
                        )}
                        <Button 
                          type="dashed" 
                          icon={<FormOutlined />}
                          onClick={handleLoadSurvey}
                        >
                          양식 불러오기
                        </Button>
                      </Space>
                    </div>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    {/* SurveyJS 렌더링 영역 */}
                    {surveyModel && (
                      <div style={{ marginBottom: 16 }}>
                        <Card 
                          title="불러온 양식" 
                          size="small"
                          style={{ background: '#fff', marginBottom: 16 }}
                        >
                          <Survey model={surveyModel} />
                        </Card>
                      </div>
                    )}
                    
                    {/* 파일 첨부 */}
                    <Form.Item label="파일 첨부">
                      <Upload
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        multiple
                      >
                        <Button icon={<UploadOutlined />}>파일 선택</Button>
                      </Upload>
                      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                        * 첨부파일은 최대 10개, 총 100MB까지 등록 가능합니다.
                      </Text>
                    </Form.Item>

                    {/* 내용 - 에디터 영역 (Form Builder로 대체 가능) */}
                    <Form.Item 
                      label="본문 내용" 
                      name="content"
                      rules={[{ required: true, message: '내용을 입력해주세요' }]}
                    >
                      <RichTextEditor
                        placeholder="내용을 입력하세요... (이 영역은 Form Builder로 생성된 양식으로 대체할 수 있습니다)"
                        onChange={(html) => form.setFieldsValue({ content: html })}
                      />
                    </Form.Item>

                    {/* Form Builder 안내 */}
                    <Card size="small" style={{ background: '#e6f7ff', marginTop: 16 }}>
                      <Space direction="vertical" size="small">
                        <Text strong>💡 Form Builder 통합 안내</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          • "양식 불러오기" 버튼을 클릭하여 Form Builder에서 생성한 양식을 불러올 수 있습니다.
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          • 불러온 양식은 본문 내용 영역에 자동으로 삽입됩니다.
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          • SurveyJS 엔진을 통해 동적 폼 요소가 렌더링됩니다.
                        </Text>
                      </Space>
                    </Card>
                  </div>

                  {/* ===== 꼬리말 영역 ===== */}
                  <div style={{ 
                    background: '#fff1f0', 
                    padding: '16px', 
                    marginBottom: 16,
                    borderRadius: 4,
                    border: '2px dashed #ffccc7'
                  }}>
                    <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
                      📌 꼬리말 영역 (추가 정보)
                    </Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Form.Item label="태그">
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="태그를 입력하세요 (Enter로 추가)"
                        options={[
                          { value: '공지', label: '공지' },
                          { value: '긴급', label: '긴급' },
                          { value: '이벤트', label: '이벤트' },
                          { value: '안내', label: '안내' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="참조 링크">
                      <Input placeholder="관련 링크 URL을 입력하세요" />
                    </Form.Item>

                    <Form.Item label="비고">
                      <TextArea rows={3} placeholder="추가 메모나 비고사항을 입력하세요" />
                    </Form.Item>
                  </div>
                </Form>
              </Card>

              {/* 안내 메시지 */}
              <Card style={{ marginTop: 16, background: '#fffbe6', border: '1px solid #ffe58f' }}>
                <Text type="secondary">
                  <strong>💡 참고:</strong> 이 페이지는 게시판 작성 시나리오의 데모 화면입니다. 
                  실제 환경에서는 워크플로우 빌더로 정의한 승인 프로세스가 적용됩니다.
                </Text>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* 양식 선택 모달 */}
      <Modal
        title="양식 불러오기"
        open={surveyModalOpen}
        onCancel={() => setSurveyModalOpen(false)}
        footer={null}
        width={700}
      >
        {/* 파일 업로드 영역 */}
        <Card size="small" style={{ marginBottom: 16, background: '#e6f7ff' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>📤 JSON 파일 업로드</Text>
            <Upload
              accept=".json"
              beforeUpload={handleUploadSurvey}
              showUploadList={false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} type="dashed" block>
                Form Builder에서 생성한 JSON 파일 선택
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 Form Builder에서 내보낸 JSON 파일을 직접 업로드할 수 있습니다.
            </Text>
          </Space>
        </Card>

        <Divider>또는 템플릿 선택</Divider>

        <List
          dataSource={availableSurveys}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => handleSelectSurvey(item)}
                >
                  선택
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FormOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
}

