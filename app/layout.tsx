import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCCINS Work Lynx Studio - Form Builder",
  description: "LowCode 기반 Progressive Disclosure 결재 양식 빌더 | SaaS-Legacy 통합 에지 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={koKR}
            theme={{
              token: {
                colorPrimary: "#1890ff",
                borderRadius: 6,
                fontSize: 14,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
