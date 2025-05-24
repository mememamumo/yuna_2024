"use client";

import styles from "@/styles/section/profileButtons.module.scss";
import { useState } from "react";
import ProfilePanel from "./ProfilePanel";

const ProfileButton = () => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "profile" | "skills" | "background"
  >("profile");

  const openPanel = (tab: typeof selectedTab) => {
    setSelectedTab(tab);
    setIsPanelVisible(true);
  };

  return (
    <>
      <div className={styles.profileButtons}>
        <button
          className={`${styles.profileButton} ${styles.profile}`}
          onClick={() => openPanel("profile")}
        >
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Profile</span>
            <span className={`${styles.text} ${styles.bottom}`}>Profile</span>
          </div>
        </button>
        <button
          className={`${styles.profileButton} ${styles.skills}`}
          onClick={() => openPanel("skills")}
        >
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Skills</span>
            <span className={`${styles.text} ${styles.bottom}`}>Skills</span>
          </div>
        </button>
        <button
          className={`${styles.profileButton} ${styles.background}`}
          onClick={() => openPanel("background")}
        >
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Background</span>
            <span className={`${styles.text} ${styles.bottom}`}>
              Background
            </span>
          </div>
        </button>
        <a href="/" className={`${styles.profileButton} ${styles.resume}`}>
          <span className={styles.arrow}>Resume</span>
        </a>
      </div>

      <ProfilePanel
        isVisible={isPanelVisible}
        selectedTab={selectedTab}
        onClose={() => setIsPanelVisible(false)}
        onTabChange={(tab) => setSelectedTab(tab)}
      />
    </>
  );
};

export default ProfileButton;
