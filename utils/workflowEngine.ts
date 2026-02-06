import { WorkflowDefinition, WorkflowEdge, WorkflowNode, UserRole } from '@/types/workflow';

/**
 * 워크플로우 엔진: 현재 상태에서 가능한 액션 버튼을 동적으로 생성
 */
export class WorkflowEngine {
  private workflow: WorkflowDefinition;
  private currentStatusKey: string;
  private userRoles: UserRole[];

  constructor(workflow: WorkflowDefinition, currentStatusKey: string, userRoles: UserRole[]) {
    this.workflow = workflow;
    this.currentStatusKey = currentStatusKey;
    this.userRoles = userRoles;
  }

  /**
   * 현재 상태 노드 찾기
   */
  getCurrentNode(): WorkflowNode | undefined {
    return this.workflow.nodes.find(node => node.data.statusKey === this.currentStatusKey);
  }

  /**
   * 현재 상태에서 전이 가능한 엣지들 찾기
   */
  getAvailableEdges(): WorkflowEdge[] {
    const currentNode = this.getCurrentNode();
    if (!currentNode) return [];

    return this.workflow.edges.filter(edge => edge.source === currentNode.id);
  }

  /**
   * 권한이 있는 액션만 필터링
   */
  getAuthorizedActions(): Array<{
    edge: WorkflowEdge;
    targetNode: WorkflowNode;
    actionLabel: string;
  }> {
    const availableEdges = this.getAvailableEdges();
    const authorizedActions: Array<{
      edge: WorkflowEdge;
      targetNode: WorkflowNode;
      actionLabel: string;
    }> = [];

    for (const edge of availableEdges) {
      const targetNode = this.workflow.nodes.find(node => node.id === edge.target);
      if (!targetNode) continue;

      // 권한 체크
      const allowedRoles = targetNode.data.allowedRoles || [];
      const hasPermission = allowedRoles.length === 0 || 
        this.userRoles.some(role => allowedRoles.includes(role));

      if (hasPermission) {
        authorizedActions.push({
          edge,
          targetNode,
          actionLabel: targetNode.data.label
        });
      }
    }

    return authorizedActions;
  }

  /**
   * 상태 전이 실행
   */
  async executeAction(edgeId: string): Promise<{ success: boolean; newStatusKey?: string; message?: string }> {
    const edge = this.workflow.edges.find(e => e.id === edgeId);
    if (!edge) {
      return { success: false, message: '유효하지 않은 액션입니다.' };
    }

    const targetNode = this.workflow.nodes.find(node => node.id === edge.target);
    if (!targetNode) {
      return { success: false, message: '대상 상태를 찾을 수 없습니다.' };
    }

    // 권한 체크
    const allowedRoles = targetNode.data.allowedRoles || [];
    const hasPermission = allowedRoles.length === 0 || 
      this.userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return { success: false, message: '권한이 없습니다.' };
    }

    // 실제 서버 API 호출은 여기서 수행
    // 현재는 시뮬레이션
    return {
      success: true,
      newStatusKey: targetNode.data.statusKey,
      message: `${targetNode.data.label} 처리가 완료되었습니다.`
    };
  }

  /**
   * 상태에 따른 배지 색상
   */
  static getStatusBadgeColor(statusKey: string): string {
    const colorMap: Record<string, string> = {
      DRAFT: 'default',
      TEMP_SAVE: 'processing',
      REQUEST_APPROVAL: 'warning',
      FINAL_APPROVAL: 'cyan',
      PUBLISHED: 'success',
      REJECTED: 'error',
      DONE: 'success'
    };
    return colorMap[statusKey] || 'default';
  }

  /**
   * 상태 한글명
   */
  static getStatusLabel(statusKey: string): string {
    const currentNode = this.prototype.workflow?.nodes.find(node => node.data.statusKey === statusKey);
    return currentNode?.data.label || statusKey;
  }
}
