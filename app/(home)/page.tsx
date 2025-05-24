"use client";

import dynamic from "next/dynamic";

// FallingUI
// const FallingUI = dynamic(() => import("@/components/interactive/FallingUI"), {
//   ssr: false,
// });

// RefractionCanvas
const RefractionCanvas = dynamic(
  () => import("@/components/interactive/refraction/RefractionCanvas"),
  { ssr: false }
);

import Marquee from "@/components/interactive/Marquee";
import { capabilitiesWords } from "@/lib/data/marqueeWords";

import ProfileButtons from "@/components/section/ProfileButtons";
import styles from "@/styles/page/home.module.scss";

export default function Main() {
  return (
    <div className={styles.portfolioMain}>
      <main className={styles.canvasContainer}>
        <RefractionCanvas />
        <div className={styles.infoNavigator}>
          <Marquee words={capabilitiesWords} />
          <ProfileButtons />
        </div>
      </main>

      {/* <Suspense fallback={null}>
        <FallingUI />
      </Suspense> */}
    </div>
  );
}
