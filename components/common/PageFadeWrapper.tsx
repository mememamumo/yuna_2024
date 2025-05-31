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
    // 로딩 시작 직후에도 콘텐츠는 렌더되도록 함
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50); // 곡선로딩보다 살짝만 느리게 시작
    return () => clearTimeout(timer);
  }, []); // mount 시점 1회만 실행

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(0)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        minHeight: "100vh",
        position: "relative",
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}
