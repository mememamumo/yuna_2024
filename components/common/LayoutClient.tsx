"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import RouteChangeLoader from "./RouteChangeLoader";
import Splash from "./Splash";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [readyToShow, setReadyToShow] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [shouldSkipSplash, setShouldSkipSplash] = useState(false);

  useEffect(() => {
    // window flag 감지: Splash 스킵 여부
    const skip =
      typeof window !== "undefined" &&
      (window as any).__IS_ERROR_PAGE__ === true;
    setShouldSkipSplash(skip);
    setShowSplash(!skip); // Splash 보이기 여부 결정

    requestAnimationFrame(() => setReadyToShow(true));
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <RouteChangeLoader />

      <div
        style={{
          opacity: showSplash || !readyToShow ? 0 : 1,
          pointerEvents: showSplash ? "none" : "auto",
          transition: "opacity 0.3s ease",
          width: "100%",
          height: "100%",
        }}
      >
        <Header />
        {children}
      </div>

      {!shouldSkipSplash && showSplash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            background: "#fff",
          }}
        >
          <Splash onComplete={handleSplashComplete} />
        </div>
      )}
    </div>
  );
}
