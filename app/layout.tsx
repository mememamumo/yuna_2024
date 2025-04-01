import Header from "@/components/common/Header";
import "@/styles/global.scss";
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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
