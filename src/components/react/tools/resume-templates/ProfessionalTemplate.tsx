import React from 'react';
import type { ResumeData } from '../../../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  showFooter?: boolean;
}

export default function ProfessionalTemplate({ data, showFooter = true }: TemplateProps) {
  const { personal, summary, skills, experience, education, projects, certifications, languages, achievements } = data;

  const currentYear = new Date().getFullYear();
  const summaryText = summary?.professionalSummary || '';

  // Get skills arrays or fallback placeholders
  const getSkillsList = (cat: keyof ResumeData['skills']) => {
    return skills?.[cat] || [];
  };

  const hasSkills = skills && typeof skills === 'object' && skills !== null && !Array.isArray(skills) && Object.values(skills).some(arr => Array.isArray(arr) && arr.length > 0);

  return (
    <div className="bg-white text-slate-800 font-sans w-full h-full min-h-[1123px] flex flex-col shadow-inner" style={{ fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}>
      
      {/* Top Banner (Dark Blue/Slate) */}
      <div className="bg-[#2E3D49] text-white py-12 px-8 text-center relative z-0 flex flex-col items-center justify-center min-h-[140px]">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest leading-none mb-2">
          {personal.fullName || 'YOUR FULL NAME'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-300">
            {personal.jobTitle}
          </p>
        )}
      </div>

      {/* Columns Wrapper */}
      <div className="flex flex-1 relative min-h-[900px] items-stretch columns-wrapper">
        
        {/* Left Sidebar (Light Gray) */}
        <div className="w-[32%] bg-[#ECEFF1] px-4 pb-8 pt-24 flex flex-col gap-6 relative z-10 border-r border-slate-200">
          
          {/* Circular Avatar Placeholder */}
          <div className="absolute top-[-64px] left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-8 border-white bg-[#B0BEC5] flex items-center justify-center overflow-hidden z-20 shadow-md">
            {personal.profileImage ? (
              <img 
                src={personal.profileImage} 
                alt={personal.fullName || 'Profile'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-24 h-24 text-[#ECEFF1] mt-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#2E3D49] text-white">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E3D49]">Contact</h2>
            </div>
            <div className="border-b-2 border-slate-300 w-full mb-1"></div>
            
            <div className="flex flex-col gap-2 text-[11px] text-slate-700 font-medium">
              {personal.phone && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">📞</span>
                  <div>
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">Phone</span>
                    <span>{personal.phone}</span>
                  </div>
                </div>
              )}
              {personal.email && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">✉</span>
                  <div className="break-all">
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">Email</span>
                    <span>{personal.email}</span>
                  </div>
                </div>
              )}
              {personal.location && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">📍</span>
                  <div>
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">Location</span>
                    <span>{personal.location}</span>
                  </div>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">🔗</span>
                  <div className="break-all">
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">LinkedIn</span>
                    <span>{personal.linkedin}</span>
                  </div>
                </div>
              )}
              {personal.github && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">🐙</span>
                  <div className="break-all">
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">GitHub</span>
                    <span>{personal.github}</span>
                  </div>
                </div>
              )}
              {personal.website && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">🌐</span>
                  <div className="break-all">
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">Website</span>
                    <span>{personal.website}</span>
                  </div>
                </div>
              )}
              {personal.portfolio && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[#2E3D49]">💼</span>
                  <div className="break-all">
                    <span className="font-semibold block text-[9px] text-slate-500 uppercase leading-tight">Portfolio</span>
                    <span>{personal.portfolio}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certifications Section */}
          {certifications && certifications.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#2E3D49] text-white">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                  </svg>
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E3D49]">Certifications</h2>
              </div>
              <div className="border-b-2 border-slate-300 w-full mb-1"></div>
              
              <div className="flex flex-col gap-2.5 text-[11px] text-slate-700">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800">{cert.title}</span>
                    <span className="text-[10px] text-slate-500">
                      • {cert.organization} {cert.issueDate && `| ${cert.issueDate}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#2E3D49] text-white">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.6 3.39 1.79 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.6-3.39-1.79-4.33-3.56zm2.95-8H5.08c.94-1.77 2.49-2.96 4.33-3.56-.6 1.11-1.06 2.31-1.38 3.56zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.94 1.77-2.49 2.96-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                  </svg>
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2E3D49]">Languages</h2>
              </div>
              <div className="border-b-2 border-slate-300 w-full mb-1"></div>
              
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                {languages.map((lang) => (
                  <li key={lang.id} className="font-medium">
                    {lang.language} &mdash; <span className="text-slate-500 italic">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Main Column (White) */}
        <div className="w-[68%] bg-white p-8 pl-12 relative flex flex-col gap-8">
          
          {/* Vertical timeline line */}
          <div className="absolute left-[55px] top-[48px] bottom-[48px] w-[2px] bg-slate-300"></div>

          {/* CAREER OBJECTIVE */}
          {summaryText && (
            <div className="relative pl-8" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Career Objective
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              <p className="text-xs text-slate-700 leading-relaxed text-left">
                {summaryText}
              </p>
            </div>
          )}

          {/* KEY SKILLS */}
          {hasSkills && (
            <div className="relative pl-8" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Key Skills
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                {getSkillsList('programmingLanguages').length > 0 && (
                  <li><strong>Programming Languages:</strong> {getSkillsList('programmingLanguages').join(', ')}</li>
                )}
                {getSkillsList('frameworks').length > 0 && (
                  <li><strong>Frameworks:</strong> {getSkillsList('frameworks').join(', ')}</li>
                )}
                {getSkillsList('libraries').length > 0 && (
                  <li><strong>Libraries:</strong> {getSkillsList('libraries').join(', ')}</li>
                )}
                {getSkillsList('databases').length > 0 && (
                  <li><strong>Databases:</strong> {getSkillsList('databases').join(', ')}</li>
                )}
                {getSkillsList('cloud').length > 0 && (
                  <li><strong>Cloud:</strong> {getSkillsList('cloud').join(', ')}</li>
                )}
                {getSkillsList('devOps').length > 0 && (
                  <li><strong>DevOps:</strong> {getSkillsList('devOps').join(', ')}</li>
                )}
                {getSkillsList('tools').length > 0 && (
                  <li><strong>Tools:</strong> {getSkillsList('tools').join(', ')}</li>
                )}
                {getSkillsList('testing').length > 0 && (
                  <li><strong>Testing:</strong> {getSkillsList('testing').join(', ')}</li>
                )}
                {getSkillsList('softSkills').length > 0 && (
                  <li><strong>Soft Skills:</strong> {getSkillsList('softSkills').join(', ')}</li>
                )}
              </ul>
            </div>
          )}

          {/* EXPERIENCE (SKIP IF FRESHER) */}
          {experience && experience.length > 0 && (
            <div className="relative pl-8">
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Experience (Skip if Fresher)
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              
              <div className="flex flex-col gap-4 text-xs text-slate-700">
                {experience.map((exp) => (
                  <div key={exp.id} className="flex flex-col gap-1" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <span className="font-semibold text-slate-800">
                      {exp.role} - {exp.company} {exp.employmentType && `(${exp.employmentType})`} | {exp.location} [{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}]
                    </span>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 mt-1">
                        {exp.description.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-1 pl-4 text-slate-600">
                        <span className="font-semibold text-slate-700 text-[11px] uppercase">Key Achievements:</span>
                        <ul className="list-circle pl-4 space-y-0.5 mt-0.5">
                          {exp.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-1 pl-4 text-[10px] text-slate-500 font-semibold uppercase">
                        Tech: {exp.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div className="relative pl-8">
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Education
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              
              <ul className="list-disc pl-4 space-y-2 text-xs text-slate-700">
                {education.map((edu) => (
                  <li key={edu.id} className="list-none pl-0" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{edu.degree} {edu.specialization && `in ${edu.specialization}`}</span>
                      <span className="font-normal text-slate-500">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <div className="text-slate-600 italic text-[11px]">
                      {edu.university} {edu.location && `| ${edu.location}`}
                    </div>
                    {edu.cgpa && (
                      <div className="text-[11px] text-slate-500 mt-0.5 font-semibold">
                        CGPA: {edu.cgpa}
                      </div>
                    )}
                    {edu.coursework && (
                      <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                        <span className="font-semibold text-slate-500">Key Coursework:</span> {edu.coursework}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PROJECTS / INTERNSHIPS (FOR FRESHERS) */}
          {projects && projects.length > 0 && (
            <div className="relative pl-8">
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Projects / Internships (For Freshers)
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              
              <div className="flex flex-col gap-4 text-xs text-slate-700">
                {projects.map((proj) => (
                  <div key={proj.id} className="flex flex-col gap-1.5" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{proj.title} {proj.role && <span className="text-xs text-slate-400 font-normal">({proj.role})</span>}</span>
                      {proj.duration && <span className="text-slate-500 font-normal">{proj.duration}</span>}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-left">
                      {proj.description}
                    </p>
                    {proj.features && proj.features.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                        {proj.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">
                        Tech: {proj.technologies.join(', ')}
                      </div>
                    )}
                    {(proj.github || proj.liveDemo) && (
                      <div className="flex gap-3 text-[10px] font-bold text-indigo-500">
                        {proj.github && <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
                        {proj.liveDemo && <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Live Demo</a>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {achievements && achievements.length > 0 && (
            <div className="relative pl-8">
              <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-full bg-[#2E3D49] border-4 border-white flex items-center justify-center text-white shadow-sm">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                </svg>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3D49] mb-1">
                Achievements
              </h3>
              <div className="border-b border-slate-300 w-full mb-3"></div>
              
              <div className="flex flex-col gap-3 text-xs text-slate-700">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex flex-col gap-0.5" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{ach.title}</span>
                      <span className="text-slate-500 font-normal">{ach.date}</span>
                    </div>
                    {ach.description && (
                      <p className="text-slate-600 leading-relaxed pl-2 border-l border-slate-200">
                        {ach.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Copyright/Credit inside right column bottom */}
          {showFooter && (
            <div className="mt-auto pt-8 flex justify-end">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                © {currentYear} {personal.fullName || 'Your Name'}
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
