import React from 'react';
import type { ResumeData } from '../../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: TemplateProps) {
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
    <div className="bg-white text-slate-800 font-sans w-full h-full min-h-[1123px] box-border shadow-inner flex flex-col gap-6" style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
      
      {/* Top Banner with Gradient strip */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none mb-1.5">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-semibold tracking-wider uppercase text-indigo-100">{personal.jobTitle || 'Target Career Track'}</p>
        </div>

        <div className="flex flex-col gap-1 text-xs text-indigo-50">
          {personal.email && <div className="flex items-center gap-1.5"><span>✉</span> {personal.email}</div>}
          {personal.phone && <div className="flex items-center gap-1.5"><span>📞</span> {personal.phone}</div>}
          {personal.location && <div className="flex items-center gap-1.5"><span>📍</span> {personal.location}</div>}
          <div className="flex flex-wrap gap-3 mt-1 text-[10px]">
            {personal.linkedin && <a href={`https://linkedin.com/in/${personal.linkedin}`} className="underline hover:text-white">LinkedIn</a>}
            {personal.github && <a href={`https://github.com/${personal.github}`} className="underline hover:text-white">GitHub</a>}
            {personal.website && <a href={`https://${personal.website}`} className="underline hover:text-white">Website</a>}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 grid grid-cols-3 gap-6">
        
        {/* Left Column (Main body - 2/3 width) */}
        <div className="col-span-2 flex flex-col gap-5">
          
          {/* Summary */}
          {summaryText && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-2">My Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">{summaryText}</p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Work History</h3>
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
                    <div key={exp.id} className="relative pl-4 border-l border-indigo-100">
                      <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white"></div>
                      
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-sm text-slate-800">{exp.role || 'Job Role'}</span>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase">
                          {exp.startDate || 'Start'} – {currentlyWorking ? 'Present' : (exp.endDate || 'End')}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline text-xs font-semibold text-slate-400 mb-2">
                        <span>{exp.company || 'Company'} {exp.employmentType && `(${exp.employmentType})`} {exp.location && `(${exp.location})`}</span>
                      </div>

                      {descBullets.length > 0 && (
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-500 leading-relaxed">
                          {descBullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}

                      {expAchievements.length > 0 && (
                        <div className="mt-1 pl-4 text-xs text-slate-500">
                          <span className="font-semibold">Achievements:</span>
                          <ul className="list-circle pl-4 space-y-0.5 mt-0.5">
                            {expAchievements.map((ach, i) => (
                              <li key={i}>{ach}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {expTech.length > 0 && (
                        <div className="mt-1 pl-4 text-[10px] text-indigo-400 font-bold uppercase">
                          Tech: {expTech.join(', ')}
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
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Key Projects</h3>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((proj) => {
                  const title = proj.title || (proj as any).name || 'Project Name';
                  const link = proj.github || proj.liveDemo || (proj as any).link || '';
                  const desc = proj.description || '';
                  const features = Array.isArray(proj.features) ? proj.features : [];
                  const tech = Array.isArray(proj.technologies) ? proj.technologies : [];

                  return (
                    <div key={proj.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 mb-1">
                          {title} {proj.role && <span className="text-[10px] font-normal text-slate-400">({proj.role})</span>}
                        </h4>
                        {proj.duration && <span className="text-[9px] text-slate-400 block mb-1">{proj.duration}</span>}
                        {desc && <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>}
                        
                        {features.length > 0 && (
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[9px] text-slate-500">
                            {features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {link && (
                        <a href={`https://${link}`} className="text-[9px] font-bold text-indigo-600 hover:underline mt-2 self-start">{link}</a>
                      )}
                      {tech.length > 0 && (
                        <div className="text-[9px] text-slate-400 mt-1 font-semibold">
                          Tech: {tech.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Sidebar details - 1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Skills */}
          {allSkills.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Languages</h3>
              <div className="flex flex-col gap-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700">{lang.language}</span>
                    <span className="text-[10px] text-slate-400 block">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Education</h3>
              <div className="flex flex-col gap-3">
                {education.map((edu) => {
                  const degree = edu.degree || 'Degree';
                  const specialization = edu.specialization || (edu as any).field || '';
                  const university = edu.university || (edu as any).institution || 'School Name';
                  const startYear = edu.startYear || (edu as any).startDate || '';
                  const endYear = edu.endYear || (edu as any).endDate || '';
                  const cgpa = edu.cgpa || (edu as any).gpa || '';

                  return (
                    <div key={edu.id} className="text-xs text-slate-600">
                      <div className="font-bold text-slate-800 leading-tight">
                        {degree} {specialization && `in ${specialization}`}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{university}</div>
                      <div className="flex justify-between items-baseline text-[9px] font-bold text-indigo-400 mt-1 uppercase">
                        <span>{startYear} – {endYear}</span>
                        {cgpa && <span>GPA: {cgpa}</span>}
                      </div>
                      {edu.coursework && <div className="text-[9px] text-slate-400 mt-0.5">Coursework: {edu.coursework}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Certifications</h3>
              <div className="flex flex-col gap-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-2.5 rounded-lg border border-slate-100 flex flex-col gap-0.5">
                    <span className="font-bold text-[11px] text-slate-700 leading-tight">{cert.title}</span>
                    <span className="text-[9px] text-slate-400 leading-none">{cert.organization} {cert.issueDate && `(${cert.issueDate})`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Achievements</h3>
              <div className="flex flex-col gap-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-2.5 rounded-lg border border-slate-100 flex flex-col gap-0.5">
                    <span className="font-bold text-[11px] text-slate-700 leading-tight">{ach.title}</span>
                    <span className="text-[9px] text-slate-400 leading-none">{ach.date} {ach.description && `- ${ach.description}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
