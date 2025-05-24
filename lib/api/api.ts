export const API_URL = process.env.NEXT_PUBLIC_PROJECT_API_URL;

export interface Contact {
  name: string;
  phone: string;
  email: string;
  portfolio: string;
  gitHub: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  period: string;
  position: string;
  responsibilities: string[];
}

export interface Education {
  university: string;
  course: string;
}

export interface ProjectExperience {
  id: string;
  projectName: string;
  role: string[];
  technologies: string[];
  overview: string[];
  tasks: string[];
  achievements: string[];
  nextProject?: ProjectExperience; // 선택적 필드 추가
}

export interface Portfolio {
  projectExperience: ProjectExperience[];
  workExperience: WorkExperience[];
  education: Education;
  certification: string[];
}

// 포트폴리오 전체 데이터를 가져오는 함수
export async function getPortfolio() {
  if (!API_URL) {
    console.error("🚨 API_URL이 설정되지 않았습니다.");
    return null;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
}

// 경력 데이터만 가져오는 함수
export async function getWorkExperience(): Promise<WorkExperience[]> {
  const portfolio = await getPortfolio();
  return portfolio.workExperience;
}

// 학력 데이터만 가져오는 함수
export async function getEducation(): Promise<Education | null> {
  const portfolio = await getPortfolio();
  if (portfolio && portfolio.education) {
    return portfolio.education;
  }
  return null;
}

// 자격증 데이터만 가져오는 함수
export async function getCertifications(): Promise<string[]> {
  const portfolio = await getPortfolio();
  return portfolio.certifications;
}

// 연락처 데이터만 가져오는 함수
export async function getContact(): Promise<Contact> {
  const portfolio = await getPortfolio();
  return portfolio.contact;
}

// 프로젝트 가져오는 함수
export async function getProject(
  id: string
): Promise<ProjectExperience | null> {
  const portfolio = await getPortfolio();
  const projects = portfolio.projectExperience;
  const currentIdx = projects.findIndex((p: ProjectExperience) => p.id === id);

  if (currentIdx === -1) return null;

  const project = projects[currentIdx];
  const nextProject = projects[currentIdx + 1] || null; // 다음 프로젝트

  return { ...project, nextProject }; // 다음 프로젝트 추가
}

// 다음 프로젝트 가져오는 함수
export async function getNextProject(
  currentId: string
): Promise<ProjectExperience | null> {
  const portfolio = await getPortfolio();
  const projects = portfolio.projectExperience;

  const currentIdx = projects.findIndex(
    (project: ProjectExperience) => project.id === currentId
  );
  if (currentIdx === -1 || currentIdx === projects.length - 1) {
    return null; // 마지막 프로젝트면 다음 프로젝트 없음
  }

  return projects[currentIdx + 1]; // 다음 프로젝트 반환
}
