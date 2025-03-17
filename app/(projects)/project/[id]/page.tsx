import ProjectDetail from "@/components/project-detail";
import ProjectInfo from "@/components/project-info";
import { getProject } from "@/lib/api";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  return {
    title: project ? `${project.projectName}` : "Project Not Found",
  };
}

export default async function Project({
  params: { id },
}: {
  params: { id: string };
}) {
  const detail = await getProject(id);

  if (!detail) {
    return <h1>프로젝트를 찾을 수 없습니다.</h1>;
  }

  return (
    <>
      <h3>Project detail page</h3>
      <Suspense fallback={<h1>Loading project info</h1>}>
        <ProjectInfo id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading project detail</h1>}>
        <ProjectDetail detail={detail} />
      </Suspense>
    </>
  );
}
