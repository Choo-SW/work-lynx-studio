// 게시판 설정 타입 정의

export interface BoardConfig {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  isFolder?: boolean;
  
  // 기본 옵션
  options: {
    isActive: boolean;
    allowAnonymous: boolean;
    requireApproval: boolean;
    allowAttachment: boolean;
    maxAttachmentSize: number; // MB
    maxAttachmentCount: number;
    allowComment: boolean;
    allowReply: boolean;
    useCategory: boolean;
    categories?: string[];
    useTags: boolean;
    useNotification: boolean;
  };
  
  // FormBuilder 연결
  formBuilderId?: string;
  formBuilderName?: string;
  
  // 워크플로우 연결
  workflowId?: string;
  workflowName?: string;
  
  // 권한 설정
  permissions: {
    read: string[]; // 역할 배열
    write: string[];
    manage: string[];
  };
  
  // 메타 정보
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  order: number;
}

export interface BoardTreeNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: BoardTreeNode[];
  isLeaf?: boolean;
  data: BoardConfig;
}
