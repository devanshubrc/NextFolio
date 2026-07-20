import React from 'react';
import type { ResumeData } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications } = data;

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
          <div className="flex gap-3 mt-1 text-[10px]">
            {personal.linkedin && <a href={`https://linkedin.com/in/${personal.linkedin}`} className="underline hover:text-white">LinkedIn</a>}
            {personal.github && <a href={`https://github.com/${personal.github}`} className="underline hover:text-white">GitHub</a>}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 grid grid-cols-3 gap-6">
        
        {/* Left Column (Main body - 2/3 width) */}
        <div className="col-span-2 flex flex-col gap-5">
          
          {/* Summary */}
          {personal.summary && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-2">My Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Work History</h3>
              <div className="flex flex-col gap-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l border-indigo-100">
                    <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white"></div>
                    
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-sm text-slate-800">{exp.role || 'Job Role'}</span>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase">
                        {exp.startDate || 'Start'} – {exp.current ? 'Present' : (exp.endDate || 'End')}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs font-semibold text-slate-400 mb-2">
                      <span>{exp.company || 'Company'} {exp.location && `(${exp.location})`}</span>
                    </div>

                    {exp.description && (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-500 leading-relaxed">
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
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Key Projects</h3>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 mb-1">{proj.name || 'Project Name'}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{proj.description}</p>
                    </div>
                    {proj.link && (
                      <a href={`https://${proj.link}`} className="text-[9px] font-bold text-indigo-600 hover:underline mt-2 self-start">{proj.link}</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Sidebar details - 1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Education</h3>
              <div className="flex flex-col gap-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs text-slate-600">
                    <div className="font-bold text-slate-800 leading-tight">
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{edu.institution || 'School'}</div>
                    <div className="flex justify-between items-baseline text-[9px] font-bold text-indigo-400 mt-1 uppercase">
                      <span>{edu.startDate} – {edu.endDate}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-3">Achievements</h3>
              <div className="flex flex-col gap-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-2.5 rounded-lg border border-slate-100 flex flex-col gap-0.5">
                    <span className="font-bold text-[11px] text-slate-700 leading-tight">{cert.name}</span>
                    <span className="text-[9px] text-slate-400 leading-none">{cert.issuer} {cert.date && `(${cert.date})`}</span>
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
