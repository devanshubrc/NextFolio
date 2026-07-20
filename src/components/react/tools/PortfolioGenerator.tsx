import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tech: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
}

interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
}

const INITIAL_DATA: PortfolioData = {
  name: '',
  role: '',
  bio: '',
  about: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  skills: [],
  projects: [],
  experience: [],
};

export default function PortfolioGenerator() {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [theme, setTheme] = useState<'minimalist' | 'developer' | 'gradient'>('minimalist');
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'experience' | 'skills'>('info');
  const [skillInput, setSkillInput] = useState('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nextfolios-portfolio-data');
      if (saved) setData(JSON.parse(saved));
      const savedTheme = localStorage.getItem('nextfolios-portfolio-theme');
      if (savedTheme) setTheme(savedTheme as any);
    } catch (e) {}
  }, []);

  const updateData = (updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('nextfolios-portfolio-data', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleTextChange = (field: keyof PortfolioData, value: string) => {
    updateData((prev) => ({
      ...prev,
      [field]: value,
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
          title: '',
          description: '',
          link: '',
          tech: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
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

  // Experience Handlers
  const addExperience = () => {
    updateData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: '',
          company: '',
          duration: '',
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
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

  const changeTheme = (t: typeof theme) => {
    setTheme(t);
    try {
      localStorage.setItem('nextfolios-portfolio-theme', t);
    } catch (e) {}
  };

  // Generate HTML Template String
  const generatePortfolioHTML = (): string => {
    const { name, role, bio, about, email, github, linkedin, twitter, skills, projects, experience } = data;
    
    const pageName = name || 'My Portfolio';
    const pageRole = role || 'Web Developer';
    const pageBio = bio || 'Welcome to my digital space. I build high-performance web systems and design responsive user experiences.';
    const pageAbout = about || 'I am a passionate software creator with a focus on writing clean, modular code. I enjoy solving complex structural challenges and optimizing browser-side rendering pipelines.';

    // Embedded theme styles
    let styles = '';
    if (theme === 'minimalist') {
      styles = `
        :root {
          --bg: #ffffff;
          --text: #18181b;
          --muted: #71717a;
          --border: #e4e4e7;
          --accent: #09090b;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          margin: 0;
          padding: 3rem 1.5rem;
          line-height: 1.6;
        }
        .container { max-width: 650px; margin: 0 auto; }
        header { margin-bottom: 4rem; }
        h1 { font-size: 2.25rem; font-weight: 700; margin: 0; tracking: -0.025em; }
        .role { color: var(--muted); font-size: 1.1rem; margin-top: 0.25rem; }
        .bio { margin-top: 1.5rem; font-size: 1.05rem; color: var(--muted); }
        section { margin-bottom: 3.5rem; }
        h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        .links { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .links a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 0.9rem; border-bottom: 1px solid var(--text); padding-bottom: 2px; }
        .project-card { margin-bottom: 2rem; }
        .project-title { font-weight: 600; font-size: 1.1rem; text-decoration: none; color: var(--text); display: inline-flex; align-items: center; gap: 0.25rem; }
        .project-desc { color: var(--muted); font-size: 0.95rem; margin: 0.5rem 0; }
        .project-tech { font-family: monospace; font-size: 0.8rem; color: var(--muted); }
        .experience-item { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .exp-role { font-weight: 600; }
        .exp-company { color: var(--muted); font-size: 0.9rem; }
        .exp-duration { color: var(--muted); font-size: 0.85rem; font-family: monospace; }
        .skill-tag { display: inline-block; background: #f4f4f5; font-size: 0.8rem; font-weight: 500; padding: 0.25rem 0.6rem; rounded-radius: 4px; margin-right: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border); }
      `;
    } else if (theme === 'developer') {
      styles = `
        :root {
          --bg: #09090b;
          --text: #a1a1aa;
          --primary: #22c55e;
          --headers: #f4f4f5;
          --border: #27272a;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          background: var(--bg);
          color: var(--text);
          margin: 0;
          padding: 2.5rem 1.5rem;
          line-height: 1.6;
        }
        .container { max-width: 700px; margin: 0 auto; }
        header { margin-bottom: 3rem; border-bottom: 2px dashed var(--border); padding-bottom: 2rem; }
        h1 { font-size: 1.8rem; font-weight: bold; margin: 0; color: var(--headers); }
        .role { color: var(--primary); font-size: 1.1rem; margin-top: 0.5rem; }
        .bio { margin-top: 1rem; }
        section { margin-bottom: 3rem; }
        h2 { font-size: 1.1rem; color: var(--primary); margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem; }
        .links { display: flex; gap: 1.5rem; margin-top: 1rem; }
        .links a { color: var(--headers); text-decoration: none; }
        .links a::before { content: '> '; color: var(--primary); }
        .project-card { margin-bottom: 2rem; padding: 1rem; border: 1px solid var(--border); border-radius: 4px; }
        .project-title { font-weight: bold; font-size: 1.1rem; text-decoration: none; color: var(--headers); }
        .project-title:hover { color: var(--primary); }
        .project-desc { margin: 0.5rem 0; font-size: 0.9rem; }
        .project-tech { color: var(--primary); font-size: 0.8rem; }
        .experience-item { margin-bottom: 1.5rem; }
        .exp-header { display: flex; justify-content: space-between; font-weight: bold; color: var(--headers); }
        .exp-company { color: var(--text); }
        .exp-duration { font-style: italic; }
        .skill-tag { display: inline-block; border: 1px solid var(--primary); color: var(--primary); font-size: 0.8rem; padding: 0.2rem 0.5rem; margin-right: 0.5rem; margin-bottom: 0.5rem; border-radius: 2px; }
      `;
    } else {
      // gradient / premium styling
      styles = `
        :root {
          --bg: #030712;
          --text: #f3f4f6;
          --muted: #9ca3af;
          --border: rgba(255,255,255,0.06);
          --accent-start: #6366f1;
          --accent-end: #ec4899;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          margin: 0;
          padding: 4rem 1.5rem;
          line-height: 1.7;
        }
        .container { max-width: 720px; margin: 0 auto; }
        header { margin-bottom: 4rem; position: relative; }
        header::after { content: ''; position: absolute; bottom: -2rem; left: 0; width: 60px; height: 4px; background: linear-gradient(90deg, var(--accent-start), var(--accent-end)); border-radius: 2px; }
        h1 { font-size: 2.75rem; font-weight: 800; margin: 0; tracking: -0.03em; background: linear-gradient(135deg, #ffffff 30%, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .role { font-size: 1.25rem; font-weight: 600; margin-top: 0.5rem; background: linear-gradient(90deg, var(--accent-start), var(--accent-end)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bio { margin-top: 1.5rem; font-size: 1.1rem; color: var(--muted); }
        section { margin-bottom: 4rem; }
        h2 { font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .links { display: flex; gap: 1.5rem; margin-top: 1.5rem; }
        .links a { color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: opacity 0.2s; }
        .links a:hover { opacity: 0.8; }
        .project-card { margin-bottom: 2rem; padding: 1.5rem; border: 1px solid var(--border); background: rgba(255,255,255,0.02); border-radius: 12px; }
        .project-title { font-weight: 700; font-size: 1.15rem; text-decoration: none; color: #ffffff; display: inline-flex; align-items: center; gap: 0.25rem; }
        .project-title:hover { background: linear-gradient(90deg, var(--accent-start), var(--accent-end)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .project-desc { color: var(--muted); font-size: 0.95rem; margin: 0.75rem 0; }
        .project-tech { font-family: monospace; font-size: 0.8rem; color: var(--accent-start); font-weight: 600; }
        .experience-item { display: flex; justify-content: space-between; margin-bottom: 1.75rem; padding-left: 1rem; border-left: 2px solid var(--border); }
        .exp-role { font-weight: 700; color: #ffffff; }
        .exp-company { color: var(--muted); font-size: 0.95rem; margin-top: 0.25rem; }
        .exp-duration { color: var(--accent-end); font-size: 0.85rem; font-family: monospace; font-weight: 600; }
        .skill-tag { display: inline-block; background: rgba(99, 102, 241, 0.08); color: #a5b4fc; font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.75rem; border-radius: 9999px; margin-right: 0.5rem; margin-bottom: 0.5rem; border: 1px solid rgba(99, 102, 241, 0.15); }
      `;
    }

    // Projects markup
    const projectsHTML = projects.map(p => `
      <div class="project-card">
        <div>
          <a href="${p.link || '#'}" target="_blank" class="project-title">${p.title || 'Untitled Project'} ↗</a>
        </div>
        <p class="project-desc">${p.description || 'Description not added yet.'}</p>
        ${p.tech ? `<div class="project-tech">${p.tech.split(',').map(t => t.trim()).join(' • ')}</div>` : ''}
      </div>
    `).join('');

    // Experience markup
    const expHTML = experience.map(e => `
      <div class="experience-item">
        <div>
          <div class="exp-role">${e.role || 'Job Role'}</div>
          <div class="exp-company">${e.company || 'Company Name'}</div>
        </div>
        <div class="exp-duration">${e.duration || '2023 - Present'}</div>
      </div>
    `).join('');

    // Skills markup
    const skillsHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName} — Portfolio</title>
  <style>
    ${styles}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${pageName}</h1>
      <div class="role">${pageRole}</div>
      <p class="bio">${pageBio}</p>
      
      <div class="links">
        ${email ? `<a href="mailto:${email}">Email</a>` : ''}
        ${github ? `<a href="https://github.com/${github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}" target="_blank">GitHub</a>` : ''}
        ${linkedin ? `<a href="https://linkedin.com/in/${linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}" target="_blank">LinkedIn</a>` : ''}
        ${twitter ? `<a href="https://twitter.com/${twitter.replace(/^(https?:\/\/)?(www\.)?twitter\.com\//, '')}" target="_blank">Twitter</a>` : ''}
      </div>
    </header>

    <main>
      <section id="about">
        <h2>About Me</h2>
        <p>${pageAbout}</p>
      </section>

      ${projects.length > 0 ? `
      <section id="projects">
        <h2>Featured Projects</h2>
        ${projectsHTML}
      </section>
      ` : ''}

      ${experience.length > 0 ? `
      <section id="experience">
        <h2>Experience</h2>
        ${expHTML}
      </section>
      ` : ''}

      ${skills.length > 0 ? `
      <section id="skills">
        <h2>Skills</h2>
        <div class="skills-container">
          ${skillsHTML}
        </div>
      </section>
      ` : ''}
    </main>
  </div>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    const html = generatePortfolioHTML();
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const html = generatePortfolioHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your portfolio data?')) {
      setData(INITIAL_DATA);
      try {
        localStorage.removeItem('nextfolios-portfolio-data');
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>Choose Style</span>
          <div className="flex flex-wrap gap-1.5">
            {['minimalist', 'developer', 'gradient'].map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer border ${
                  theme === t
                    ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]'
                    : 'bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={() => setPreviewMode(m => m === 'edit' ? 'preview' : 'edit')}
            className="lg:hidden btn-secondary py-2 px-4 text-xs font-semibold"
          >
            {previewMode === 'edit' ? 'Show Preview' : 'Show Form'}
          </button>
          
          <button onClick={handleClear} className="btn-secondary py-2 px-4 text-xs font-semibold">
            Clear
          </button>

          <button onClick={handleCopyCode} className="btn-secondary py-2 px-4 text-xs font-semibold">
            {copied ? 'Copied HTML!' : 'Copy HTML Code'}
          </button>

          <button
            onClick={handleDownload}
            className="btn-primary py-2 px-4 text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid))',
              color: '#ffffff',
            }}
          >
            Download HTML File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Form Column */}
        <div className={`flex flex-col gap-6 ${previewMode === 'preview' ? 'hidden lg:flex' : ''}`}>
          
          {/* Navigation */}
          <div className="flex border-b border-[var(--color-border-default)]">
            {[
              { id: 'info', label: '1. Personal Info' },
              { id: 'projects', label: '2. Projects' },
              { id: 'experience', label: '3. Experience' },
              { id: 'skills', label: '4. Skills' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[var(--color-text-accent)] text-[var(--color-text-accent)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form panels */}
          <div className="card p-6 flex flex-col gap-4">
            
            {activeTab === 'info' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="p-name" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Full Name</label>
                    <input
                      id="p-name"
                      type="text"
                      value={data.name}
                      onChange={(e) => handleTextChange('name', e.target.value)}
                      placeholder="Jane Doe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="p-role" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Job Title</label>
                    <input
                      id="p-role"
                      type="text"
                      value={data.role}
                      onChange={(e) => handleTextChange('role', e.target.value)}
                      placeholder="Backend & Cloud Architect"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="p-bio" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Short Bio</label>
                  <input
                    id="p-bio"
                    type="text"
                    value={data.bio}
                    onChange={(e) => handleTextChange('bio', e.target.value)}
                    placeholder="Vibrant, brief welcome tagline..."
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="p-about" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">About Me Description</label>
                  <textarea
                    id="p-about"
                    rows={4}
                    value={data.about}
                    onChange={(e) => handleTextChange('about', e.target.value)}
                    placeholder="Tell visitors more details about your work style, favorite tech stacks, and career milestones..."
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="p-email" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Contact Email</label>
                    <input
                      id="p-email"
                      type="email"
                      value={data.email}
                      onChange={(e) => handleTextChange('email', e.target.value)}
                      placeholder="jane.doe@example.com"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="p-github" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">GitHub Username</label>
                    <input
                      id="p-github"
                      type="text"
                      value={data.github}
                      onChange={(e) => handleTextChange('github', e.target.value)}
                      placeholder="janedoe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="p-linkedin" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">LinkedIn Username</label>
                    <input
                      id="p-linkedin"
                      type="text"
                      value={data.linkedin}
                      onChange={(e) => handleTextChange('linkedin', e.target.value)}
                      placeholder="janedoe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="p-twitter" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Twitter/X Username</label>
                    <input
                      id="p-twitter"
                      type="text"
                      value={data.twitter}
                      onChange={(e) => handleTextChange('twitter', e.target.value)}
                      placeholder="janedoe"
                      className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Portfolio Projects</h4>
                  <button onClick={addProject} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Project
                  </button>
                </div>

                {data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 rounded-xl border flex flex-col gap-3 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-text-muted)]">Project #{idx + 1}</span>
                      <button onClick={() => deleteProject(proj.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                          placeholder="Task Manager Platform"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Link URL</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          placeholder="https://tasks.example.com"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Description</label>
                      <input
                        type="text"
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Brief summary of what this app does..."
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                        placeholder="React, Tailwind, Node.js"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {data.projects.length === 0 && (
                  <div className="text-center py-6 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No projects listed yet. Click "+ Add Project".
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Experience Roles</h4>
                  <button onClick={addExperience} className="btn-primary py-1 px-3 text-xs font-semibold">
                    + Add Role
                  </button>
                </div>

                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl border flex flex-col gap-3 bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-text-muted)]">Role #{idx + 1}</span>
                      <button onClick={() => deleteExperience(exp.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          placeholder="Senior Developer"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Stripe"
                          className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Duration (e.g. 2021 - 2023)</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        placeholder="2021 - Present"
                        className="form-input bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm w-full text-[var(--color-text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                {data.experience.length === 0 && (
                  <div className="text-center py-6 text-xs text-[var(--color-text-muted)] border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No experience roles listed yet. Click "+ Add Role".
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] border-b pb-2" style={{ borderColor: 'var(--color-border-default)' }}>Skills</h4>

                <form onSubmit={addSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="React, CSS, Go"
                    className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm flex-1 text-[var(--color-text-primary)] focus:outline-none"
                  />
                  <button type="submit" className="btn-primary py-2 px-4 font-semibold text-sm">Add</button>
                </form>

                <div className="flex flex-wrap gap-2 mt-2">
                  {data.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] rounded-full">
                      {skill}
                      <button type="button" onClick={() => deleteSkill(skill)} className="text-[10px] text-slate-400 hover:text-white cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Live HTML Preview Column */}
        <div className={`flex flex-col gap-4 ${previewMode === 'edit' ? 'hidden lg:flex' : ''}`}>
          <div className="text-center pb-2 border-b border-[var(--color-border-default)] flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>HTML Portfolio Preview</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Self-contained Interactive Sandbox</span>
          </div>

          <div className="w-full border rounded-2xl overflow-hidden h-[600px] bg-slate-900 border-[var(--color-border-default)]">
            <iframe
              title="Portfolio Live Sandbox Preview"
              srcDoc={generatePortfolioHTML()}
              className="w-full h-full bg-white border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
