import React from 'react';
import type { ResumeData } from '../../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: TemplateProps) {
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
    <div className="bg-white text-slate-800 font-sans w-full h-full min-h-[1123px] box-border shadow-inner flex" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Sidebar Column (Left) */}
      <div className="w-[32%] bg-slate-100 p-6 flex flex-col gap-6 border-r border-slate-200">
        
        {/* Profile Details */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">{personal.fullName || 'Your Name'}</h1>
          <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">{personal.jobTitle || 'Target Role'}</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Contact</h2>
          
          <div className="flex flex-col gap-2.5 text-xs text-slate-600">
            {personal.email && (
              <div className="break-all">
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">Email</span>
                {personal.email}
              </div>
            )}
            {personal.phone && (
              <div>
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">Phone</span>
                {personal.phone}
              </div>
            )}
            {personal.location && (
              <div>
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">Location</span>
                {personal.location}
              </div>
            )}
            {personal.linkedin && (
              <div className="break-all">
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">LinkedIn</span>
                {personal.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}
              </div>
            )}
            {personal.github && (
              <div className="break-all">
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">GitHub</span>
                {personal.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}
              </div>
            )}
            {personal.website && (
              <div className="break-all">
                <span className="font-semibold text-slate-500 block text-[9px] uppercase">Website</span>
                {personal.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map((skill, i) => (
                <span key={i} className="px-2 py-1 text-[10px] font-medium rounded bg-slate-200 text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Languages</h2>
            <div className="flex flex-col gap-1.5">
              {languages.map((lang) => (
                <div key={lang.id} className="text-xs text-slate-600 flex justify-between">
                  <span className="font-semibold text-slate-700">{lang.language}</span>
                  <span className="text-[10px] text-slate-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Certifications</h2>
            <div className="flex flex-col gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-700 leading-tight">{cert.title}</div>
                  <div className="text-[10px] text-slate-500">{cert.organization} {cert.issueDate && `(${cert.issueDate})`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Column (Right) */}
      <div className="w-[68%] p-8 flex flex-col gap-6">
        
        {/* Summary */}
        {summaryText && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">{summaryText}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Work Experience</h2>
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
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-sm text-slate-800">{exp.role || 'Job Role'}</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {exp.startDate || 'Start'} – {currentlyWorking ? 'Present' : (exp.endDate || 'End')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-baseline text-xs font-semibold text-slate-500 mb-2">
                      <span>{exp.company || 'Company'} {exp.employmentType && `(${exp.employmentType})`}</span>
                      <span className="font-normal italic">{exp.location}</span>
                    </div>

                    {descBullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
                        {descBullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {expAchievements.length > 0 && (
                      <div className="mt-1.5 pl-4 text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700">Achievements:</span>
                        <ul className="list-circle pl-4 space-y-0.5 mt-0.5">
                          {expAchievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {expTech.length > 0 && (
                      <div className="mt-1.5 pl-4 text-xs text-slate-500 font-semibold">
                        <span className="text-slate-400">Technologies:</span> {expTech.join(', ')}
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
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj) => {
                const title = proj.title || (proj as any).name || 'Project Name';
                const link = proj.github || proj.liveDemo || (proj as any).link || '';
                const desc = proj.description || '';
                const features = Array.isArray(proj.features) ? proj.features : [];
                const tech = Array.isArray(proj.technologies) ? proj.technologies : [];

                return (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-sm text-slate-800">
                        {title} {proj.role && <span className="text-xs font-normal text-slate-400">({proj.role})</span>}
                      </span>
                      {link && (
                        <span className="text-[10px] text-indigo-500 hover:underline">{link}</span>
                      )}
                    </div>
                    {proj.duration && <div className="text-[10px] text-slate-400 mb-1">{proj.duration}</div>}
                    {desc && <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>}
                    
                    {features.length > 0 && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs text-slate-500">
                        {features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}

                    {tech.length > 0 && (
                      <div className="text-[10px] text-slate-500 mt-1">
                        <span className="font-semibold text-slate-600">Tech:</span> {tech.join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Education</h2>
            <div className="flex flex-col gap-3">
              {education.map((edu) => {
                const degree = edu.degree || 'Degree';
                const specialization = edu.specialization || (edu as any).field || '';
                const university = edu.university || (edu as any).institution || 'School Name';
                const startYear = edu.startYear || (edu as any).startDate || '';
                const endYear = edu.endYear || (edu as any).endDate || '';
                const cgpa = edu.cgpa || (edu as any).gpa || '';

                return (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-slate-800">
                        {degree} {specialization && `in ${specialization}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {university} {edu.location && `— ${edu.location}`}
                      </div>
                      {edu.coursework && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          <span className="font-semibold">Coursework:</span> {edu.coursework}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-slate-400">
                        {startYear} – {endYear}
                      </div>
                      {cgpa && <span className="text-xs text-slate-500 block">GPA: {cgpa}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Achievements</h2>
            <div className="flex flex-col gap-2">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{ach.title}</span>
                    {ach.description && <p className="text-[11px] text-slate-500 mt-0.5">{ach.description}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold ml-2 shrink-0">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
