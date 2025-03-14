"use client";

import {
  Education,
  getCertifications,
  getEducation,
  getWorkExperience,
  WorkExperience,
} from "@/lib/api";
import { useEffect, useState } from "react";

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

      {/* profile */}
      <section>
        <h3>Web Service Planning, Development & Operations Expert</h3>
        <p>
          Starting as a web publisher, I have expanded my expertise to web
          planning and project management, gaining experience in the entire web
          service development process, from planning and UI development to
          publishing and project operation. When planners understand development
          and developers understand planning and design, projects can be
          approached more comprehensively and from diverse perspectives. With
          expertise in HTML, CSS, JavaScript, and React, I specialize in
          building responsive and cross-browser web pages, optimizing web
          accessibility and SEO, designing UI/UX, and managing projects using
          Agile methodologies to deliver user-centric, optimized web services.
        </p>
        <p>
          웹 퍼블리셔로 시작하여 웹 기획 및 프로젝트 매니지먼트까지 경험하며,
          기획부터 UI 개발, 퍼블리싱, 프로젝트 운영까지 웹 서비스 구축의
          전반적인 과정을 수행해 왔습니다. 기획자가 개발을 이해하고, 개발자가
          기획과 디자인을 이해할 때, 프로젝트는 더욱 입체적이고 다양한 관점에서
          접근할 수 있습니다. HTML, CSS, JavaScript, React를 활용한 반응형 웹 및
          크로스 브라우징 웹 페이지 제작, 웹 접근성 및 SEO 최적화, UI/UX 설계 및
          서비스 기획, 애자일 프로젝트 관리 등의 역량을 바탕으로 사용자 중심의
          최적화된 웹 서비스를 제공합니다.
        </p>
      </section>

      {/* about */}
      <section>
        <h3>About</h3>
        <h4>경력</h4>
        <div>
          {workExperience.map((work, index) => {
            return (
              <ul>
                <li key={index}>{work.company}</li>
                <li key={index}>{work.period}</li>
                <li key={index}>{work.position}</li>
                <li key={index}>
                  {work.responsibilities.map((resp) => {
                    return <p>{resp}</p>;
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
            return <li key={index}>{cert}</li>;
          })}
        </ul>
      </section>
    </div>
  );
}
