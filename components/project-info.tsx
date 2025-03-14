import { getPortfolio } from "@/lib/api";

async function getProject(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const portfolio = await getPortfolio(); // API 호출
  const project = portfolio.projectExperience.find(
    (project: { id: string }) => project.id === id
  );
  return project || null;
}

export default async function ProjectInfo({ id }: { id: string }) {
  const project = await getProject(id);

  if (!project) {
    return <h1>프로젝트를 찾을 수 없습니다</h1>;
  }

  return (
    <>
      <p>{JSON.stringify(project.id)}</p>
      <p>{JSON.stringify(project.projectName)}</p>
    </>
  );
}
