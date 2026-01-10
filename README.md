# TCCINS Work Lynx Studio - Form Builder Module

**차세대 그룹웨어의 LowCode 기반 결재 양식 빌더**

Progressive Disclosure 기법을 적용한 동적 폼 생성 엔진으로, JSON 기반 양식 정의를 통해 SaaS-Legacy 통합을 위한 맞춤형 결재 양식을 제공합니다.

## 🚀 시작하기

### 1. NVM 및 Node.js 설치 (완료됨 ✓)

**VS Code를 재시작한 후** 터미널에서 다음 명령어를 실행하세요:

```bash
# NVM 버전 확인
nvm version

# Node.js LTS 설치
nvm install lts

# 설치한 Node.js 사용
nvm use lts

# Node.js 및 npm 버전 확인
node --version
npm --version
```

### 2. 의존성 설치

```bash
cd survey-app
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
survey-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지 (설문 목록)
│   ├── globals.css          # 전역 스타일
│   └── survey/[id]/         # 동적 설문 페이지
│       └── page.tsx         # 설문 렌더링 페이지
├── components/               # React 컴포넌트
│   └── SurveyComponent.tsx  # SurveyJS 통합 컴포넌트
├── surveys/                  # JSON 설문 정의 파일
│   ├── basic.json           # 기본 설문 예제
│   └── advanced.json        # 고급 설문 예제
├── public/                   # 정적 파일
├── package.json             # 프로젝트 의존성
├── tsconfig.json            # TypeScript 설정
├── tailwind.config.ts       # Tailwind CSS 설정
└── next.config.js           # Next.js 설정
```

## 🎯 주요 기능

### 1. JSON 기반 설문 정의
`surveys/` 폴더에 JSON 파일로 설문을 정의합니다:

```json
{
  "title": "설문 제목",
  "pages": [
    {
      "elements": [
        {
          "type": "text",
          "name": "name",
          "title": "이름을 입력하세요",
          "isRequired": true
        }
      ]
    }
  ]
}
```

### 2. 동적 렌더링
- URL: `/survey/[id]` (예: `/survey/basic`, `/survey/advanced`)
- JSON 파일을 동적으로 로드하여 SurveyJS로 렌더링

### 3. SurveyJS 통합
- **survey-core**: SurveyJS 코어 라이브러리
- **survey-react-ui**: React용 SurveyJS UI 컴포넌트
- 다양한 질문 유형 지원:
  - text (텍스트 입력)
  - radiogroup (단일 선택)
  - checkbox (복수 선택)
  - dropdown (드롭다운)
  - comment (긴 텍스트)
  - rating (평점)
  - matrix (매트릭스)
  - file (파일 업로드)
  - boolean (예/아니오)

### 4. 조건부 로직
`visibleIf` 속성으로 조건부 질문 표시:

```json
{
  "type": "text",
  "name": "details",
  "visibleIf": "{hasExperience} = 'yes'"
}
```

## 🛠️ 사용 기술

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **SurveyJS** - 설문/폼 라이브러리
- **Tailwind CSS** - 스타일링
- **App Router** - Next.js 라우팅

## 📝 새 설문 추가 방법

1. `surveys/` 폴더에 새 JSON 파일 생성 (예: `surveys/custom.json`)
2. SurveyJS JSON 스키마로 설문 정의
3. 브라우저에서 `/survey/custom` 접속

## 🎨 스타일 커스터마이징

- **SurveyJS 테마**: `components/SurveyComponent.tsx`에서 CSS 임포트 변경
- **Tailwind**: `tailwind.config.ts` 및 `app/globals.css` 수정
- **커스텀 CSS**: 개별 컴포넌트에 스타일 추가

## 📚 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [SurveyJS 문서](https://surveyjs.io/form-library/documentation/overview)
- [SurveyJS Examples](https://surveyjs.io/form-library/examples/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔧 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

## 📄 라이선스

MIT

---

## ⚠️ 다음 단계

1. **VS Code 재시작** (NVM 환경 변수 적용)
2. 터미널에서 `nvm install lts` 및 `nvm use lts` 실행
3. `cd survey-app` 후 `npm install` 실행
4. `npm run dev`로 개발 서버 시작
5. 브라우저에서 http://localhost:3000 접속

행운을 빕니다! 🎉
