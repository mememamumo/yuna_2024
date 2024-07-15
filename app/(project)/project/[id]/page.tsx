export default function ProjectDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  return <h1>Project {id}</h1>;
}
