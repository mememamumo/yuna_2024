import { Metadata } from "next";
import Navigation from "../components/navigation";
import "../styles/global.css";

export const metadata: Metadata = {
  title: {
    template: "%s | YUNA 2024",
    default: "YUNA 2024",
  },
  description: "2024 Portfolio",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
