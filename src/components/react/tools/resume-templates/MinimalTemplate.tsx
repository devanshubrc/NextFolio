import React from 'react';
import type { ResumeData } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications } = data;

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
          {(personal.linkedin || personal.github) && (
            <div className="flex gap-2">
              {personal.linkedin && <span>In: {personal.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}</span>}
              {personal.github && <span>Git: {personal.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Profile</p>
          <p className="text-sm text-zinc-600 leading-relaxed text-justify">{personal.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Experience</p>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-4">
                <div className="text-xs text-zinc-400 font-medium">
                  {exp.startDate || 'Start'} – {exp.current ? 'Present' : (exp.endDate || 'End')}
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <div className="flex justify-between items-baseline leading-none">
                    <span className="font-bold text-sm text-zinc-800">{exp.role || 'Job Role'}</span>
                    <span className="text-xs text-zinc-400 font-medium italic">{exp.company || 'Company'} {exp.location && `, ${exp.location}`}</span>
                  </div>
                  {exp.description && (
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-zinc-600 leading-relaxed">
                      {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Projects</p>
          <div className="flex flex-col gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="grid grid-cols-4 gap-4">
                <div className="text-xs text-zinc-400 font-medium">Featured</div>
                <div className="col-span-3 flex flex-col gap-1">
                  <div className="flex justify-between items-baseline leading-none">
                    <span className="font-bold text-sm text-zinc-800">{proj.name || 'Project Name'}</span>
                    {proj.link && <span className="text-xs text-zinc-400">{proj.link}</span>}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Technical Skills</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 pl-4">
            {skills.map((skill, i) => (
              <span key={i} className="after:content-['/'] after:ml-4 last:after:content-none font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">Education</p>
          <div className="flex flex-col gap-3">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-4 gap-4">
                <div className="text-xs text-zinc-400 font-medium">
                  {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                </div>
                <div className="col-span-3 flex flex-col gap-0.5">
                  <div className="flex justify-between items-baseline leading-none">
                    <span className="font-bold text-sm text-zinc-800">{edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}</span>
                    {edu.gpa && <span className="text-xs text-zinc-400">GPA: {edu.gpa}</span>}
                  </div>
                  <div className="text-xs text-zinc-500">{edu.institution || 'School Name'} {edu.location && `— ${edu.location}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Certifications</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-xs text-zinc-400 font-medium">Credentials</div>
            <div className="col-span-3 grid grid-cols-2 gap-y-1.5 gap-x-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-zinc-600 flex justify-between">
                  <span className="font-medium text-zinc-700">{cert.name}</span>
                  <span className="text-zinc-400 italic text-[10px]">{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
