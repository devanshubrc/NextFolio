import React, { useState, useEffect, useRef } from 'react';
import type { ResumeData } from '../../../types/resume';
import ProfessionalTemplate from './resume-templates/ProfessionalTemplate';
import ClassicTemplate from './resume-templates/ClassicTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import MinimalTemplate from './resume-templates/MinimalTemplate';
import CreativeTemplate from './resume-templates/CreativeTemplate';

let html2canvasLib: any = null;
let jsPDFLib: any = null;

const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profileImage: '',
  },
  summary: {
    professionalSummary: '',
  },
  skills: {
    programmingLanguages: [],
    frameworks: [],
    libraries: [],
    databases: [],
    cloud: [],
    devOps: [],
    tools: [],
    testing: [],
    softSkills: [],
  },
  languages: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
};

const migrateResumeData = (oldData: any): ResumeData => {
  const newData: ResumeData = {
    personal: {
      fullName: oldData?.personal?.fullName || '',
      jobTitle: oldData?.personal?.jobTitle || '',
      email: oldData?.personal?.email || '',
      phone: oldData?.personal?.phone || '',
      location: oldData?.personal?.location || '',
      website: oldData?.personal?.website || '',
      linkedin: oldData?.personal?.linkedin || '',
      github: oldData?.personal?.github || '',
      portfolio: oldData?.personal?.portfolio || '',
      profileImage: oldData?.personal?.profileImage || '',
    },
    summary: {
      professionalSummary: oldData?.summary?.professionalSummary || oldData?.personal?.summary || '',
    },
    skills: {
      programmingLanguages: Array.isArray(oldData?.skills?.programmingLanguages) ? oldData.skills.programmingLanguages : [],
      frameworks: Array.isArray(oldData?.skills?.frameworks) ? oldData.skills.frameworks : [],
      libraries: Array.isArray(oldData?.skills?.libraries) ? oldData.skills.libraries : [],
      databases: Array.isArray(oldData?.skills?.databases) ? oldData.skills.databases : [],
      cloud: Array.isArray(oldData?.skills?.cloud) ? oldData.skills.cloud : [],
      devOps: Array.isArray(oldData?.skills?.devOps) ? oldData.skills.devOps : [],
      tools: Array.isArray(oldData?.skills?.tools) ? oldData.skills.tools : [],
      testing: Array.isArray(oldData?.skills?.testing) ? oldData.skills.testing : [],
      softSkills: Array.isArray(oldData?.skills?.softSkills) ? oldData.skills.softSkills : [],
    },
    languages: Array.isArray(oldData?.languages) ? oldData.languages : [],
    experience: Array.isArray(oldData?.experience)
      ? oldData.experience.map((exp: any) => ({
          id: exp.id || Math.random().toString(36).substr(2, 9),
          company: exp.company || '',
          role: exp.role || '',
          employmentType: exp.employmentType || 'Full-time',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          currentlyWorking: typeof exp.currentlyWorking === 'boolean' ? exp.currentlyWorking : (!!exp.current),
          description: Array.isArray(exp.description)
            ? exp.description
            : typeof exp.description === 'string'
              ? exp.description.split('\n').map((s: string) => s.trim()).filter(Boolean)
              : [],
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
          technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
        }))
      : [],
    education: Array.isArray(oldData?.education)
      ? oldData.education.map((edu: any) => ({
          id: edu.id || Math.random().toString(36).substr(2, 9),
          degree: edu.degree || '',
          specialization: edu.specialization || edu.field || '',
          university: edu.university || edu.institution || '',
          location: edu.location || '',
          startYear: edu.startYear || edu.startDate || '',
          endYear: edu.endYear || edu.endDate || '',
          cgpa: edu.cgpa || edu.gpa || '',
          coursework: edu.coursework || '',
        }))
      : [],
    projects: Array.isArray(oldData?.projects)
      ? oldData.projects.map((proj: any) => ({
          id: proj.id || Math.random().toString(36).substr(2, 9),
          title: proj.title || proj.name || '',
          role: proj.role || '',
          duration: proj.duration || '',
          description: proj.description || '',
          features: Array.isArray(proj.features) ? proj.features : [],
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
          github: proj.github || proj.link || '',
          liveDemo: proj.liveDemo || '',
        }))
      : [],
    certifications: Array.isArray(oldData?.certifications)
      ? oldData.certifications.map((cert: any) => ({
          id: cert.id || Math.random().toString(36).substr(2, 9),
          title: cert.title || cert.name || '',
          organization: cert.organization || cert.issuer || '',
          issueDate: cert.issueDate || cert.date || '',
          credentialId: cert.credentialId || '',
          credentialUrl: cert.credentialUrl || '',
        }))
      : [],
    achievements: Array.isArray(oldData?.achievements) ? oldData.achievements : [],
  };

  if (Array.isArray(oldData?.skills)) {
    newData.skills.programmingLanguages = oldData.skills;
  }

  return newData;
};

