"use client";

import { Contact, getContact } from "@/lib/api";
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
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link> {path === "/" ? "🥳" : ""}
          </li>
          <li>
            <Link href="/project">Project</Link>
            {path === "/project" ? "🥳" : ""}
          </li>
          <li>
            <button
              onClick={() => {
                setIsContactOpen(true);
                fetchContactInfo();
              }}
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>
      {isContactOpen && (
        <div>
          <div>
            <h2>Contact Info</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <>{error}</>
            ) : contactInfo ? (
              <>
                <ul>
                  <li>{contactInfo.name}</li>
                  <li>{contactInfo.phone}</li>
                  <li>{contactInfo.email}</li>
                </ul>
                <button onClick={() => setIsContactOpen(false)}>닫기</button>
              </>
            ) : (
              <>정보를 불러올 수 없습니다</>
            )}
          </div>
        </div>
      )}
    </>
  );
}
