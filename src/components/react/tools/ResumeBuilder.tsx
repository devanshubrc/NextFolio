import React, { useState, useEffect, useRef } from 'react';
import ClassicTemplate, { type ResumeData } from './resume-templates/ClassicTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import MinimalTemplate from './resume-templates/MinimalTemplate';
import CreativeTemplate from './resume-templates/CreativeTemplate';

const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

type ActiveStep = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal' | 'creative'>('classic');
  const [activeStep, setActiveStep] = useState<ActiveStep>('personal');
  const [skillInput, setSkillInput] = useState('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit'); // Mobiles toggle view
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nextfolios-resume-data');
      if (saved) {
        setData(JSON.parse(saved));
      }
      const savedTemplate = localStorage.getItem('nextfolios-resume-template');
      if (savedTemplate) {
        setTemplate(savedTemplate as any);
      }
    } catch (e) {
      console.error('Failed to load local resume data', e);
    }
  }, []);

  // Save to localStorage on data change
  const updateData = (updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('nextfolios-resume-data', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handlePersonalChange = (field: keyof ResumeData['personal'], value: string) => {
    updateData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    updateData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Math.random().toString(36).substr(2, 9),
          company: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    updateData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const deleteExperience = (id: string) => {
    updateData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  // Education Handlers
  const addEducation = () => {
    updateData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Math.random().toString(36).substr(2, 9),
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    updateData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const deleteEducation = (id: string) => {
    updateData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Projects Handlers
  const addProject = () => {
    updateData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          description: '',
          link: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const deleteProject = (id: string) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Certifications Handlers
  const addCertification = () => {
    updateData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          issuer: '',
          date: '',
        },
      ],
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const deleteCertification = (id: string) => {
    updateData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  // Skills Handlers
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (data.skills.includes(skillInput.trim())) {
      setSkillInput('');
      return;
    }
    updateData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }));
    setSkillInput('');
  };

  const deleteSkill = (skillToDelete: string) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToDelete),
    }));
  };

  // Switch Template
  const changeTemplate = (type: typeof template) => {
    setTemplate(type);
    try {
      localStorage.setItem('nextfolios-resume-template', type);
    } catch (e) {}
  };

  // Clear All Form Data
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your resume data? This action cannot be undone.')) {
      setData(INITIAL_DATA);
      try {
        localStorage.removeItem('nextfolios-resume-data');
      } catch (e) {}
    }
  };

  // PDF Generation Trigger
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      const element = previewRef.current;
      
      // Target a rendering container specifically adjusted for pdf capture scale
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 Size dimensions in mm (210 x 297)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page resumes
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = data.personal.fullName
        ? `${data.personal.fullName.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`
        : 'resume.pdf';

      pdf.save(filename);
    } catch (err) {
      console.error('Export PDF Failed:', err);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Render Template View
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  const stepList = [
    { id: 'personal', label: '1. Contact & Summary' },
    { id: 'experience', label: '2. Experience' },
    { id: 'education', label: '3. Education' },
    { id: 'skills', label: '4. Skills' },
    { id: 'projects', label: '5. Projects' },
    { id: 'certifications', label: '6. Achievements' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top action bar: templates + exports */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)]">
        
        {/* Template Selectors */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>Choose Template</span>
          <div className="flex flex-wrap gap-1.5">
            {['classic', 'modern', 'minimal', 'creative'].map((t) => (
              <button
                key={t}
                onClick={() => changeTemplate(t as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer border ${
                  template === t
                    ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]'
                    : 'bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Download actions */}
        <div className="flex items-center gap-3 self-end md:self-center">
          {/* Mobile Preview/Edit toggler */}
          <button
            onClick={() => setPreviewMode(m => m === 'edit' ? 'preview' : 'edit')}
            className="md:hidden btn-secondary py-2 px-4 text-xs font-semibold"
          >
            {previewMode === 'edit' ? 'Show Preview' : 'Show Form'}
          </button>
          
          <button onClick={handleClear} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Clear Form
          </button>

          <button onClick={handlePrint} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Print
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-primary py-2 px-4 text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid))',
              color: '#ffffff',
            }}
          >
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Input Form Wizard */}
        <div className={`flex flex-col gap-6 ${previewMode === 'preview' ? 'hidden lg:flex' : ''}`}>
          
          {/* Form Navigation Tabs */}
          <div className="flex flex-wrap border-b border-[var(--color-border-default)]" role="tablist">
            {stepList.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as any)}
                role="tab"
                aria-selected={activeStep === step.id}
                className={`px-3.5 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeStep === step.id
                    ? 'border-[var(--color-text-accent)] text-[var(--color-text-accent)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Form Wizard Pages */}
          <div className="card p-6 flex flex-col gap-5">
            
            {/* Step 1: Personal Details */}
            {activeStep === 'personal' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2" style={{ borderColor: 'var(--color-border-default)' }}>Contact Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={data.personal.fullName}
                      onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="jobTitle" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Target Job Title</label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={data.personal.jobTitle}
                      onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                      placeholder="Senior React Engineer"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={data.personal.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      placeholder="john.doe@example.com"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Phone</label>
                    <input
                      id="phone"
                      type="text"
                      value={data.personal.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Location</label>
                    <input
                      id="location"
                      type="text"
                      value={data.personal.location}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="linkedin" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">LinkedIn Profile</label>
                    <input
                      id="linkedin"
                      type="text"
                      value={data.personal.linkedin}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">GitHub Profile</label>
                    <input
                      id="github"
                      type="text"
                      value={data.personal.github}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      placeholder="github.com/johndoe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label htmlFor="summary" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Professional Summary</label>
                  <textarea
                    id="summary"
                    rows={4}
                    value={data.personal.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    placeholder="Describe your target career achievements, technical specialties, and team leadership credentials here..."
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Work Experience */}
            {activeStep === 'experience' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Work Experience</h4>
                  <button onClick={addExperience} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Job
                  </button>
                </div>

                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Job Position #{idx + 1}</span>
                      <button onClick={() => deleteExperience(exp.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Google Inc"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Role / Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Software Engineer II"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="New York, NY"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="June 2021"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          disabled={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder={exp.current ? 'Present' : 'May 2023'}
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-indigo-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-xs font-semibold text-[var(--color-text-secondary)] cursor-pointer">I work here currently</label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Description (one bullet point per line)</label>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Spearheaded query latency optimization by 35% using database indexes.&#10;Collaborated with 4 cross-functional engineers to launch mobile dashboard app."
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}

                {data.experience.length === 0 && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No work experience added yet. Click "+ Add Job" to start listing your roles.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Education */}
            {activeStep === 'education' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Education Details</h4>
                  <button onClick={addEducation} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add School
                  </button>
                </div>

                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Degree / School #{idx + 1}</span>
                      <button onClick={() => deleteEducation(edu.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Institution / School Name</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Stanford University"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Degree Name</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="Computer Science"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">GPA</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.85 / 4.0"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                          placeholder="Stanford, CA"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="Sept 2017"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Graduation Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="June 2021"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {data.education.length === 0 && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No academic background added yet. Click "+ Add School" to start listing your degrees.
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Skills */}
            {activeStep === 'skills' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2" style={{ borderColor: 'var(--color-border-default)' }}>Skills Tags</h4>

                <form onSubmit={addSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter skill (e.g. React, Docker, Python)"
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm flex-1 text-[var(--color-text-primary)] focus:outline-none"
                  />
                  <button type="submit" className="btn-primary py-2 px-4 font-semibold text-sm">
                    Add Skill
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 mt-2">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]">
                      {skill}
                      <button type="button" onClick={() => deleteSkill(skill)} className="w-4 h-4 rounded-full text-[10px] bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white shrink-0 flex items-center justify-center cursor-pointer">×</button>
                    </span>
                  ))}

                  {data.skills.length === 0 && (
                    <div className="text-xs text-[var(--color-text-muted)] w-full py-4 text-center">
                      No skill tags added. Type a skill name and press Enter.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Projects */}
            {activeStep === 'projects' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Featured Projects</h4>
                  <button onClick={addProject} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Project
                  </button>
                </div>

                {data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Project #{idx + 1}</span>
                      <button onClick={() => deleteProject(proj.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="E-Commerce API"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Project URL Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          placeholder="github.com/johndoe/ecommerce"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Description / Technologies Used</label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Built fully functional REST endpoint using Node, Express, and MySQL. Implemented Redis caching, improving payload speed by 25%."
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}

                {data.projects.length === 0 && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No projects listed yet. Click "+ Add Project" to showcase your portfolio work.
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Certifications */}
            {activeStep === 'certifications' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Certifications & Achievements</h4>
                  <button onClick={addCertification} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Certification
                  </button>
                </div>

                {data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="sm:col-span-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Certificate #{idx + 1}</span>
                      <button onClick={() => deleteCertification(cert.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        placeholder="AWS Certified Solutions Architect"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Issuer Name</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="Amazon Web Services"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Date Issued</label>
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        placeholder="March 2023"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {data.certifications.length === 0 && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No certifications added yet. Click "+ Add Certification" to list your credentials.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Live PDF Document Preview */}
        <div className={`flex flex-col gap-4 ${previewMode === 'edit' ? 'hidden lg:flex' : ''}`}>
          <div className="text-center pb-2 border-b border-[var(--color-border-default)] flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Live PDF Preview</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Standard A4 Aspect Ratio</span>
          </div>

          <div className="overflow-x-auto w-full flex justify-center bg-slate-900/50 p-6 rounded-2xl border border-[var(--color-border-default)]">
            {/* The element we convert to image and output to PDF */}
            <div 
              ref={previewRef} 
              className="w-full max-w-[800px] shadow-2xl overflow-hidden print-area"
              style={{
                // Set page constraints so preview exactly mirrors output print dimensions
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
