"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Splash 스킵 플래그 설정
    if (typeof window !== "undefined") {
      (window as any).__IS_ERROR_PAGE__ = true;
    }

    // 에러 로그 출력 (선택)
    console.error("500 ERROR PAGE:", error);
  }, [error]);

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
        500
        <span style={{ fontWeight: 300, marginLeft: "8px" }}>
          Internal Server Error
        </span>
      </h2>
    </div>
  );
}
