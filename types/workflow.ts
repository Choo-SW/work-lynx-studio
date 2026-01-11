// 워크플로우 노드 타입 정의

// 워크플로우 카테고리
export type WorkflowCategory = 
  | 'approval'   // 전자결재
  | 'board'      // 게시판
  | 'proposal'   // 업무제안
  | 'document';  // 문서관리

export type NodeType = 
  | 'start'      // 기안 (문서 작성 시작)
  | 'review'     // 검토 (반려 가능, N번 반복)
  | 'agreement'  // 합의 (반려 가능 여부 옵션, N번 반복)
  | 'approval'   // 승인 (문서번호 채번, 변경 불가)
  | 'execution'  // 시행 (문서번호 채번, 외부 발송)
  | 'receipt'    // 접수 (접수번호 채번, 내부 승인 재시작)
  | 'reject'     // 반려 (기안자에게 반송)
  | 'condition'  // 조건 분기
  | 'end'        // 종료
  // 게시판 전용
  | 'publish'    // 게시 (게시판 공개)
  | 'moderate'   // 검수 (부적절한 내용 검토)
  | 'pin'        // 상단 고정
  | 'archive'    // 보관 (기한 만료 시)
  // 업무제안 전용
  | 'evaluate'   // 평가 (제안 심사)
  | 'vote'       // 투표 (다수결)
  | 'implement'  // 실행 (제안 실행 단계)
  | 'reward'     // 보상 (우수 제안 포상)
  // 문서관리 전용
  | 'version'    // 버전 생성
  | 'checkout'   // 체크아웃 (편집 잠금)
  | 'checkin'    // 체크인 (변경사항 저장)
  | 'lock'       // 잠금 (읽기 전용)
  | 'unlock';    // 잠금 해제

export interface WorkflowNodeData {
  label: string;
  description?: string;
  sequence?: number;        // 워크플로우 순서 (1, 2, 3...)
  // 검토자/합의자/승인자 정보
  approver?: {
    id: string;
    name: string;
    department: string;
    position: string;
    order?: number;        // 순서 (N번 반복 시)
  };
  // 검토/합의 설정
  reviewConfig?: {
    canReject: boolean;          // 반려 가능 여부
    isRequired: boolean;         // 필수 여부
    parallelMode?: boolean;      // 병렬 처리 (동시 진행)
  };
  // 승인/시행 설정
  approvalConfig?: {
    generateDocNumber: boolean;  // 문서번호 채번 여부
    lockContent: boolean;        // 내용 변경 잠금
    docNumberPrefix?: string;    // 문서번호 접두사
  };
  // 접수 설정
  receiptConfig?: {
    generateReceiptNumber: boolean;  // 접수번호 채번 여부
    recipientDepartment?: string;    // 수신 부서
    restartApproval?: boolean;       // 내부 승인 재시작
  };
  // 조건 설정 (조건 분기 노드용)
  condition?: {
    field: string;      // 비교할 필드명 (예: 'amount')
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';  // 연산자
    value: number | string;  // 비교값
  };
  // 게시판 설정
  boardConfig?: {
    boardId?: string;           // 게시판 ID
    categoryId?: string;        // 카테고리 ID
    isPinned?: boolean;         // 상단 고정 여부
    expiryDays?: number;        // 게시 기간 (일)
    allowComments?: boolean;    // 댓글 허용
    isPublic?: boolean;         // 공개 여부
  };
  // 업무제안 설정
  proposalConfig?: {
    evaluators?: string[];      // 평가자 목록
    minScore?: number;          // 최소 점수
    votingPeriod?: number;      // 투표 기간 (일)
    rewardAmount?: number;      // 포상금
    implementDeadline?: string; // 실행 기한
  };
  // 문서관리 설정
  documentConfig?: {
    versionMajor?: number;      // 주 버전
    versionMinor?: number;      // 부 버전
    checkoutUser?: string;      // 체크아웃 사용자
    lockReason?: string;        // 잠금 사유
    retentionPeriod?: number;   // 보존 기간 (년)
    isArchived?: boolean;       // 보관 여부
  };
  // 기타 설정
  config?: {
    timeout?: number;      // 타임아웃 (분)
    autoApprove?: boolean; // 자동 승인
    skipOnCondition?: boolean;
    requireComment?: boolean;  // 의견 필수 여부
  };
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}
