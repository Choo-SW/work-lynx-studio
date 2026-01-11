# Windows 파일 시스템 오류 해결 가이드

## 🔴 문제 증상

```
Error: UNKNOWN: unknown error, open 'C:\ws\simul1\survey-app\.next\static\chunks\app\layout.js'
errno: -4094
code: 'UNKNOWN'
syscall: 'open'
```

## 🔍 근본 원인 분석

### 문제 발생 시점
1. Next.js가 페이지 컴파일 완료 ✅
2. 브라우저로 페이지 전송 완료 (GET / 200) ✅
3. **브라우저가 추가 리소스(layout.js) 요청**
4. ❌ 파일 접근 실패 (UNKNOWN error -4094)

### Windows 특유의 문제
- **파일 핸들 지연 해제**: Windows는 파일을 닫은 후에도 핸들을 즉시 해제하지 않음
- **동시 접근 충돌**: Webpack의 파일 감시 시스템과 HTTP 서버의 파일 읽기가 충돌
- **Hot Reload 부작용**: Next.js가 파일을 열어놓은 상태에서 브라우저 요청 처리

### 재현 조건
- ✓ Windows 10/11
- ✓ Next.js 15.5.9
- ✓ 대용량 모듈 (6597개 모듈, React Flow, Ant Design, SurveyJS)
- ✓ 빠른 페이지 전환

## ✅ 해결 방법

### 방법 1: Next.js Turbo Mode (🌟 권장)

**Turbo Mode는 Rust 기반 엔진으로 Windows 파일 시스템 문제를 근본적으로 해결합니다.**

```bash
npm run dev:turbo
```

**장점:**
- ✅ Windows 파일 시스템 안정성 향상
- ✅ 빌드 속도 10배 이상 개선
- ✅ 메모리 사용량 감소
- ✅ 파일 락 문제 없음

**주의사항:**
- Turbo Mode는 아직 beta 기능입니다
- 일부 webpack 플러그인과 호환되지 않을 수 있습니다

---

### 방법 2: 개선된 Webpack 설정 (현재 적용됨)

`next.config.mjs`에 다음 설정이 적용되어 있습니다:

```javascript
webpack: (config, { isServer, dev }) => {
  config.cache = false; // 파일 시스템 캐시 비활성화
  
  if (dev) {
    // 폴링 방식으로 파일 감시 (파일 락 방지)
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.git', '**/.next'],
    };
    
    // 스냅샷 기능 완전 비활성화 (Windows 파일 락 방지)
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
      buildDependencies: { hash: false, timestamp: false },
      module: { hash: false, timestamp: false },
      resolve: { hash: false, timestamp: false },
      resolveBuildDependencies: { hash: false, timestamp: false },
    };
  }
  return config;
},

onDemandEntries: {
  maxInactiveAge: 60 * 1000, // 페이지 유지 시간 증가
  pagesBufferLength: 5,      // 버퍼 크기 증가
},
```

---

### 방법 3: 수동 캐시 관리

**오류 발생 시마다 실행:**

```bash
# 서버 종료 (Ctrl+C)
rm -rf .next
npm run dev
```

**자동화 스크립트 사용:**

```bash
npm run dev:clean  # .next 자동 삭제 후 시작
```

---

### 방법 4: 진단 도구 사용

**문제 분석:**

```bash
npm run diagnose
```

**출력 예시:**
- .next 디렉토리 구조 확인
- layout.js 파일 존재 여부
- 파일 크기 및 수정 시간
- 파일 핸들 접근 테스트
- 실시간 파일 변경 모니터링

---

## 🎯 최종 권장 사항

### 1단계: Turbo Mode 시도
```bash
npm run dev:turbo
```

### 2단계: 여전히 오류 발생 시
```bash
# 서버 종료 후
npm run dev:clean
```

### 3단계: 근본적 해결
```bash
# 프로젝트 재빌드
rm -rf node_modules .next
npm install
npm run dev:turbo
```

---

## 📊 성능 비교

| 모드 | 빌드 속도 | 안정성 | Windows 호환성 |
|------|-----------|--------|----------------|
| **Turbo Mode** | ⚡ 매우 빠름 | ✅ 우수 | ✅ 최상 |
| Webpack (개선) | 🐢 느림 | ⚠️ 보통 | ⚠️ 문제 있음 |
| 기본 설정 | 🐢 느림 | ❌ 불안정 | ❌ 심각 |

---

## 🔧 추가 해결 방법

### Windows Defender 제외 설정
1. Windows 보안 → 바이러스 및 위협 방지
2. 설정 관리 → 제외 추가
3. `C:\ws\simul1\survey-app\.next` 폴더 추가

### 백신 실시간 감시 제외
일부 백신 소프트웨어가 .next 폴더를 감시하여 문제 발생 가능

### WSL2 사용 (최종 수단)
Windows Subsystem for Linux 2를 사용하면 Linux 파일 시스템으로 실행 가능

---

## 📞 문제 지속 시 체크리스트

- [ ] `npm run dev:turbo` 시도
- [ ] `npm run dev:clean` 시도
- [ ] `npm run diagnose` 실행하여 로그 확인
- [ ] Windows Defender 제외 설정
- [ ] 백신 실시간 감시 제외
- [ ] 다른 터미널 (PowerShell, CMD) 시도
- [ ] 관리자 권한으로 실행
- [ ] 프로젝트를 짧은 경로로 이동 (예: C:\dev\app)

---

## 🎉 성공 확인

서버가 정상 실행되면:

```
✓ Ready in 4.2s
○ Compiling / ...
✓ Compiled / in 5.8s (6597 modules)
GET / 200 in 6123ms
```

**오류 없이 "GET / 200" 이후 추가 요청 처리됨** ✅

---

## 📚 참고 자료

- [Next.js Turbo Mode 공식 문서](https://nextjs.org/docs/architecture/turbopack)
- [Windows File System Issues](https://github.com/vercel/next.js/issues?q=windows+UNKNOWN+error)
- [Webpack Watch Options](https://webpack.js.org/configuration/watch/)
