import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
