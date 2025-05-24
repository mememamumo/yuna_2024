"use client";

import styles from "@/styles/interactive/marquee.module.scss";
import { useState } from "react";

type MarqueeProps = {
  words: string[];
};

export default function Marquee({ words }: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.marqueeWrapper}>
        <div className={`${styles.track} ${isPaused ? styles.paused : ""}`}>
          {words.concat(words).map((word, i) => (
            <span key={i} className={styles.word}>
              {word}&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
