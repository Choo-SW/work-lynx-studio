"use client";

import React, { useState } from 'react';
import { 
  Layout,
  Menu,
  Button,
  Table,
  Typography,
  Space,
  Tag,
  Input,
  Select,
  Card
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
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps, TableProps } from 'antd';
import { WorkflowEngine } from '@/utils/workflowEngine';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;
const { Search } = Input;

interface NoticeData {
  key: string;
  id: string;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  statusKey: string;
}

export default function NoticeBoardListPage() {
  const router = useRouter();
  const [selectedGnb, setSelectedGnb] = useState('board');
  const [selectedLnb, setSelectedLnb] = useState('notice');
  const [searchText, setSearchText] = useState('');

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

  // 샘플 데이터
  const data: NoticeData[] = [
    {
      key: '1',
      id: '1',
      category: '중요공지',
      title: '2026년 상반기 시스템 점검 안내',
      author: '관리자',
      createdAt: '2026-02-01',
      viewCount: 156,
      statusKey: 'PUBLISHED'
    },
    {
      key: '2',
      id: '2',
      category: '일반공지',
      title: '신규 기능 업데이트 안내',
      author: '운영팀',
      createdAt: '2026-02-03',
      viewCount: 89,
      statusKey: 'PUBLISHED'
    },
    {
      key: '3',
      id: '3',
      category: '긴급공지',
      title: '서버 긴급 점검 완료',
      author: '관리자',
      createdAt: '2026-02-05',
      viewCount: 234,
      statusKey: 'PUBLISHED'
    },
    {
      key: '4',
      id: '4',
      category: '일반공지',
      title: '게시판 이용 규칙 안내',
      author: '운영팀',
      createdAt: '2026-02-06',
      viewCount: 45,
      statusKey: 'REQUEST_APPROVAL'
    },
  ];

  const columns: TableProps<NoticeData>['columns'] = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'no',
      width: 80,
      align: 'center',
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        let color = 'blue';
        if (category === '긴급공지') color = 'red';
        if (category === '중요공지') color = 'orange';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: NoticeData) => (
        <a onClick={() => router.push(`/board/notice/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '조회수',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      align: 'center',
    },
    {
      title: '상태',
      dataIndex: 'statusKey',
      key: 'statusKey',
      width: 120,
      align: 'center',
      render: (statusKey: string) => {
        const color = WorkflowEngine.getStatusBadgeColor(statusKey);
        const label = statusKey === 'PUBLISHED' ? '게시중' : 
                     statusKey === 'REQUEST_APPROVAL' ? '승인요청' :
                     statusKey === 'DRAFT' ? '작성중' : statusKey;
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

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
                  게시판 &gt; 공지사항
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
                  공지사항
                </Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => router.push('/board/notice/write')}
                >
                  새 문서
                </Button>
              </div>

              {/* Search and Filter */}
              <Card style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Space wrap>
                    <Select defaultValue="all" style={{ width: 120 }}>
                      <Select.Option value="all">전체</Select.Option>
                      <Select.Option value="title">제목</Select.Option>
                      <Select.Option value="content">내용</Select.Option>
                      <Select.Option value="writer">작성자</Select.Option>
                    </Select>
                    <Search
                      placeholder="검색어를 입력하세요"
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      style={{ width: 400 }}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onSearch={(value) => console.log('검색:', value)}
                    />
                  </Space>
                </Space>
              </Card>

              {/* Table */}
              <Card>
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={{
                    total: data.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `총 ${total}건`,
                  }}
                />
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
