"use client";

import Navigation from "@/components/common/Navigation";
import WavyText from "@/components/interactive/WavyText";
import styles from "@/styles/common/header.module.scss";
import { useEffect, useState } from "react";
import CustomLink from "./CustomLink";

const Header = () => {
  const [timeString, setTimeString] = useState("");

  // 요일 & 시계 업데이트
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const time = timeFormatter.format(now);

      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const day = days[now.getDay()];

      setTimeString(`${day} ${time}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const useResponsiveText = () => {
    const [text, setText] = useState("YUNA - Where UI Meets Code and Strategy");

    useEffect(() => {
      const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        setText(
          isMobile
            ? "YUNA - Bridging UI & Code"
            : "YUNA - Where UI Meets Code and Strategy"
        );
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return text;
  };

  const responsiveText = useResponsiveText();

  return (
    <header className={styles.primaryNavigation}>
      <div className={styles.navContainer}>
        <div className={styles.timestamp}>{timeString}</div>
        <CustomLink href="/" className={styles.logo}>
          <WavyText text={responsiveText} />
        </CustomLink>
        <div className={styles.navRight}>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
