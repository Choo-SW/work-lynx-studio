"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const templates: Template[] = [
  {
    id: "basic-approval",
    name: "기본 전자결재",
    description: "가장 기본적인 전자결재 양식. 제목, 내용, 신청자 정보 포함",
    icon: "📄",
    category: "기본"
  },
  {
    id: "vacation-request",
    name: "휴가 신청서",
    description: "연차/반차 휴가 신청을 위한 양식. 휴가 종류, 기간, 사유 포함",
    icon: "🏖️",
    category: "인사"
  },
  {
    id: "purchase-request",
    name: "품의서",
    description: "구매 품의 및 지출 요청 양식. 동적 품목 테이블, 금액 자동 계산 포함",
    icon: "🛒",
    category: "구매"
  },
  {
    id: "expense-approval",
    name: "지출결의서",
    description: "Legacy ERP 연동 지출결의서. Progressive Disclosure 적용",
    icon: "💰",
    category: "회계"
  }
];

export default function TemplateSelectorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← 홈으로
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            전자결재 템플릿 선택
          </h1>
          <p className="text-gray-600">
            미리 만들어진 템플릿을 선택하여 빠르게 양식을 만들어보세요
          </p>
        </div>

        {/* 빈 양식으로 시작 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎨</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                빈 양식으로 시작하기
              </h2>
              <p className="text-gray-700 mb-4">
                처음부터 직접 양식을 디자인하고 싶으신가요? 빈 캔버스에서 시작하세요.
              </p>
              <Link
                href="/builder"
                className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                빈 양식으로 시작 →
              </Link>
            </div>
          </div>
        </div>

        {/* 템플릿 목록 */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📋 템플릿 선택
          </h2>
          <p className="text-gray-600 mb-6">
            템플릿을 선택하면 기본 구조가 로드되며, 필요한 항목만 추가하거나 수정할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/builder/template/${template.id}`}
              className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {template.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-medium flex items-center gap-2">
                    이 템플릿으로 시작 →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 템플릿 사용 팁
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• 템플릿은 시작점입니다. 필드를 자유롭게 추가, 수정, 삭제할 수 있습니다.</li>
            <li>• 조건부 로직(Logic 탭)을 활용하여 동적인 양식을 만들 수 있습니다.</li>
            <li>• 완성된 양식은 JSON으로 내보내기하여 <code className="bg-blue-100 px-1 rounded">surveys/</code> 폴더에 저장하세요.</li>
            <li>• 저장한 양식은 <code className="bg-blue-100 px-1 rounded">/survey/파일명</code>으로 바로 사용할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
