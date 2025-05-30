"use client";

import { useRouteLoaderStore } from "@/store/useRouteLoaderStore";
import { usePathname, useRouter } from "next/navigation";

export default function CustomLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const startAnimation = useRouteLoaderStore((s) => s.startAnimation);
  const isAnimating = useRouteLoaderStore((s) => s.isAnimating);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 현재 경로이거나 애니메이션 중이면 무시
    if (pathname === href || isAnimating) return;

    startAnimation(); // 이동한 페이지 위에서 애니메이션 실행
    router.push(href); // 페이지 먼저 이동
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
