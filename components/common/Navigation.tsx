"use client";

import Portal from "@/components/Portal";
import { Contact, getContact } from "@/lib/api";
import styles from "@/styles/common/header.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const path = usePathname();

  const [isContactOpen, setIsContactOpen] = useState(false); // 팝업 상태
  const [contactInfo, setContactInfo] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsContactOpen(false);
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

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/project" className={styles.navLink}>
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Project</span>
            <span className={`${styles.text} ${styles.bottom}`}>Project</span>
          </div>
        </Link>
        {/* {path === "/project" ? "🥳" : ""} */}
        <button
          className={styles.navLink}
          onClick={() => {
            setIsContactOpen(true);
            fetchContactInfo();
          }}
        >
          <div className={styles.textLayer}>
            <span className={`${styles.text} ${styles.top}`}>Contact</span>
            <span className={`${styles.text} ${styles.bottom}`}>Contact</span>
          </div>
        </button>
      </nav>
      {isContactOpen && (
        <Portal>
          <div className={styles.card}>
            {/* <button onClick={() => setIsContactOpen(false)}>닫기</button> */}
            {loading ? (
              <p className={styles.notice}>Loading...</p>
            ) : contactInfo ? (
              <ul>
                <li className={styles.name}>{contactInfo.name}</li>
                <li className={styles.phone}>{contactInfo.phone}</li>
                <li className={styles.email}>{contactInfo.email}</li>
              </ul>
            ) : (
              <span className={styles.notice}>
                💡 정보를 불러올 수 없습니다
              </span>
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
