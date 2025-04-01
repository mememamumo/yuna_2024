"use client";

import { ProjectExperience } from "@/lib/api";
import Link from "next/link";

export default function ProjectDetail({
  detail,
}: {
  detail: ProjectExperience;
}) {
  if (!detail) {
    return <h1>프로젝트를 찾을 수 없습니다.</h1>;
  }

  return (
    <>
      <div className="project-info">
        <h2>{detail.projectName}</h2>

        {/* 역할(Role) */}
        <section>
          <h2>역할</h2>
          <ul>
            {detail.role.map((role: string, index: number) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
        </section>

        {/* 사용 기술(Technologies) */}
        <section>
          <h2>사용 기술</h2>
          <ul>
            {detail.technologies.map((tech: string, index: number) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </section>

        {/* 개요(Overview) */}
        <section>
          <h2>개요</h2>
          <ul>
            {detail.overview.map((desc: string, index: number) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </section>

        {/* 작업(Tasks) */}
        <section>
          <h2>작업</h2>
          <ul>
            {detail.tasks.map((task: string, index: number) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </section>

        {/* 성과(Achievements) */}
        <section>
          <h2>성과</h2>
          <ul>
            {detail.achievements.map((achievement: string, index: number) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* 다음 프로젝트가 있을 때 링크 추가 */}
      {detail.nextProject && (
        <Link href={`/project/${detail.nextProject.id}`}>
          다음 프로젝트 보기: {detail.nextProject.projectName}
        </Link>
      )}
    </>
  );
}
