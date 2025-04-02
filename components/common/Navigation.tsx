"use client";

import Portal from "@/components/Portal";
import { Contact, getContact } from "@/lib/api";
import styles from "@/styles/common/header.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Navigation() {
  const path = usePathname();

  const [isVisible, setIsVisible] = useState(false);
  const [showWrapper, setShowWrapper] = useState(false);
  const [isCardActive, setIsCardActive] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contactInfo, setContactInfo] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTypingStart, setIsTypingStart] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    setShowWrapper(false);
    setIsCardActive(false);
    setShowContent(false);
  }, [path]);

  const fetchContactInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Contact = await getContact();
      setContactInfo(data);
    } catch (error) {
      setError("연락처 정보를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  const openContact = () => {
    setIsVisible(true);
    setShowWrapper(false);
    setIsCardActive(false);
    setShowContent(false);
    fetchContactInfo();

    setTimeout(() => setShowWrapper(true), 20);
    setTimeout(() => setIsCardActive(true), 100);
    setTimeout(() => setShowContent(true), 1100);
  };

  const closeContact = () => {
    setShowContent(false);
    setIsCardActive(false);
    setTimeout(() => setShowWrapper(false), 1000);
    setTimeout(() => setIsVisible(false), 1600);
  };

  useEffect(() => {
    if (isCardActive) {
      const timeout = setTimeout(() => {
        setIsTypingStart(true);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        setIsTypingStart(false);
      };
    }
  }, [isCardActive]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/project" className={styles.navLink}>
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Project</span>
            <span className={`${styles.text} ${styles.bottom}`}>Project</span>
          </div>
        </Link>
        <button className={styles.navLink} onClick={openContact}>
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Contact</span>
            <span className={`${styles.text} ${styles.bottom}`}>Contact</span>
          </div>
        </button>
      </nav>

      {isVisible && (
        <Portal>
          <div
            className={`${styles.cardWrapper} ${
              showWrapper ? styles.visible : ""
            }`}
            onClick={closeContact}
          >
            <div
              className={`${styles.card} ${
                isCardActive ? styles.open : styles.close
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.rotatingBackground}
                style={{
                  WebkitMaskImage: "url(/mask-shape.svg)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "cover",
                  WebkitMaskPosition: "center",
                  maskImage: "url(/mask-shape.svg)",
                  maskRepeat: "no-repeat",
                  maskSize: "cover",
                  maskPosition: "center",
                }}
              ></div>
              <div
                className={`${styles.cardContent} ${
                  showContent ? styles.visible : ""
                }`}
              >
                {loading ? (
                  <p className={styles.notice}>Loading...</p>
                ) : contactInfo ? (
                  <>
                    {isTypingStart && (
                      <p className={styles.typingArea}>
                        <Typewriter
                          words={["디자인을 코드로 · 계획을 경험으로"]}
                          loop={Infinity}
                          cursor
                          cursorStyle="|"
                          typeSpeed={70}
                          deleteSpeed={50}
                          delaySpeed={1000}
                        />
                      </p>
                    )}
                    <p className={styles.name}>{contactInfo.name}</p>
                    <p className={styles.phone}>{contactInfo.phone}</p>
                    <p className={styles.email}>{contactInfo.email}</p>
                    <address className={styles.address}>
                      Seoul, Republic of Korea
                    </address>
                    <p className={styles.copyright}>
                      ©ALL RIGHTS RESERVED BY YUNA
                    </p>
                  </>
                ) : (
                  <span className={styles.notice}>
                    💡 정보를 불러올 수 없습니다
                  </span>
                )}
                <button
                  className={styles.closeButton}
                  onClick={closeContact}
                  aria-label="닫기"
                >
                  <span className="visuallyHidden">닫기</span>
                  <span className={styles.bar}></span>
                  <span className={styles.bar}></span>
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
