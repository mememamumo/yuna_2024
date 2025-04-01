"use client";

import styles from "@/styles/common/header.module.scss";
import React, { useEffect, useState } from "react";
interface WavyTextProps {
  text: string;
}

const WavyText: React.FC<WavyTextProps> = ({ text }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);

      const baseDuration = 1600;
      const delayPerChar = 50;
      const extraBuffer = 300;
      const total =
        baseDuration + delayPerChar * (text.length - 1) + extraBuffer;

      setTimeout(() => setIsActive(false), total);
    }, 20000);

    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <h1
      className={`${styles.waveText} ${isActive ? styles.active : ""} `}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {text.split("").map((char, i) => {
        const isDivider = char === "≡";
        return (
          <span
            key={i}
            className={isDivider ? styles.divider : ""}
            style={{ "--i": i } as React.CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </h1>
  );
};

export default WavyText;
