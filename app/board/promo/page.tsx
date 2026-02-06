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
  SearchOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { MenuProps, TableProps } from 'antd';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;
const { Search } = Input;

interface BoardItem {
  key: string;
  no: number;
  category: string;
  title: string;
  writer: string;
  createDate: string;
  views: number;
  status: string;
}

export default function PromoBoardListPage() {
  const router = useRouter();
  const [selectedGnb, setSelectedGnb] = useState('board');
  const [selectedLnb, setSelectedLnb] = useState('promo');
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
  const dataSource: BoardItem[] = [
    {
      key: '1',
      no: 15,
      category: '관리자 / 지점 / IT운영팀',
      title: '2026년 1월 시스템 업데이트 안내',
      writer: '관리자',
      createDate: '2026.01.15',
      views: 234,
      status: 'published'
    },
    {
      key: '2',
      no: 14,
      category: '관리자 / 지점 / IT운영팀',
      title: '신규 협업 도구 도입에 대한 공지',
      writer: '관리자',
      createDate: '2026.01.10',
      views: 189,
      status: 'published'
    },
    {
      key: '3',
      no: 13,
      category: '관리자 / 지점 / IT운영팀',
      title: '2025년 4분기 우수 사원 시상식',
      writer: '관리자',
      createDate: '2025.12.28',
      views: 456,
      status: 'published'
    },
    {
      key: '4',
      no: 12,
      category: '관리자 / 지점 / IT운영팀',
      title: '사내 복지 제도 개선 안내',
      writer: '관리자',
      createDate: '2025.12.15',
      views: 321,
      status: 'published'
    },
    {
      key: '5',
      no: 11,
      category: '관리자 / 지점 / IT운영팀',
      title: '보안 정책 업데이트 필수 확인 사항',
      writer: '관리자',
      createDate: '2025.12.01',
      views: 567,
      status: 'published'
    },
  ];

  const columns: TableProps<BoardItem>['columns'] = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 80,
      align: 'center',
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      width: 200,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => router.push(`/board/promo/${record.key}`)}>
          {text}
        </a>
      ),
    },
    {
      title: '작성자',
      dataIndex: 'writer',
      key: 'writer',
      width: 120,
      align: 'center',
    },
    {
      title: '작성일',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      align: 'center',
    },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      align: 'center',
    },
    {
      title: '상태',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '게시중' : '대기중'}
        </Tag>
      ),
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
                  게시판 &gt; 홍보뉴스
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
                  홍보뉴스
                </Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => router.push('/board/write')}
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
                      style={{ width: 400 }}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onSearch={(value) => console.log('Search:', value)}
                    />
                  </Space>
                  <Space wrap>
                    <Text type="secondary">총 {dataSource.length}건</Text>
                  </Space>
                </Space>
              </Card>

              {/* Data Table */}
              <Card>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{
                    total: dataSource.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `총 ${total}건`,
                  }}
                />
              </Card>

              {/* Info Card */}
              <Card style={{ marginTop: 16, background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                <Text type="secondary">
                  <strong>💡 안내:</strong> 게시물을 클릭하면 상세 내용을 확인할 수 있습니다. 
                  새 문서 버튼을 클릭하여 새로운 게시물을 작성하실 수 있습니다.
                </Text>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
