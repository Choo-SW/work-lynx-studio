/** @type {import('next').NextConfig} */
const nextConfig = {
  // Windows 파일 시스템 문제 해결
  webpack: (config, { isServer, dev }) => {
    // 파일 시스템 캐싱 완전 비활성화
    config.cache = false;
    
    // 파일 시스템 감시 설정 (Windows 최적화)
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
        poll: 1000, // 폴링 간격 (ms)
        aggregateTimeout: 300,
      };
      
      // 스냅샷 비활성화 (Windows 파일 락 방지)
      config.snapshot = {
        managedPaths: [],
        immutablePaths: [],
        buildDependencies: {
          hash: false,
          timestamp: false,
        },
        module: {
          hash: false,
          timestamp: false,
        },
        resolve: {
          hash: false,
          timestamp: false,
        },
        resolveBuildDependencies: {
          hash: false,
          timestamp: false,
        },
      };
    }
    
    return config;
  },
  
  // 개발 서버 설정
  onDemandEntries: {
    // 페이지가 메모리에 유지되는 시간 (ms)
    maxInactiveAge: 60 * 1000, // 60초로 증가
    // 동시에 유지할 페이지 수
    pagesBufferLength: 5, // 5개로 증가
  },
  
  // 정적 페이지 생성 비활성화 (개발 환경)
  generateBuildId: async () => {
    return 'development'
  },
  
  // 실험적 기능
  experimental: {
    webpackBuildWorker: false, // 워커 프로세스 비활성화
  },
  
  // 출력 설정
  outputFileTracingIncludes: {},
  outputFileTracingExcludes: {},
};

export default nextConfig;
