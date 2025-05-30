"use client";

import { useRouteLoaderStore } from "@/store/useRouteLoaderStore";
import styles from "@/styles/common/routeChangeLoader.module.scss";
import { useEffect, useRef, useState } from "react";

export default function RouteChangeLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isAnimating = useRouteLoaderStore((s) => s.isAnimating);
  const stopAnimation = useRouteLoaderStore((s) => s.stopAnimation);
  const [viewBox, setViewBox] = useState("0 0 1920 1080");

  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight * 2;
      setViewBox(`0 0 ${w} ${h}`);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getLoaderHeight = () => {
    return (
      loaderRef.current?.getBoundingClientRect().height ||
      window.innerHeight + 400
    );
  };

  const setPath = (curve: number) => {
    const w = window.innerWidth;
    const h = getLoaderHeight();

    const d = `
      M0 0
      L${w} 0
      L${w} ${h}
      Q${w / 2} ${h - curve} 0 ${h}
      L0 0
    `;

    if (pathRef.current) {
      pathRef.current.setAttribute("d", d);
    }
  };

  const easeOutQuad = (
    time: number,
    start: number,
    change: number,
    duration: number
  ) => {
    time /= duration;
    return -change * time * (time - 2) + start;
  };

  const animateLoader = () => {
    const duration = 800;
    const initialCurve = 300;
    let start: number | null = null;

    const loop = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const curve = easeOutQuad(elapsed, initialCurve, -initialCurve, duration);
      const top = easeOutQuad(elapsed, 0, -getLoaderHeight(), duration);

      if (loaderRef.current) {
        loaderRef.current.style.top = `${top}px`;
      }

      setPath(curve);

      if (elapsed < duration) {
        requestAnimationFrame(loop);
      } else {
        if (loaderRef.current) {
          loaderRef.current.style.top = `-${getLoaderHeight()}px`;
          loaderRef.current.style.transition = "opacity 0.05s ease";
          loaderRef.current.style.opacity = "0";
        }

        setTimeout(() => {
          if (loaderRef.current) {
            loaderRef.current.style.display = "none";
          }
          stopAnimation();
        }, 300);
        setPath(0);
      }
    };

    requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (isAnimating) {
      if (loaderRef.current) {
        loaderRef.current.style.display = "block";
        loaderRef.current.style.opacity = "1";
        loaderRef.current.style.top = "0px";
      }
      setPath(300);
      animateLoader();
    }
  }, [isAnimating]);

  return (
    <div ref={loaderRef} className={styles.loader}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox={viewBox}
        className={styles.svg}
      >
        <path ref={pathRef} fill="#000" className={styles.path} />
      </svg>
    </div>
  );
}
