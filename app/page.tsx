import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TCCINS Work Lynx Studio
          </h1>
          <p className="text-xl text-blue-600 font-semibold">Form Builder Module</p>
          <p className="text-gray-600 mt-2">
            Progressive Disclosure 기반 LowCode 결재 양식 빌더
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">💼 실전 시나리오</h2>
          <p className="text-gray-600 mb-6">
            Lynx Studio 기획서의 통합 시나리오를 구현한 실제 양식입니다.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/survey/expense-approval"
              className="block p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">📋</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">
                    지출결의서 (시나리오 4.1)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Gateway Server를 통한 Legacy ERP 실시간 연동 시나리오
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Progressive Disclosure - 프로젝트 선택 시 동적 필드 노출</li>
                    <li>✓ 실시간 예산 조회 - Legacy ERP API 시뮬레이션</li>
                    <li>✓ 조건부 경고 - 예산 부족/초과 시 자동 알림</li>
                    <li>✓ 동적 그리드 - 지출 항목 동적 추가/삭제</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🛠️ Form Builder (LowCode 도구)</h2>
          <p className="text-gray-600 mb-6">
            드래그 앤 드롭 방식으로 결재 양식을 직접 만들어 보세요.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/builder/template"
              className="block p-6 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">📋</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-600 mb-2">
                    템플릿으로 시작하기 (추천)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    미리 만들어진 전자결재 템플릿을 선택하고 필요한 항목만 수정
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ 기본 전자결재, 휴가신청서, 품의서 등</li>
                    <li>✓ 템플릿 기반으로 빠른 양식 제작</li>
                    <li>✓ 필드 추가/수정/삭제 자유롭게</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link 
              href="/builder"
              className="block p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎨</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    빈 양식으로 시작하기
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    처음부터 직접 양식을 디자인하고 JSON으로 내보내기
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ 드래그 앤 드롭 필드 추가</li>
                    <li>✓ 조건부 로직 시각적 설정</li>
                    <li>✓ 실시간 미리보기</li>
                    <li>✓ JSON 내보내기/가져오기</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🎓 학습 예제</h2>
          <p className="text-gray-600 mb-6">
            Form Builder의 다양한 기능을 학습할 수 있는 예제입니다.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/survey/basic"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-medium text-blue-600">기본 양식 예제</h3>
              <p className="text-sm text-gray-500 mt-1">
                텍스트, 이메일, 선택, 체크박스 등 기본 필드 타입
              </p>
            </Link>
            
            <Link 
              href="/survey/advanced"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-medium text-blue-600">고급 양식 예제</h3>
              <p className="text-sm text-gray-500 mt-1">
                조건부 로직, 다중 페이지, 매트릭스, 파일 업로드 등
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🏗️ Lynx Studio 아키텍처
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Control Plane (SaaS)</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Form Builder</strong> ← 현재 모듈</li>
                <li>• LowCode Builder Apps</li>
                <li>• AI Mapping Engine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Data Plane (Edge)</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Gateway Server (고객사 내부망)</li>
                <li>• Legacy System Adapters</li>
                <li>• RPA Bot Engine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