type ActiveStep = 'personal' | 'summary' | 'skills' | 'languages' | 'experience' | 'education' | 'projects' | 'certifications' | 'achievements';

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<'professional' | 'classic' | 'modern' | 'minimal' | 'creative'>('professional');
  const [activeStep, setActiveStep] = useState<ActiveStep>('personal');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Skill category input states
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({
    programmingLanguages: '',
    frameworks: '',
    libraries: '',
    databases: '',
    cloud: '',
    devOps: '',
    tools: '',
    testing: '',
    softSkills: '',
  });

  // Experience sub-item input states (keyed by expId)
  const [expDescInput, setExpDescInput] = useState<Record<string, string>>({});
  const [expAchInput, setExpAchInput] = useState<Record<string, string>>({});
  const [expTechInput, setExpTechInput] = useState<Record<string, string>>({});

  // Project sub-item input states (keyed by projId)
  const [projFeatureInput, setProjFeatureInput] = useState<Record<string, string>>({});
  const [projTechInput, setProjTechInput] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    // Preload browser-only libraries to prevent dynamic fetch issues and SSR hydration errors
    import('html2canvas-pro').then(m => {
      html2canvasLib = m.default || m;
    }).catch(() => {});
    import('jspdf').then(m => {
      jsPDFLib = m.jsPDF || m.default;
    }).catch(() => {});

    try {
      const saved = localStorage.getItem('nextfolios-resume-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = migrateResumeData(parsed);
        setData(migrated);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handlePersonalChange('profileImage', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Summary AI generation mock helpers
  const handleAIGenerateSummary = () => {
    const role = data.personal.jobTitle || 'Professional';
    const sampleSummary = `Motivated and detail-oriented ${role} with a proven track record of designing, building, and deploying scalable web applications. Adept at collaborating in cross-functional teams, solving complex technical challenges, and driving continuous improvement to deliver robust, user-centric software solutions.`;
    updateData(prev => ({
      ...prev,
      summary: { ...prev.summary, professionalSummary: sampleSummary }
    }));
  };

  const handleAIImproveSummary = () => {
    if (!data.summary.professionalSummary.trim()) {
      alert('Please enter a professional summary first.');
      return;
    }
    updateData(prev => ({
      ...prev,
      summary: { 
        ...prev.summary, 
        professionalSummary: `Result-oriented and highly analytical, ${prev.summary.professionalSummary.replace(/^(I am a|I'm a|Motivated)/i, 'established')} Focused on clean code, software engineering best practices, and delivering high business value.` 
      }
    }));
  };

  // Skills handlers
  const handleSkillInputChange = (cat: string, val: string) => {
    setSkillInputs(prev => ({ ...prev, [cat]: val }));
  };

  const addSkillTag = (cat: keyof ResumeData['skills'], e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = skillInputs[cat]?.trim();
    if (!inputVal) return;

    updateData(prev => {
      const currentSkills = prev.skills?.[cat] || [];
      if (currentSkills.includes(inputVal)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [cat]: [...currentSkills, inputVal]
        }
      };
    });
    setSkillInputs(prev => ({ ...prev, [cat]: '' }));
  };

  const deleteSkillTag = (cat: keyof ResumeData['skills'], skillToDelete: string) => {
    updateData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [cat]: (prev.skills?.[cat] || []).filter(s => s !== skillToDelete)
      }
    }));
  };

  // Languages handlers
  const addLanguage = () => {
    updateData(prev => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id: Math.random().toString(36).substr(2, 9), language: '', proficiency: 'Fluent' }
      ]
    }));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    updateData(prev => ({
      ...prev,
      languages: (prev.languages || []).map(lang => lang.id === id ? { ...lang, [field]: value } : lang)
    }));
  };

  const deleteLanguage = (id: string) => {
    updateData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(lang => lang.id !== id)
    }));
  };

  // Experience handlers
  const addExperience = () => {
    updateData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          company: '',
          role: '',
          employmentType: 'Full-time',
          location: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: [],
          achievements: [],
          technologies: [],
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

  const addExpSubItem = (expId: string, field: 'description' | 'achievements' | 'technologies', inputKey: string) => {
    const inputsMap = field === 'description' ? expDescInput : field === 'achievements' ? expAchInput : expTechInput;
    const value = inputsMap[expId]?.trim();
    if (!value) return;

    updateData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        const currentList = exp[field] || [];
        if (currentList.includes(value)) return exp;
        return { ...exp, [field]: [...currentList, value] };
      }),
    }));

    if (field === 'description') setExpDescInput(prev => ({ ...prev, [expId]: '' }));
    else if (field === 'achievements') setExpAchInput(prev => ({ ...prev, [expId]: '' }));
    else setExpTechInput(prev => ({ ...prev, [expId]: '' }));
  };

  const deleteExpSubItem = (expId: string, field: 'description' | 'achievements' | 'technologies', valueToDelete: string) => {
    updateData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, [field]: (exp[field] || []).filter(item => item !== valueToDelete) };
      }),
    }));
  };

  const handleAIGenerateExpDesc = (expId: string, role: string) => {
    const targetRole = role || 'Software Developer';
    const suggestions = [
      `Designed and optimized scalable database queries, reducing payload latency by 20% under concurrent traffic.`,
      `Led client-side feature development using React and TypeScript, boosting active user interactions by 12%.`,
      `Collaborated closely with product designers and test engineers to release high-quality sprint builds ahead of schedule.`
    ];
    updateData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, description: [...(exp.description || []), ...suggestions] };
      })
    }));
  };

  // Education handlers
  const addEducation = () => {
    updateData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          degree: '',
          specialization: '',
          university: '',
          location: '',
          startYear: '',
          endYear: '',
          cgpa: '',
          coursework: '',
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

  // Projects handlers
  const addProject = () => {
    updateData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          title: '',
          role: '',
          duration: '',
          description: '',
          features: [],
          technologies: [],
          github: '',
          liveDemo: '',
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

  const addProjSubItem = (projId: string, field: 'features' | 'technologies') => {
    const inputsMap = field === 'features' ? projFeatureInput : projTechInput;
    const value = inputsMap[projId]?.trim();
    if (!value) return;

    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projId) return proj;
        const currentList = proj[field] || [];
        if (currentList.includes(value)) return proj;
        return { ...proj, [field]: [...currentList, value] };
      }),
    }));

    if (field === 'features') setProjFeatureInput(prev => ({ ...prev, [projId]: '' }));
    else setProjTechInput(prev => ({ ...prev, [projId]: '' }));
  };

  const deleteProjSubItem = (projId: string, field: 'features' | 'technologies', valueToDelete: string) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projId) return proj;
        return { ...proj, [field]: (proj[field] || []).filter(item => item !== valueToDelete) };
      }),
    }));
  };

  const handleAIGenerateProjectDesc = (projId: string, title: string) => {
    const projectTitle = title || 'Developer Tool';
    const description = `Built a custom ${projectTitle} leveraging serverless microservices. Implemented real-time dashboard updates and secure oauth flows, achieving high responsiveness and test coverage.`;
    const features = [
      `Engineered secure WebSockets endpoints for dynamic payload exchanges.`,
      `Integrated performance logging monitoring pipeline utilizing global state handles.`
    ];
    updateData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => {
        if (proj.id !== projId) return proj;
        return { ...proj, description, features: [...(proj.features || []), ...features] };
      })
    }));
  };

  // Certifications handlers
  const addCertification = () => {
    updateData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          title: '',
          organization: '',
          issueDate: '',
          credentialId: '',
          credentialUrl: '',
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

  // Achievements handlers
  const addAchievement = () => {
    updateData(prev => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        { id: Math.random().toString(36).substr(2, 9), title: '', description: '', date: '' }
      ]
    }));
  };

  const updateAchievement = (id: string, field: string, value: string) => {
    updateData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).map(ach => ach.id === id ? { ...ach, [field]: value } : ach)
    }));
  };

  const deleteAchievement = (id: string) => {
    updateData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter(ach => ach.id !== id)
    }));
  };

  // Switch Template
  const changeTemplate = (type: typeof template) => {
    setTemplate(type);
    try {
      localStorage.setItem('nextfolios-resume-template', type);
    } catch (e) {}
  };

  // Clear Form Data
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
    // Validation Checks
    const errors: string[] = [];
    if (!data.personal.fullName.trim()) errors.push('Full Name is required.');
    if (!data.personal.email.trim()) errors.push('Email is required.');
    if (!data.personal.jobTitle.trim()) errors.push('Job Title is required.');
    const hasAnySkill = data.skills && typeof data.skills === 'object' && data.skills !== null && !Array.isArray(data.skills) && Object.values(data.skills).some(arr => Array.isArray(arr) && arr.length > 0);
    if (!hasAnySkill) errors.push('At least one Skill is required.');
    if (!data.education || data.education.length === 0) errors.push('At least one Education record is required.');
    
    if (errors.length > 0) {
      alert("Please fix the following validation items before exporting:\n\n" + errors.map(e => `• ${e}`).join('\n'));
      return;
    }

    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      let activeHtml2canvas = html2canvasLib;
      if (!activeHtml2canvas) {
        const m = await import('html2canvas-pro');
        activeHtml2canvas = m.default || m;
      }
      let activeJsPDF = jsPDFLib;
      if (!activeJsPDF) {
        const m = await import('jspdf');
        activeJsPDF = m.jsPDF || m.default;
      }

      const element = previewRef.current;
      
      const canvas = await (activeHtml2canvas as any)(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new (activeJsPDF as any)('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page resumes splitting cleanly
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
      const errMsg = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack}` : String(err);
      alert('An error occurred while generating the PDF. Details:\n\n' + errMsg);
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
      case 'professional':
        return <ProfessionalTemplate data={data} />;
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
    { id: 'personal', label: '1. Contact' },
    { id: 'summary', label: '2. Summary' },
    { id: 'skills', label: '3. Skills' },
    { id: 'languages', label: '4. Languages' },
    { id: 'experience', label: '5. Experience' },
    { id: 'education', label: '6. Education' },
    { id: 'projects', label: '7. Projects' },
    { id: 'certifications', label: '8. Certifications' },
    { id: 'achievements', label: '9. Achievements' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top action bar: templates + exports */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] no-print">
        
        {/* Template Selectors */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>Choose Template</span>
          <div className="flex flex-wrap gap-1.5">
            {['professional', 'classic', 'modern', 'minimal', 'creative'].map((t) => (
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
          <button
            onClick={() => setPreviewMode(m => m === 'edit' ? 'preview' : 'edit')}
            className="btn-secondary py-2 px-4 text-xs font-semibold cursor-pointer"
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

      <div className="w-full flex flex-col gap-8 items-stretch">
        
        {/* Left Column: Input Form Wizard */}
        <div className={`flex flex-col gap-6 no-print ${previewMode === 'preview' ? 'hidden' : 'w-full'}`}>
          
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
                    <label htmlFor="fullName" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Full Name *</label>
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
                    <label htmlFor="jobTitle" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Target Job Title *</label>
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
                    <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Email *</label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="website" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Website URL</label>
                    <input
                      id="website"
                      type="text"
                      value={data.personal.website}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      placeholder="johndoe.com"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="portfolio" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Portfolio Link</label>
                    <input
                      id="portfolio"
                      type="text"
                      value={data.personal.portfolio}
                      onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                      placeholder="portfolio.johndoe.com"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2 p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">Profile Photo Upload</span>
                  <div className="flex items-center gap-4">
                    {data.personal.profileImage && (
                      <img 
                        src={data.personal.profileImage} 
                        alt="Profile Preview" 
                        className="w-16 h-16 rounded-full border object-cover bg-white"
                      />
                    )}
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-[var(--color-text-muted)] cursor-pointer"
                      />
                      {data.personal.profileImage && (
                        <button
                          type="button"
                          onClick={() => handlePersonalChange('profileImage', '')}
                          className="text-left text-xs text-rose-500 font-bold hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Summary */}
            {activeStep === 'summary' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Professional Summary / Career Objective</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAIGenerateSummary}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                    >
                      🔮 AI Generate
                    </button>
                    <button 
                      onClick={handleAIImproveSummary}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                    >
                      ✏️ AI Improve
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="professionalSummary" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Write your summary</label>
                  <textarea
                    id="professionalSummary"
                    rows={6}
                    value={data.summary?.professionalSummary || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateData(prev => ({
                        ...prev,
                        summary: { ...prev.summary, professionalSummary: val }
                      }));
                    }}
                    placeholder="Describe your career goals, core expertise, and value proposition..."
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Skills Categories */}
            {activeStep === 'skills' && (
              <div className="flex flex-col gap-5">
                <h4 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2" style={{ borderColor: 'var(--color-border-default)' }}>Skills (Categorized)</h4>

                {[
                  { key: 'programmingLanguages', label: 'Programming Languages' },
                  { key: 'frameworks', label: 'Frameworks' },
                  { key: 'libraries', label: 'Libraries & Packages' },
                  { key: 'databases', label: 'Databases' },
                  { key: 'cloud', label: 'Cloud Services' },
                  { key: 'devOps', label: 'DevOps & CI/CD' },
                  { key: 'tools', label: 'Tools / Platforms' },
                  { key: 'testing', label: 'Testing Frameworks' },
                  { key: 'softSkills', label: 'Soft Skills / General' },
                ].map((category) => {
                  const catKey = category.key as keyof ResumeData['skills'];
                  const catSkills = data.skills?.[catKey] || [];

                  return (
                    <div key={category.key} className="p-4 rounded-xl border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] flex flex-col gap-2">
                      <label className="text-xs font-bold text-[var(--color-text-primary)]">{category.label}</label>
                      
                      <form onSubmit={(e) => addSkillTag(catKey, e)} className="flex gap-2">
                        <input
                          type="text"
                          value={skillInputs[catKey] || ''}
                          onChange={(e) => handleSkillInputChange(catKey, e.target.value)}
                          placeholder={`Add tag (e.g. ${category.label === 'Programming Languages' ? 'TypeScript' : 'Docker'})`}
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                          Add
                        </button>
                      </form>

                      {catSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {catSkills.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]">
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => deleteSkillTag(catKey, tag)}
                                className="w-3.5 h-3.5 rounded-full text-[8px] bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white shrink-0 flex items-center justify-center cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--color-text-muted)] italic">No tags added yet.</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 4: Languages */}
            {activeStep === 'languages' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Languages</h4>
                  <button onClick={addLanguage} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Language
                  </button>
                </div>

                {data.languages && data.languages.map((lang, idx) => (
                  <div key={lang.id} className="p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-end bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex-1 w-full">
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Language Name</label>
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                        placeholder="English"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-[150px]">
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Proficiency</label>
                      <select
                        value={lang.proficiency}
                        onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none cursor-pointer"
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Professional">Professional</option>
                        <option value="Conversational">Conversational</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => deleteLanguage(lang.id)} 
                      className="px-3 py-2 text-xs text-rose-400 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {(!data.languages || data.languages.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No languages added yet. Click "+ Add Language" to document your languages.
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Work Experience */}
            {activeStep === 'experience' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Work Experience</h4>
                  <button onClick={addExperience} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Job
                  </button>
                </div>

                {data.experience && data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between border-b pb-1 border-slate-700/30">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Job Position #{idx + 1}</span>
                      <button onClick={() => deleteExperience(exp.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete Position</button>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Employment Type</label>
                        <select
                          value={exp.employmentType}
                          onChange={(e) => updateExperience(exp.id, 'employmentType', e.target.value)}
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none cursor-pointer"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="New York, NY (Remote)"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
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
                          disabled={exp.currentlyWorking}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder={exp.currentlyWorking ? 'Present' : 'May 2023'}
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.currentlyWorking}
                          onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-indigo-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-xs font-semibold text-[var(--color-text-secondary)] cursor-pointer">I work here currently</label>
                      </div>
                    </div>

                    {/* Bullet description manager */}
                    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)]">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-[var(--color-text-primary)]">Responsibilities (Repeatable bullets)</label>
                        <button 
                          type="button"
                          onClick={() => handleAIGenerateExpDesc(exp.id, exp.role)}
                          className="px-2 py-0.5 text-[9px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer"
                        >
                          🔮 AI Generate Bullets
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expDescInput[exp.id] || ''}
                          onChange={(e) => setExpDescInput(prev => ({ ...prev, [exp.id]: e.target.value }))}
                          placeholder="Type a responsibility and click Add"
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => addExpSubItem(exp.id, 'description', exp.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1 mt-1 text-[var(--color-text-secondary)]">
                        {Array.isArray(exp.description) && exp.description.map((bullet, i) => (
                          <li key={i} className="group relative">
                            <span>{bullet}</span>
                            <button 
                              type="button" 
                              onClick={() => deleteExpSubItem(exp.id, 'description', bullet)}
                              className="ml-2 text-rose-500 hover:underline text-[10px] font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achievements bullets manager */}
                    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)]">
                      <label className="text-xs font-bold text-[var(--color-text-primary)]">Key Achievements (Optional bullets)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expAchInput[exp.id] || ''}
                          onChange={(e) => setExpAchInput(prev => ({ ...prev, [exp.id]: e.target.value }))}
                          placeholder="Type an achievement (e.g. Led team of 5, optimized index scaling)"
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => addExpSubItem(exp.id, 'achievements', exp.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1 mt-1 text-[var(--color-text-secondary)]">
                        {Array.isArray(exp.achievements) && exp.achievements.map((ach, i) => (
                          <li key={i}>
                            <span>{ach}</span>
                            <button 
                              type="button" 
                              onClick={() => deleteExpSubItem(exp.id, 'achievements', ach)}
                              className="ml-2 text-rose-500 hover:underline text-[10px] font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies tags manager */}
                    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)]">
                      <label className="text-xs font-bold text-[var(--color-text-primary)]">Technologies Used (e.g. React, Docker)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expTechInput[exp.id] || ''}
                          onChange={(e) => setExpTechInput(prev => ({ ...prev, [exp.id]: e.target.value }))}
                          placeholder="Add technology tag"
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => addExpSubItem(exp.id, 'technologies', exp.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(exp.technologies) && exp.technologies.map((t) => (
                          <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-bg-primary)] text-[10px] font-semibold border border-[var(--color-border-default)] text-[var(--color-text-primary)]">
                            {t}
                            <button 
                              type="button" 
                              onClick={() => deleteExpSubItem(exp.id, 'technologies', t)}
                              className="text-rose-500 font-bold hover:text-rose-400 cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {(!data.experience || data.experience.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No work experience added yet. Click "+ Add Job" to start listing your roles.
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Education */}
            {activeStep === 'education' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Education Details</h4>
                  <button onClick={addEducation} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add School
                  </button>
                </div>

                {data.education && data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between border-b pb-1 border-slate-700/30">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Degree / School #{idx + 1}</span>
                      <button onClick={() => deleteEducation(edu.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete Degree</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Institution / School Name</label>
                        <input
                          type="text"
                          value={edu.university}
                          onChange={(e) => updateEducation(edu.id, 'university', e.target.value)}
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
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Specialization / Field of Study</label>
                        <input
                          type="text"
                          value={edu.specialization}
                          onChange={(e) => updateEducation(edu.id, 'specialization', e.target.value)}
                          placeholder="Computer Science"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">CGPA / GPA</label>
                        <input
                          type="text"
                          value={edu.cgpa}
                          onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                          placeholder="8.5 / 10"
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
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                          placeholder="2017"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                          placeholder="2021"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Key Coursework (Optional)</label>
                      <input
                        type="text"
                        value={edu.coursework}
                        onChange={(e) => updateEducation(edu.id, 'coursework', e.target.value)}
                        placeholder="Algorithms, Databases, Web Systems, Distributed Computing"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {(!data.education || data.education.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No academic background added yet. Click "+ Add School" to start listing your degrees.
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Projects */}
            {activeStep === 'projects' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Featured Projects</h4>
                  <button onClick={addProject} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Project
                  </button>
                </div>

                {data.projects && data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between border-b pb-1 border-slate-700/30">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Project #{idx + 1}</span>
                      <button onClick={() => deleteProject(proj.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete Project</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                          placeholder="E-Commerce API"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Role / Tech Lead</label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                          placeholder="Lead Back-End Architect"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Project Duration</label>
                        <input
                          type="text"
                          value={proj.duration}
                          onChange={(e) => updateProject(proj.id, 'duration', e.target.value)}
                          placeholder="3 Months (2023)"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">GitHub Link</label>
                        <input
                          type="text"
                          value={proj.github}
                          onChange={(e) => updateProject(proj.id, 'github', e.target.value)}
                          placeholder="github.com/johndoe/ecommerce"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Live Demo / Deployment URL</label>
                        <input
                          type="text"
                          value={proj.liveDemo}
                          onChange={(e) => updateProject(proj.id, 'liveDemo', e.target.value)}
                          placeholder="ecommerce-demo.johndoe.com"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-[var(--color-bg-secondary)] p-3 rounded-xl border border-[var(--color-border-default)]">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-[var(--color-text-primary)]">Project Description</label>
                        <button 
                          type="button"
                          onClick={() => handleAIGenerateProjectDesc(proj.id, proj.title)}
                          className="px-2 py-0.5 text-[9px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer"
                        >
                          🔮 AI Auto prefill
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Describe the main architecture and context of the project here..."
                        className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                      />
                    </div>

                    {/* Features repeatable list */}
                    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)]">
                      <label className="text-xs font-bold text-[var(--color-text-primary)]">Key Features (Repeatable bullets)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={projFeatureInput[proj.id] || ''}
                          onChange={(e) => setProjFeatureInput(prev => ({ ...prev, [proj.id]: e.target.value }))}
                          placeholder="Add key feature details"
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => addProjSubItem(proj.id, 'features')}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1 mt-1 text-[var(--color-text-secondary)]">
                        {Array.isArray(proj.features) && proj.features.map((feature, i) => (
                          <li key={i}>
                            <span>{feature}</span>
                            <button 
                              type="button" 
                              onClick={() => deleteProjSubItem(proj.id, 'features', feature)}
                              className="ml-2 text-rose-500 hover:underline text-[10px] font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech tag list */}
                    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)]">
                      <label className="text-xs font-bold text-[var(--color-text-primary)]">Technologies Used (Tags)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={projTechInput[proj.id] || ''}
                          onChange={(e) => setProjTechInput(prev => ({ ...prev, [proj.id]: e.target.value }))}
                          placeholder="Add tech tag"
                          className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-3 py-1.5 text-xs flex-1 text-[var(--color-text-primary)] focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => addProjSubItem(proj.id, 'technologies')}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(proj.technologies) && proj.technologies.map((t) => (
                          <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-bg-primary)] text-[10px] font-semibold border border-[var(--color-border-default)] text-[var(--color-text-primary)]">
                            {t}
                            <button 
                              type="button" 
                              onClick={() => deleteProjSubItem(proj.id, 'technologies', t)}
                              className="text-rose-500 font-bold hover:text-rose-400 cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {(!data.projects || data.projects.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No projects listed yet. Click "+ Add Project" to showcase your portfolio work.
                  </div>
                )}
              </div>
            )}

            {/* Step 8: Certifications */}
            {activeStep === 'certifications' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Certifications</h4>
                  <button onClick={addCertification} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Certification
                  </button>
                </div>

                {data.certifications && data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between border-b pb-1 border-slate-700/30">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Certificate #{idx + 1}</span>
                      <button onClick={() => deleteCertification(cert.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Certification Name</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                          placeholder="AWS Certified Solutions Architect"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Issuer / Organization</label>
                        <input
                          type="text"
                          value={cert.organization}
                          onChange={(e) => updateCertification(cert.id, 'organization', e.target.value)}
                          placeholder="Amazon Web Services"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Issue Date</label>
                        <input
                          type="text"
                          value={cert.issueDate}
                          onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                          placeholder="March 2023"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Credential ID (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialId}
                          onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                          placeholder="AWS-193A-B981"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Credential URL (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialUrl}
                          onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                          placeholder="cred.aws.amazon.com/verify/193A"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!data.certifications || data.certifications.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No certifications added yet. Click "+ Add Certification" to list your credentials.
                  </div>
                )}
              </div>
            )}

            {/* Step 9: Achievements */}
            {activeStep === 'achievements' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Achievements</h4>
                  <button onClick={addAchievement} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Achievement
                  </button>
                </div>

                {data.achievements && data.achievements.map((ach, idx) => (
                  <div key={ach.id} className="p-4 rounded-xl border flex flex-col gap-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between border-b pb-1 border-slate-700/30">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Achievement #{idx + 1}</span>
                      <button onClick={() => deleteAchievement(ach.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Achievement / Award Title</label>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                          placeholder="Hackathon Winner"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Date Achieved</label>
                        <input
                          type="text"
                          value={ach.date}
                          onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)}
                          placeholder="Dec 2023"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={ach.description}
                        onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                        placeholder="Won 1st place among 120 participating teams in Global Hackathon."
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {(!data.achievements || data.achievements.length === 0) && (
                  <div className="text-center py-8 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No achievements added yet. Click "+ Add Achievement" to showcase your awards.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Live PDF Document Preview */}
        <div 
          className={`flex flex-col gap-4 preview-column ${
            previewMode === 'edit' 
              ? 'absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none' 
              : 'w-full'
          }`}
        >
          <div className="text-center pb-2 border-b border-[var(--color-border-default)] flex justify-between items-center no-print">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Live PDF Preview</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Scrollable Flow Output</span>
          </div>

          <div className="overflow-x-auto w-full flex justify-center bg-slate-900/50 p-6 rounded-2xl border border-[var(--color-border-default)] preview-wrapper">
            {/* The element we convert to image and output to PDF */}
            <div 
              ref={previewRef} 
              className="w-full max-w-[800px] shadow-2xl overflow-hidden print-area"
              style={{
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
          /* Hide all page layouts, hero headers, footers, CTAs, navigation and non-print tool panels */
          header, footer, nav, aside, 
          section:not([aria-label*="Tool"]), 
          #main-content > div:not([aria-label*="Tool"]),
          .no-print {
            display: none !important;
          }

          /* Force preview columns and wrappers to display fully on print, overriding hidden classes */
          .preview-column,
          .preview-wrapper {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          /* Reset Astro wrappers and grids for isolated block rendering */
          section[aria-label*="Tool"],
          .section-container,
          .card,
          .grid {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          /* Force body/html elements to occupy full dimensions without scrolling or padding */
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Format page container to occupy full print viewport */
          .print-area {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
          }

          /* Ensure sidebar background goes all the way to the bottom of the printed page without being cut off */
          .columns-wrapper {
            background: linear-gradient(to right, #ECEFF1 32%, #ffffff 32%) !important;
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
          }

          .columns-wrapper > div:first-child {
            background: transparent !important;
            border-right: 1px solid #cbd5e1 !important;
          }

          /* Force browser print engines to render exact background colors and custom SVGs */
          .print-area, .print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Clear page header margins and print empty borders cleanly */
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
