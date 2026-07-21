export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    portfolio: string;
    profileImage?: string; // base64 representation
  };
  summary: {
    professionalSummary: string;
  };
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries: string[];
    databases: string[];
    cloud: string[];
    devOps: string[];
    tools: string[];
    testing: string[];
    softSkills: string[];
  };
  languages: {
    id: string;
    language: string;
    proficiency: string; // Native | Fluent | Professional | Conversational
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    employmentType: string;
    location: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    description: string[];
    achievements: string[];
    technologies: string[];
  }[];
  education: {
    id: string;
    degree: string;
    specialization: string;
    university: string;
    location: string;
    startYear: string;
    endYear: string;
    cgpa: string;
    coursework: string;
  }[];
  projects: {
    id: string;
    title: string;
    role: string;
    duration: string;
    description: string;
    features: string[];
    technologies: string[];
    github: string;
    liveDemo: string;
  }[];
  certifications: {
    id: string;
    title: string;
    organization: string;
    issueDate: string;
    credentialId: string;
    credentialUrl: string;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
}
