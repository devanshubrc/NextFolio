import React from 'react';

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
  };
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  skills: string[];
  projects: {
    id: string;
    name: string;
    description: string;
    link: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
}

interface TemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-gray-900 p-8 font-serif leading-relaxed text-sm w-full h-full min-h-[1123px] box-border shadow-inner" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-800 mb-1">{personal.fullName || 'Your Name'}</h1>
        <p className="text-base italic text-gray-600 mb-2 font-sans">{personal.jobTitle || 'Target Job Title'}</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600 font-sans">
          {personal.email && (
            <span>✉ {personal.email}</span>
          )}
          {personal.phone && (
            <span>📞 {personal.phone}</span>
          )}
          {personal.location && (
            <span>📍 {personal.location}</span>
          )}
          {personal.linkedin && (
            <span>🔗 linkedin.com/in/{personal.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}</span>
          )}
          {personal.github && (
            <span>🐙 github.com/{personal.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-gray-800">
                  <span>{exp.role || 'Job Role'}</span>
                  <span className="text-xs font-normal font-sans text-gray-600">
                    {exp.startDate || 'Start'} – {exp.current ? 'Present' : (exp.endDate || 'End')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs italic text-gray-600 mb-1.5">
                  <span>{exp.company || 'Company Name'}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-gray-800">
                  <span>{proj.name || 'Project Name'}</span>
                  {proj.link && (
                    <span className="text-xs font-normal font-sans text-blue-600">{proj.link}</span>
                  )}
                </div>
                <p className="text-gray-700 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-gray-700">
            {skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-[8px] text-gray-400">•</span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gray-800">
                    {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                  </div>
                  <div className="text-xs text-gray-600 italic">
                    {edu.institution || 'School Name'} {edu.location && `— ${edu.location}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-sans text-gray-600">
                    {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                  </div>
                  {edu.gpa && <span className="text-xs text-gray-500 font-sans">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Certifications</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs">
                <span className="font-medium">{cert.name}</span>
                <span className="text-gray-500 font-sans shrink-0">{cert.issuer} {cert.date && `(${cert.date})`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
