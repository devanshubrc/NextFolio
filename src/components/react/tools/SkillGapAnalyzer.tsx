import React, { useState, useEffect } from 'react';
import roadmapsData from '../../../data/careerRoadmaps.json';

interface Skill {
  name: string;
  desc: string;
}

export default function SkillGapAnalyzer() {
  const [role, setRole] = useState<'frontend' | 'backend'>('frontend');
  const [mySkills, setMySkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'gap'>('current');

  // Load current skills on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nextfolios-my-skills');
      if (saved) {
        setMySkills(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveMySkills = (nextSkills: string[]) => {
    setMySkills(nextSkills);
    try {
      localStorage.setItem('nextfolios-my-skills', JSON.stringify(nextSkills));
    } catch (e) {}
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const clean = skillInput.trim().toLowerCase();
    
    // Check duplication
    if (mySkills.map(s => s.toLowerCase()).includes(clean)) {
      setSkillInput('');
      return;
    }

    const next = [...mySkills, skillInput.trim()];
    saveMySkills(next);
    setSkillInput('');
  };

  const deleteSkill = (skillToDelete: string) => {
    const next = mySkills.filter(s => s !== skillToDelete);
    saveMySkills(next);
  };

  // Run Gap Analysis
  const getRequiredSkills = (): Skill[] => {
    const activeRoadmap = (roadmapsData as any)[role] || roadmapsData.frontend;
    const allSkills: Skill[] = [];
    activeRoadmap.forEach((stage: any) => {
      stage.skills.forEach((s: any) => {
        allSkills.push(s);
      });
    });
    return allSkills;
  };

  const requiredSkills = getRequiredSkills();

  // Simple string-match parser
  const analyzeGaps = () => {
    const matched: Skill[] = [];
    const missing: Skill[] = [];

    requiredSkills.forEach(req => {
      const reqName = req.name.toLowerCase();
      // Match if any user skill matches exactly or is contained within the name
      const hasSkill = mySkills.some(my => {
        const myName = my.toLowerCase();
        return reqName.includes(myName) || myName.includes(reqName);
      });

      if (hasSkill) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    return { matched, missing };
  };

  const { matched, missing } = analyzeGaps();
  const matchPercent = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Role & Progress Meter */}
        <div className="card p-6 flex flex-col gap-6 h-fit">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2 mb-4" style={{ borderColor: 'var(--color-border-default)' }}>
              Analysis Setup
            </h3>

            <label htmlFor="gap-role-select" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Target Career Track</label>
            <select
              id="gap-role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border font-medium cursor-pointer transition-colors w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
            </select>
          </div>

          {/* Proficiency Meter */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--color-border-default)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Role Match Rate</span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{matchPercent}%</span>
            </div>

            <div className="w-full h-2 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${matchPercent}%`,
                  backgroundColor: matchPercent >= 75 ? 'var(--color-status-success)' : matchPercent >= 40 ? 'var(--color-status-warning)' : 'var(--color-status-error)'
                }}
              />
            </div>

            <div className="flex flex-col gap-1 text-[10px] text-[var(--color-text-muted)]">
              <span>Technical matches: {matched.length} matched</span>
              <span>Missing skills: {missing.length} remaining</span>
            </div>
          </div>
        </div>

        {/* Right Column: Skills Setup & Gap List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border-default)]">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === 'current'
                  ? 'border-[var(--color-text-accent)] text-[var(--color-text-accent)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              1. Add My Skills ({mySkills.length})
            </button>
            <button
              onClick={() => setActiveTab('gap')}
              className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === 'gap'
                  ? 'border-[var(--color-text-accent)] text-[var(--color-text-accent)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              2. View Skill Gaps ({missing.length})
            </button>
          </div>

          {/* Current Skills Tab */}
          {activeTab === 'current' && (
            <div className="card p-6 flex flex-col gap-5">
              <div>
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">Enter Your Current Tech Stack</h4>
                <p className="text-xs text-[var(--color-text-muted)]">List languages, databases, or frameworks you have built projects with.</p>
              </div>

              <form onSubmit={addSkill} className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. JavaScript, PostgreSQL, CSS"
                  className="form-input bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl px-4 py-2 text-sm flex-1 text-[var(--color-text-primary)] focus:outline-none"
                />
                <button type="submit" className="btn-primary py-2 px-4 font-semibold text-sm">Add Skill</button>
              </form>

              <div className="flex flex-wrap gap-2 mt-2">
                {mySkills.map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]">
                    {skill}
                    <button type="button" onClick={() => deleteSkill(skill)} className="text-[10px] text-slate-400 hover:text-white cursor-pointer">×</button>
                  </span>
                ))}

                {mySkills.length === 0 && (
                  <div className="text-xs text-[var(--color-text-muted)] w-full py-8 text-center border border-dashed rounded-xl border-[var(--color-border-default)]">
                    No skills added yet. Type your skills above to run the gap audit!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skill Gap Results Tab */}
          {activeTab === 'gap' && (
            <div className="flex flex-col gap-4">
              
              {/* Missing Skills Cards */}
              <div className="flex flex-col gap-3">
                {missing.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border flex flex-col gap-2 bg-[var(--color-bg-secondary)] border-[var(--color-border-default)]"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[var(--color-text-primary)]">{skill.name}</span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">High Priority</span>
                    </div>
                    
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {skill.desc}
                    </p>
                    
                    <div className="mt-2 text-[10px] font-semibold text-indigo-400">
                      Recommendation: Learn concepts and build a small project incorporating this skill.
                    </div>
                  </div>
                ))}

                {missing.length === 0 && (
                  <div className="card p-8 text-center text-sm text-emerald-400 font-medium">
                    🎉 Outstanding! You have no missing skills for this role. You are job-ready!
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
