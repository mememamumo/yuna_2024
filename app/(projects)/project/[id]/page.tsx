import { Suspense } from "react";
import ProjectDetails from "../../../../components/project-details";
import ProjectInfo from "../../../../components/project-info";

export default async function ProjectDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h3>Project detail page</h3>
      <Suspense fallback={<h1>Loading project info</h1>}>
        <ProjectInfo id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading project details</h1>}>
        <ProjectDetails id={id} />
      </Suspense>
    </div>
  );
}
