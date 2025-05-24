import "@/styles/globals.scss";

import Header from "@/components/common/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | YUNA — Where UI Meets Code and Strategy",
    default: "YUNA — Where UI Meets Code and Strategy",
  },
  description: "2025 Portfolio",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 글로벌 폰트 연결 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
