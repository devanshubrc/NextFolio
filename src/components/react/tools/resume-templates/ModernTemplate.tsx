import React from 'react';
import type { ResumeData } from './ClassicTemplate';

interface TemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, certifications } = data;

  return (
    <div className="bg-white text-slate-800 font-sans w-full h-full min-h-[1123px] box-border shadow-inner flex" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Sidebar Column (Left) */}
      <div className="w-[30%] bg-slate-100 p-6 flex flex-col gap-6 border-r border-slate-200">
        
        {/* Profile Details */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">{personal.fullName || 'Your Name'}</h1>
          <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">{personal.jobTitle || 'Target Role'}</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Contact</h2>
          
          <div className="flex flex-col gap-2 text-xs text-slate-600">
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
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 text-[10px] font-medium rounded bg-slate-200 text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Certifications</h2>
            <div className="flex flex-col gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-700 leading-tight">{cert.name}</div>
                  <div className="text-[10px] text-slate-500">{cert.issuer} {cert.date && `(${cert.date})`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Column (Right) */}
      <div className="w-[70%] p-8 flex flex-col gap-6">
        
        {/* Summary */}
        {personal.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-2">Profile Summary</h2>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Work Experience</h2>
            <div className="flex flex-col gap-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-sm text-slate-800">{exp.role || 'Job Role'}</span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {exp.startDate || 'Start'} – {exp.current ? 'Present' : (exp.endDate || 'End')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-baseline text-xs font-semibold text-slate-500 mb-2">
                    <span>{exp.company || 'Company'}</span>
                    <span className="font-normal italic">{exp.location}</span>
                  </div>

                  {exp.description && (
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Featured Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-slate-800">{proj.name || 'Project Name'}</span>
                    {proj.link && (
                      <span className="text-[10px] text-indigo-500 hover:underline">{proj.link}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-100 pb-1 mb-3">Education</h2>
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {edu.institution || 'School Name'} {edu.location && `— ${edu.location}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-slate-400">
                      {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                    </div>
                    {edu.gpa && <span className="text-xs text-slate-500 block">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
