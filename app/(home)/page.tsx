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

import PageFadeWrapper from "@/components/common/PageFadeWrapper";
import Marquee from "@/components/interactive/Marquee";
import ProfileButtons from "@/components/section/ProfileButtons";
import { capabilitiesWords } from "@/lib/data/marqueeWords";
import styles from "@/styles/page/home.module.scss";

export default function Main() {
  // throw new Error("강제 500 에러");
  return (
    <PageFadeWrapper>
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
    </PageFadeWrapper>
  );
}
