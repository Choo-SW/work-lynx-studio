// 전자결재 양식 설정 타입 정의

export interface ApprovalFormConfig {
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
    requireAttachment: boolean;
    allowDraft: boolean;
    autoNumbering: boolean;
    numberingPrefix?: string;
    retentionPeriod: number; // 보존 기간 (년)
    securityLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET';
    allowEmergency: boolean; // 긴급 결재 허용
    allowProxy: boolean; // 대결 허용
    allowAgree: boolean; // 합의 기능 사용
  };
  
  // FormBuilder 연결
  formBuilderId?: string;
  formBuilderName?: string;
  
  // 워크플로우 연결
  workflowId?: string;
  workflowName?: string;
  
  // 결재선 설정
  approvalLine: {
    minApprovers: number;
    maxApprovers: number;
    allowSkip: boolean;
    allowReturn: boolean; // 반려 허용
  };
  
  // 권한 설정
  permissions: {
    draft: string[]; // 기안 가능 역할
    approve: string[]; // 승인 가능 역할
    view: string[]; // 조회 가능 역할
    manage: string[]; // 관리 가능 역할
  };
  
  // 메타 정보
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  order: number;
}

export interface ApprovalFormTreeNode {
  key: string;
  title: string;
  icon?: React.ReactNode;
  children?: ApprovalFormTreeNode[];
  isLeaf?: boolean;
  data: ApprovalFormConfig;
}
