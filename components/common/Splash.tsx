"use client";

import styles from "@/styles/common/splash.module.scss";
import { useEffect, useState } from "react";

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setExpanded(true), 1000);
    const fade = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onComplete, 1000);
    }, 5000);
    return () => {
      clearTimeout(start);
      clearTimeout(fade);
    };
  }, [onComplete]);

  return (
    <div className={`${styles.container} ${fadingOut ? styles.fadeOut : ""}`}>
      <div className={`${styles.box} ${expanded ? styles.expand : ""}`}>
        <span className={`${styles.ico} ${expanded ? styles.show : ""}`} />
      </div>
      <p className={styles.caption}>Where UI Meets Code and Strategy</p>
    </div>
  );
}
