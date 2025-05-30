import LayoutClient from "@/components/common/LayoutClient";
import "@/styles/globals.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | YUNA — Where UI Meets Code and Strategy",
    default: "YUNA — Where UI Meets Code and Strategy",
  },
  description: "Portfolio - YUNA LEE",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
