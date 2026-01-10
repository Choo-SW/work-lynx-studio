# TCCINS Work Lynx Studio - Form Builder

## 📋 프로젝트 개요

**TCCINS Work Lynx Studio**의 핵심 모듈 중 하나인 **Form Builder**의 프로토타입입니다.

### 핵심 컨셉
- **LowCode Form Builder**: 드래그 앤 드롭 방식의 결재/신청 양식 설계
- **Progressive Disclosure**: 사용자 입력에 따라 동적으로 필드가 노출되는 점진적 접근 방식
- **JSON 기반 정의**: 코드 없이 JSON으로 양식 구조와 로직을 정의
- **SaaS-Legacy 통합**: Gateway Server를 통한 실시간 데이터 조회 및 매핑

## 🎯 Lynx Studio 아키텍처 내 위치

```
┌─────────────────────────────────────────────────────────────┐
│                    Lynx Studio Builder                       │
│                    (Control Plane / SaaS)                    │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  LowCode Builder │  │   Form Builder   │ ◄── 현재 모듈  │
│  │      Apps        │  │  (이 프로젝트)    │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 워크플로우 배포
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            Lynx Studio Gateway Server                        │
│            (Data Plane / Customer Edge)                      │
│  ┌────────────────────────────────────────────────┐         │
│  │  실시간 처리 엔진 (Runtime Interpreter)         │         │
│  │  - 양식 데이터 수신                              │         │
│  │  - Legacy 시스템 API 호출                       │         │
│  │  - 데이터 변환 및 매핑                           │         │
│  │  - 결재 상태 피드백                              │         │
│  └────────────────────────────────────────────────┘         │
│                     │              │                         │
│                     │              │                         │
└─────────────────────┼──────────────┼─────────────────────────┘
                      │              │
            ┌─────────▼──────┐  ┌───▼──────────┐
            │  Legacy ERP    │  │  Public API  │
            │  (SAP, HR 등)  │  │ (날씨, 주가) │
            └────────────────┘  └──────────────┘
```

## 🔑 주요 기능

### 1. Progressive Disclosure 폼
- 사용자의 이전 입력값(예: 프로젝트 선택)에 따라 다음 필드가 동적으로 나타남
- 역할(Role) 기반 필드 노출 제어
- 복잡한 양식을 단순화하여 사용자 피로도 감소

### 2. Legacy 시스템 연동 (시뮬레이션)
- 실시간 데이터 조회: 양식 입력 중 Legacy ERP에서 데이터 조회
- 데이터 자동 채움: ERP 전표 정보를 양식에 자동 매핑
- 상태 피드백: 결재 완료 시 ERP 전표 생성 결과 수신

### 3. JSON 기반 양식 정의
- 코드 없이 JSON으로 양식 구조 정의
- 조건부 로직 (`visibleIf`) 지원
- 다양한 필드 타입 (텍스트, 선택, 파일 등)

## 📂 프로젝트 구조

```
lynx-studio-form-builder/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 양식 목록 (대시보드)
│   └── survey/[id]/page.tsx         # 동적 양식 렌더링
├── components/
│   └── SurveyComponent.tsx          # SurveyJS 통합 컴포넌트
├── surveys/                          # JSON 양식 정의
│   ├── basic.json                   # 기본 예제
│   ├── advanced.json                # 고급 예제 (조건부 로직)
│   └── expense-approval.json        # 지출결의서 (기획서 시나리오 4.1)
└── mocks/
    └── gateway-api.ts               # Gateway Server API Mock
```

## 🚀 기획서 시나리오 구현 상태

### ✅ 시나리오 4.1: 지출결의서 연동 로직
- [x] Form Builder로 양식 설계
- [x] Progressive Disclosure 적용
- [ ] Gateway Server 실시간 조회 (Mock)
- [ ] Legacy ERP 데이터 매핑
- [ ] 상태 피드백 Callback

### 🔄 시나리오 4.2: ERP 역방향 통합
- [ ] Legacy → Gateway 데이터 수신
- [ ] 데이터 변환 및 양식 자동 채움
- [ ] SSO 연동 시뮬레이션

### 🔄 시나리오 4.3: 실시간 데이터 푸시
- [ ] WebSocket 채널 정의
- [ ] Public API 연동
- [ ] 실시간 포틀릿 업데이트

## 💡 사용 예제

### 지출결의서 양식 (expense-approval.json)

```json
{
  "title": "지출결의서",
  "pages": [{
    "elements": [
      {
        "type": "dropdown",
        "name": "projectCode",
        "title": "프로젝트 선택",
        "isRequired": true,
        "choices": [
          { "value": "PRJ001", "text": "신규 ERP 구축" },
          { "value": "PRJ002", "text": "그룹웨어 전환" }
        ]
      },
      {
        "type": "text",
        "name": "remainingBudget",
        "title": "잔여 예산",
        "visibleIf": "{projectCode} notempty",
        "readOnly": true,
        "comment": "Gateway Server가 Legacy ERP에서 실시간 조회"
      }
    ]
  }]
}
```

## 🔧 개발 환경 설정

### 필수 조건
- Node.js 18+ (NVM 사용 권장)
- Git Bash (설치 완료)

### 설치 및 실행

```bash
# 프로젝트 폴더로 이동
cd survey-app

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 접속
- 홈페이지: http://localhost:3000
- 기본 양식: http://localhost:3000/survey/basic
- 고급 양식: http://localhost:3000/survey/advanced
- 지출결의서: http://localhost:3000/survey/expense-approval

## 🛠️ 기술 스택

- **Next.js 15**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안전성
- **SurveyJS**: Progressive Form 엔진
- **Tailwind CSS**: UI 스타일링

## 📈 다음 단계

### Phase 1: Core Features
- [ ] Gateway Server Mock API 구현
- [ ] 실시간 데이터 조회 시뮬레이션
- [ ] 지출결의서 완전 구현

### Phase 2: Integration
- [ ] WebSocket 실시간 푸시
- [ ] SSO 연동 프로토타입
- [ ] 상태 피드백 UI

### Phase 3: Advanced
- [ ] 양식 빌더 GUI (드래그 앤 드롭)
- [ ] AI 기반 필드 매핑 추천
- [ ] 통합 대시보드

## 🔗 관련 문서

- [Lynx Studio 제품 기획서](../Project.md)
- [SurveyJS 문서](https://surveyjs.io/form-library/documentation/overview)
- [Next.js App Router](https://nextjs.org/docs/app)

## 📝 라이선스

TCCINS Proprietary

---

**TCCINS Work Lynx Studio** - Development-Free Integration for Enterprise SaaS via Edge Computing
