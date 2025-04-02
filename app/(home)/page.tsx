"use client";

import dynamic from "next/dynamic";

// CSR 전용 FallingUI
const FallingUI = dynamic(() => import("@/components/interactive/FallingUI"), {
  ssr: false,
});

import {
  Education,
  getCertifications,
  getEducation,
  getWorkExperience,
  WorkExperience,
} from "@/lib/api";
import { Suspense, useEffect, useState } from "react";

export default function Main() {
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

  return (
    <div className="portfolio-main">
      <h2>YUNA2025</h2>

      <Suspense fallback={null}>
        <FallingUI />
      </Suspense>

      {/* profile */}
      <section>
        <h3>Web Service Planning, Development & Operations Expert</h3>
        <ul>
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

        <p>
          Bridging planning and publishing to create purposeful, structured
          digital experiences.
        </p>
        <p>
          웹 퍼블리셔로 커리어를 시작해 웹 기획과 프로젝트 매니지먼트까지
          경험하며,기획부터 UI 개발, 퍼블리싱, 운영에 이르기까지 웹 서비스
          구축의 전 과정을 직접 수행해 왔습니다. 기획자가 개발을 이해하고,
          개발자가 기획과 디자인을 이해할 때프로젝트는 더욱 입체적이고 다양한
          관점에서 완성됩니다.
        </p>
        <p>
          HTML, CSS, JavaScript, React를 기반으로 한 반응형 웹 제작과 크로스
          브라우징 대응,웹 접근성과 SEO 최적화, UI/UX 설계 및 서비스 기획,
          애자일 방식의 프로젝트 운영까지—사용자 중심의 최적화된 웹 서비스를
          만드는 데 집중하고 있습니다.
        </p>
      </section>

      {/* about */}
      <section>
        <h3>About</h3>
        <h4>경력</h4>
        <div>
          {workExperience.map((work) => {
            return (
              <ul key={work.id}>
                <li>{work.company}</li>
                <li>{work.period}</li>
                <li>{work.position}</li>
                <li>
                  {work.responsibilities.map((resp, index) => {
                    return <p key={`${work.id}-resp-${index}`}>{resp}</p>;
                  })}
                </li>
              </ul>
            );
          })}
        </div>

        <h4>교육</h4>
        <ul>
          {education && <li>{education.university}</li>}
          {education && <li>{education.course}</li>}
        </ul>

        <h4>자격증</h4>
        <ul>
          {certifications.map((cert, index) => {
            return <li key={`cert-${index}`}>{cert}</li>;
          })}
        </ul>
      </section>
    </div>
  );
}
