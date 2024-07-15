"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const path = usePathname();
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link> {path === "/" ? "🥳" : ""}
        </li>
        <li>
          <Link href="/about">About</Link> {path === "/about" ? "🥳" : ""}
        </li>
        <li>
          <Link href="/project">Project</Link>
          {path === "/project" ? "🥳" : ""}
        </li>
        <li>
          <Link href="/contact">Contact</Link>
          {path === "/contact" ? "🥳" : ""}
        </li>
      </ul>
    </nav>
  );
}
