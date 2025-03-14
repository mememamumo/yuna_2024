import { getPortfolio } from "@/lib/api";

async function getDetail(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const portfolio = await getPortfolio(); // API 호출
  const project = portfolio.projectExperience.find(
    (project: { id: string }) => project.id === id
  );
  return project || null;
}

export default async function ProjectInfo({ id }: { id: string }) {
  const details = await getDetail(id);

  if (!details) {
    return <h1>프로젝트를 찾을 수 없습니다.</h1>;
  }

  return (
    <div className="project-info">
      <h2>{details.projectName}</h2>

      {/* 역할(Role) */}
      <section>
        <h2>역할</h2>
        <ul>
          {details.role.map((role: string, index: any) => (
            <li key={index}>{role}</li>
          ))}
        </ul>
      </section>

      {/* 사용 기술(Technologies) */}
      <section>
        <h2>사용 기술</h2>
        <ul>
          {details.technologies.map((tech: string, index: any) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </section>

      {/* 개요(Overview) */}
      <section>
        <h2>개요</h2>
        <ul>
          {details.overview.map((desc: string, index: any) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </section>

      {/* 작업(Tasks) */}
      <section>
        <h2>작업</h2>
        <ul>
          {details.tasks.map((task: string, index: any) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </section>

      {/* 성과(Achievements) */}
      <section>
        <h2>성과</h2>
        <ul>
          {details.achievements.map((achievement: string, index: any) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
