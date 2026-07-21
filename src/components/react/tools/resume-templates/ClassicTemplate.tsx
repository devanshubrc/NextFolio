import React from 'react';
import type { ResumeData } from '../../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: TemplateProps) {
  const { personal, summary, skills, experience, education, projects, certifications, languages, achievements } = data;

  // Adapt summary
  const summaryText = summary?.professionalSummary || (personal as any).summary || '';

  // Adapt skills (handles both flat array from old data and categorized object from new data)
  const allSkills = Array.isArray(skills)
    ? skills
    : skills
      ? [
          ...(skills.programmingLanguages || []),
          ...(skills.frameworks || []),
          ...(skills.libraries || []),
          ...(skills.databases || []),
          ...(skills.cloud || []),
          ...(skills.devOps || []),
          ...(skills.tools || []),
          ...(skills.testing || []),
          ...(skills.softSkills || []),
        ]
      : [];

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
          {personal.website && (
            <span>🌐 {personal.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{summaryText}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => {
              const descBullets = Array.isArray(exp.description)
                ? exp.description
                : exp.description
                  ? (exp.description as string).split('\n').filter(Boolean)
                  : [];
              const expAchievements = Array.isArray(exp.achievements) ? exp.achievements : [];
              const expTech = Array.isArray(exp.technologies) ? exp.technologies : [];
              const currentlyWorking = exp.currentlyWorking || (exp as any).current;

              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-gray-800">
                    <span>{exp.role || 'Job Role'}</span>
                    <span className="text-xs font-normal font-sans text-gray-600">
                      {exp.startDate || 'Start'} – {currentlyWorking ? 'Present' : (exp.endDate || 'End')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs italic text-gray-600 mb-1.5">
                    <span>{exp.company || 'Company Name'} {exp.employmentType && `(${exp.employmentType})`}</span>
                    <span>{exp.location}</span>
                  </div>
                  
                  {descBullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">
                      {descBullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {expAchievements.length > 0 && (
                    <div className="mt-1 pl-5 text-xs text-gray-700">
                      <span className="font-semibold text-gray-800">Achievements:</span>
                      <ul className="list-circle pl-4 space-y-0.5 mt-0.5">
                        {expAchievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {expTech.length > 0 && (
                    <div className="mt-1 pl-5 text-xs text-gray-600 font-sans">
                      <span className="font-semibold text-gray-700">Technologies:</span> {expTech.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj) => {
              const title = proj.title || (proj as any).name || 'Project Name';
              const link = proj.github || proj.liveDemo || (proj as any).link || '';
              const desc = proj.description || '';
              const features = Array.isArray(proj.features) ? proj.features : [];
              const tech = Array.isArray(proj.technologies) ? proj.technologies : [];

              return (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline font-bold text-gray-800">
                    <span>{title} {proj.role && <span className="text-xs font-normal text-gray-500 font-sans">({proj.role})</span>}</span>
                    {link && (
                      <span className="text-xs font-normal font-sans text-blue-600">{link}</span>
                    )}
                  </div>
                  {proj.duration && <div className="text-[10px] text-gray-500 font-sans">{proj.duration}</div>}
                  {desc && <p className="text-gray-700 mt-1 text-xs">{desc}</p>}
                  
                  {features.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-700 text-xs">
                      {features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}

                  {tech.length > 0 && (
                    <div className="text-xs text-gray-600 font-sans mt-1">
                      <span className="font-semibold text-gray-700">Technologies:</span> {tech.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {allSkills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Skills</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-700 text-xs">
              {allSkills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="text-[8px] text-gray-400">•</span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Languages</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-700 text-xs">
              {languages.map((lang) => (
                <span key={lang.id} className="flex items-center gap-1.5">
                  <span className="text-[8px] text-gray-400">•</span>
                  {lang.language} ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => {
              const degree = edu.degree || 'Degree';
              const specialization = edu.specialization || (edu as any).field || '';
              const university = edu.university || (edu as any).institution || 'School Name';
              const startYear = edu.startYear || (edu as any).startDate || '';
              const endYear = edu.endYear || (edu as any).endDate || '';
              const cgpa = edu.cgpa || (edu as any).gpa || '';

              return (
                <div key={edu.id} className="flex justify-between items-start text-xs">
                  <div>
                    <div className="font-bold text-gray-800">
                      {degree} {specialization && `in ${specialization}`}
                    </div>
                    <div className="text-gray-600 italic">
                      {university} {edu.location && `— ${edu.location}`}
                    </div>
                    {edu.coursework && (
                      <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                        <span className="font-semibold">Coursework:</span> {edu.coursework}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-sans text-gray-600">
                      {startYear} – {endYear}
                    </div>
                    {cgpa && <span className="text-gray-500 font-sans block">GPA: {cgpa}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      <div className="grid grid-cols-2 gap-4">
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Certifications</h2>
            <div className="flex flex-col gap-1 text-gray-700 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <span className="font-medium">{cert.title}</span>
                  <span className="text-gray-500 font-sans shrink-0 ml-2">
                    {cert.organization} {cert.issueDate && `(${cert.issueDate})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-2 font-sans">Achievements</h2>
            <div className="flex flex-col gap-1 text-gray-700 text-xs">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline">
                  <span className="font-medium">{ach.title}</span>
                  <span className="text-gray-500 font-sans shrink-0 ml-2">
                    {ach.date && `(${ach.date})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
