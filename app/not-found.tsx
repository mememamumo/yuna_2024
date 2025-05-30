"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Splash 스킵 플래그 설정
    if (typeof window !== "undefined") {
      (window as any).__IS_ERROR_PAGE__ = true;
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#fff",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "10px" }}>
        404
        <span style={{ fontWeight: 300, marginLeft: "8px" }}>
          Page Not Found
        </span>
      </h2>
    </div>
  );
}
