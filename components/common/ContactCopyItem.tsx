"use client";

import styles from "@/styles/common/contactCopyItem.module.scss";
import { useEffect, useState } from "react";

interface ContactCopyItemProps {
  type: "email" | "phone";
  value: string;
  className?: string;
}

export default function ContactCopyItem({
  type,
  value,
  className = "",
}: ContactCopyItemProps) {
  const label = type === "email" ? "E-Mail" : "Phone";
  const [status, setStatus] = useState<"default" | "hover" | "copied">(
    "default"
  );

  useEffect(() => {
    if (status === "copied") {
      const timer = setTimeout(() => setStatus("default"), 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleCopy = () => {
    if (status === "hover") {
      navigator.clipboard.writeText(value);
      setStatus("copied");
    }
  };

  return (
    <button
      type="button"
      className={`${styles.wrapper} ${styles[status]} ${className}`}
      onMouseEnter={() => status === "default" && setStatus("hover")}
      onMouseLeave={() => status === "hover" && setStatus("default")}
      onClick={handleCopy}
    >
      <div className={styles.t1}>{value}</div>
      <div className={styles.t2}>Copy {label}</div>
      <div className={styles.t3}>Copied</div>
    </button>
  );
}
