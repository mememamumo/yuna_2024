"use client";

import Portal from "@/components/Portal";
import styles from "@/styles/section/profilePanel.module.scss";
import { useEffect, useState } from "react";

import {
  Education,
  getCertifications,
  getEducation,
  getWorkExperience,
  WorkExperience,
} from "@/lib/api/api";

type TabType = "profile" | "skills" | "background";

interface Props {
  isVisible: boolean;
  selectedTab: TabType;
  onClose: () => void;
  onTabChange: (tab: TabType) => void;
}

export default function ProfilePanel({
  isVisible,
  selectedTab,
  onClose,
  onTabChange,
}: Props) {
  const [mountBlob, setMountBlob] = useState(false);
  const [animateBlob, setAnimateBlob] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education | null>(null);
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const work = await getWorkExperience();
        const edu = await getEducation();
        const certs = await getCertifications();

        setWorkExperience(work);
        setEducation(edu ?? null);
        setCertifications(certs);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      setMountBlob(true);
      setAnimateBlob(false);
      setShowContent(false);

      setTimeout(() => {
        const blob = document.querySelector("#animatedBlob");
        if (blob) {
          void (blob as HTMLElement).offsetWidth;
          setAnimateBlob(true);
        }
      }, 30);

      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    } else {
      document.body.style.overflow = "";
      setAnimateBlob(false);
      setShowContent(false);
      setTimeout(() => setMountBlob(false), 800);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return (
          <section>
            <h2 className="visuallyHidden">Profile</h2>
            <p className={styles.bold}>
              이유나 <span>/ YUNA LEE</span>
            </p>
            <p className={styles.en}>
              Bridging planning and publishing to create purposeful, structured
              digital experiences.
            </p>
            <p>
              기획과 퍼블리싱을 아우르며, 목적에 맞고 구조적인 디지털 경험을
              만듭니다.
            </p>
            <p>
              웹 퍼블리셔로 커리어를 시작해 웹 기획과 프로젝트 매니지먼트까지
              경험하며,기획부터 UI 개발, 퍼블리싱, 운영에 이르기까지 웹 서비스
              구축의 전 과정을 직접 수행해 왔습니다.
              <br />
              기획자가 개발을 이해하고, 개발자가 기획과 디자인을 이해할 때
              프로젝트는 더욱 입체적이고 다양한 관점에서 완성됩니다.
            </p>
            <p>
              HTML, CSS, JavaScript, React를 기반으로 한 반응형 웹 제작과 크로스
              브라우징 대응, 웹 접근성과 SEO 최적화, UI/UX 설계 및 서비스 기획,
              애자일 방식의 프로젝트 운영까지 사용자 중심의 최적화된 웹 서비스를
              만드는 데 집중하고 있습니다.
            </p>
          </section>
        );
      case "skills":
        return (
          <section>
            <h2 className="visuallyHidden">Skills</h2>
            <div className={styles.box}>
              <h3 className={`${styles.en} ${styles.title}`}>
                1. Capabilities
                <span>/ 업무 수행 능력</span>
              </h3>
              <ul className={`${styles.content} ${styles.oneHalf}`}>
                <li>반응형 웹 구축 및 크로스 브라우징 최적화</li>
                <li>웹 접근성 및 SEO를 고려한 퍼블리싱</li>
                <li>UI/UX 중심의 인터페이스 설계 및 구현</li>
                <li>WebGL 및 Three.js 기반 3D 인터랙션 개발</li>
                <li>커스터마이징 가능한 플러그인·라이브러리 제작</li>
                <li>요구사항 분석 및 기능 정의</li>
                <li>애자일 기반 프로젝트 기획 및 운영</li>
                <li>사용자 행동 분석을 통한 콘텐츠 전략 기획</li>
                <li>와이어프레임 및 화면설계서 제작</li>
              </ul>
            </div>
            <div className={styles.box}>
              <h3 className={`${styles.en} ${styles.title}`}>
                2. Proficiencies
                <span>/ 기술 능력</span>
              </h3>
              <ul className={`${styles.content} ${styles.oneFourth}`}>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>React</li>
                <li>NextJS</li>
                <li>CSS Modules</li>
                <li>WebGL</li>
                <li>ThreeJS</li>
                <li>MatterJS</li>
                <li>Responsive Design</li>
                <li>Cross Browsing</li>
                <li>Web Accessibility</li>
                <li>SEO Optimization</li>
                <li>UI Development</li>
                <li>UX Strategy</li>
                <li>User Centered Design</li>
                <li>Agile Project</li>
                <li>Animation</li>
                <li>Interactive Web</li>
                <li>Creative Coding</li>
              </ul>
            </div>
          </section>
        );
      case "background":
        return (
          <section>
            <h2 className="visuallyHidden">Background</h2>
            <div className={styles.box}>
              <h3 className={`${styles.en} ${styles.title}`}>
                1. Work Experience
                <span>/ 경력</span>
              </h3>
              <ul className={`${styles.content} ${styles.contentList}`}>
                {workExperience.map((work) => {
                  return (
                    <li key={work.id}>
                      <b>
                        {work.company}
                        <span className={styles.position}>{work.position}</span>
                        <span className={styles.period}>{work.period}</span>
                      </b>
                      <div>
                        {work.responsibilities.map((resp, index) => {
                          return <p key={`${work.id}-resp-${index}`}>{resp}</p>;
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={styles.box}>
              <h3 className={`${styles.en} ${styles.title}`}>
                2. Education
                <span>/ 교육</span>
              </h3>
              <ul className={`${styles.content} ${styles.oneHalf}`}>
                {education && <li>{education.university}</li>}
                {education && <li>{education.course}</li>}
              </ul>
            </div>
            <div className={styles.box}>
              <h3 className={`${styles.en} ${styles.title}`}>
                3. Certifications
                <span>/ 자격증</span>
              </h3>
              <ul className={`${styles.content} ${styles.oneHalf}`}>
                {certifications.map((cert, index) => {
                  return <li key={`cert-${index}`}>{cert}</li>;
                })}
              </ul>
            </div>
          </section>
        );
    }
  };

  if (!isVisible && !mountBlob) return null;

  const tabs: TabType[] = ["profile", "skills", "background"];

  return (
    <Portal>
      <div className={styles.wrapper}>
        {mountBlob && (
          <div
            id="animatedBlob"
            className={`${styles.blob} ${animateBlob ? styles.active : ""}`}
          />
        )}

        <div
          className={`${styles.contentContainer} ${
            showContent ? styles.visible : ""
          }`}
        >
          <div className={styles.tabButtons}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={selectedTab === tab ? styles.active : ""}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>{renderContent()}</div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <span className="visuallyHidden">닫기</span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>
    </Portal>
  );
}
