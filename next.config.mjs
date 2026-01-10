/** @type {import('next').NextConfig} */
const nextConfig = {
  // Windows 파일 시스템 문제 해결
  webpack: (config, { isServer }) => {
    // 파일 시스템 캐싱 비활성화
    config.cache = false;
    return config;
  },
  // 개발 서버 설정
  onDemandEntries: {
    // 페이지가 메모리에 유지되는 시간 (ms)
    maxInactiveAge: 25 * 1000,
    // 동시에 유지할 페이지 수
    pagesBufferLength: 2,
  },
  // 정적 페이지 생성 비활성화 (개발 환경)
  generateBuildId: async () => {
    return 'development'
  },
};

export default nextConfig;
