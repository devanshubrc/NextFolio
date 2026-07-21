import React from 'react';
import type { ResumeData } from '../../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: TemplateProps) {
  const { personal, summary, skills, experience, education, projects, certifications, languages, achievements } = data;

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
    <div className="bg-white text-zinc-800 p-10 font-sans w-full h-full min-h-[1123px] box-border shadow-inner flex flex-col gap-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Name and Job Title */}
      <div className="flex justify-between items-start border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{personal.jobTitle || 'Target Role'}</p>
        </div>

        <div className="flex flex-col items-end gap-0.5 text-right text-xs text-zinc-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {(personal.linkedin || personal.github || personal.website) && (
            <div className="flex flex-wrap gap-2 justify-end">
              {personal.linkedin && <span>In: {personal.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}</span>}
              {personal.github && <span>Git: {personal.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}</span>}
              {personal.website && <span>Web: {personal.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summaryText && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Profile</p>
          <p className="text-sm text-zinc-600 leading-relaxed text-justify">{summaryText}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Experience</p>
          <div className="flex flex-col gap-4">
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
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-zinc-400 font-medium">
                    {exp.startDate || 'Start'} – {currentlyWorking ? 'Present' : (exp.endDate || 'End')}
                  </div>
                  <div className="col-span-3 flex flex-col gap-1">
                    <div className="flex justify-between items-baseline leading-none">
                      <span className="font-bold text-sm text-zinc-800">{exp.role || 'Job Role'}</span>
                      <span className="text-xs text-zinc-400 font-medium italic">{exp.company || 'Company'} {exp.employmentType && `(${exp.employmentType})`} {exp.location && `, ${exp.location}`}</span>
                    </div>

                    {descBullets.length > 0 && (
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-zinc-600 leading-relaxed">
                        {descBullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {expAchievements.length > 0 && (
                      <div className="mt-1 pl-4 text-xs text-zinc-500">
                        <span className="font-semibold">Achievements:</span>
                        <ul className="list-circle pl-4 space-y-0.5 mt-0.5">
                          {expAchievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {expTech.length > 0 && (
                      <div className="mt-1 pl-4 text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-500">Tech:</span> {expTech.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Projects</p>
          <div className="flex flex-col gap-3">
            {projects.map((proj) => {
              const title = proj.title || (proj as any).name || 'Project Name';
              const link = proj.github || proj.liveDemo || (proj as any).link || '';
              const desc = proj.description || '';
              const features = Array.isArray(proj.features) ? proj.features : [];
              const tech = Array.isArray(proj.technologies) ? proj.technologies : [];

              return (
                <div key={proj.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-zinc-400 font-medium">
                    {proj.duration || 'Featured'}
                  </div>
                  <div className="col-span-3 flex flex-col gap-1">
                    <div className="flex justify-between items-baseline leading-none">
                      <span className="font-bold text-sm text-zinc-800">
                        {title} {proj.role && <span className="text-xs font-normal text-zinc-500">({proj.role})</span>}
                      </span>
                      {link && <span className="text-xs text-zinc-400">{link}</span>}
                    </div>
                    {desc && <p className="text-xs text-zinc-600 leading-relaxed mt-1">{desc}</p>}
                    
                    {features.length > 0 && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs text-zinc-500">
                        {features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}

                    {tech.length > 0 && (
                      <div className="text-xs text-zinc-400 mt-1">
                        <span className="font-semibold text-zinc-500">Tech:</span> {tech.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-4">
        {allSkills.length > 0 && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 pl-4">
              {allSkills.map((skill, i) => (
                <span key={i} className="after:content-['/'] after:ml-4 last:after:content-none font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Languages</p>
            <div className="flex flex-col gap-1 text-xs text-zinc-600 pl-4">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between max-w-[200px]">
                  <span className="font-semibold text-zinc-700">{lang.language}</span>
                  <span className="text-zinc-400 italic text-[11px]">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Education</p>
          <div className="flex flex-col gap-3">
            {education.map((edu) => {
              const degree = edu.degree || 'Degree';
              const specialization = edu.specialization || (edu as any).field || '';
              const university = edu.university || (edu as any).institution || 'School Name';
              const startYear = edu.startYear || (edu as any).startDate || '';
              const endYear = edu.endYear || (edu as any).endDate || '';
              const cgpa = edu.cgpa || (edu as any).gpa || '';

              return (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-zinc-400 font-medium">
                    {startYear} – {endYear}
                  </div>
                  <div className="col-span-3 flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline leading-none">
                      <span className="font-bold text-sm text-zinc-800">{degree} {specialization && `in ${specialization}`}</span>
                      {cgpa && <span className="text-xs text-zinc-400">GPA: {cgpa}</span>}
                    </div>
                    <div className="text-xs text-zinc-500">{university} {edu.location && `— ${edu.location}`}</div>
                    {edu.coursework && (
                      <div className="text-[10px] text-zinc-400 mt-1">
                        <span className="font-semibold text-zinc-500">Coursework:</span> {edu.coursework}
                      </div>
                    )}
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
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Certifications</p>
            <div className="flex flex-col gap-1.5 pl-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-zinc-600 flex justify-between">
                  <span className="font-medium text-zinc-700">{cert.title}</span>
                  <span className="text-zinc-400 italic text-[10px] ml-2">{cert.organization}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Achievements</p>
            <div className="flex flex-col gap-1.5 pl-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="text-xs text-zinc-600 flex justify-between">
                  <span className="font-medium text-zinc-700">{ach.title}</span>
                  <span className="text-zinc-400 italic text-[10px] ml-2">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
