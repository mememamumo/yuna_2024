import { getPortfolio } from "@/lib/api";
import Link from "next/link";

export const metadata = {
  title: "Project",
};

export default async function Project() {
  const portfolio = await getPortfolio();
  return (
    <ul>
      {portfolio.projectExperience.map(
        (project: { id: string; projectName: string }) => (
          <li key={project.id}>
            <Link href={`/project/${project.id}`}>
              {project.projectName}, id:{project.id}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}
