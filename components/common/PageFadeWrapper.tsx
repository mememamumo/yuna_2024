"use client";

import { useRouteLoaderStore } from "@/store/useRouteLoaderStore";
import { useEffect, useState } from "react";

export default function PageFadeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAnimating = useRouteLoaderStore((s) => s.isAnimating);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      // 페이드인 시작
      const timer = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(timer);
    } else {
      setVisible(false); // 애니메이션 중엔 안 보이게
    }
  }, [isAnimating]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(0)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
