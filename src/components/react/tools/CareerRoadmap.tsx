import React, { useState, useEffect } from 'react';
import roadmapsData from '../../../data/careerRoadmaps.json';

interface Skill {
  name: string;
  desc: string;
}

interface Stage {
  stage: string;
  skills: Skill[];
}

export default function CareerRoadmap() {
  const [role, setRole] = useState<'frontend' | 'backend'>('frontend');
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>({});

  const activeRoadmap: Stage[] = (roadmapsData as any)[role] || roadmapsData.frontend;

  // Calculate total skills in current roadmap
  const totalSkills = activeRoadmap.reduce((acc, stage) => acc + stage.skills.length, 0);

  // Calculate checked skills in current roadmap
  const getCompletedCount = () => {
    let count = 0;
    activeRoadmap.forEach(stage => {
      stage.skills.forEach(skill => {
        const skillKey = `${role}-${skill.name}`;
        if (checkedSkills[skillKey]) count++;
      });
    });
    return count;
  };

  const completedCount = getCompletedCount();
  const progressPercent = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  // Load checks on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nextfolios-roadmap-checks');
      if (saved) {
        setCheckedSkills(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleCheckChange = (skillName: string, isChecked: boolean) => {
    const skillKey = `${role}-${skillName}`;
    const nextChecks = { ...checkedSkills, [skillKey]: isChecked };
    setCheckedSkills(nextChecks);
    try {
      localStorage.setItem('nextfolios-roadmap-checks', JSON.stringify(nextChecks));
    } catch (e) {}
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls and Progress Panel */}
        <div className="card p-6 flex flex-col gap-6 h-fit">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2 mb-4" style={{ borderColor: 'var(--color-border-default)' }}>
              Select Roadmap
            </h3>
            
            <label htmlFor="roadmap-role-select" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">Career Path</label>
            <select
              id="roadmap-role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border font-medium cursor-pointer transition-colors w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="frontend">Frontend Developer Path</option>
              <option value="backend">Backend Developer Path</option>
            </select>
          </div>

          {/* Progress gauge */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--color-border-default)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Path Progress</span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{progressPercent}%</span>
            </div>
            
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent === 100 ? 'var(--color-status-success)' : 'var(--color-text-accent)'
                }}
              />
            </div>
            
            <span className="text-[10px] text-[var(--color-text-muted)] mt-2 block">
              Completed {completedCount} out of {totalSkills} skills in this track.
            </span>
          </div>
        </div>

        {/* Timeline Columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative pl-6 flex flex-col gap-8 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[var(--color-border-default)]">
            
            {activeRoadmap.map((stageBlock, sIdx) => (
              <div key={sIdx} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-[20px] top-1.5 w-3 h-3 rounded-full bg-[var(--color-text-accent)] border border-[var(--color-bg-primary)] ring-4 ring-indigo-500/10"></div>
                
                <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-3">
                  {stageBlock.stage}
                </h4>

                <div className="flex flex-col gap-3">
                  {stageBlock.skills.map((skill, kIdx) => {
                    const isChecked = !!checkedSkills[`${role}-${skill.name}`];
                    return (
                      <div
                        key={kIdx}
                        className="p-4 rounded-xl border flex items-start gap-4 transition-all duration-150"
                        style={{
                          background: isChecked ? 'rgba(99, 102, 241, 0.02)' : 'var(--color-bg-secondary)',
                          borderColor: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'var(--color-border-default)'
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`skill-${sIdx}-${kIdx}`}
                          checked={isChecked}
                          onChange={(e) => handleCheckChange(skill.name, e.target.checked)}
                          className="w-4 h-4 mt-0.5 cursor-pointer accent-indigo-500 shrink-0"
                        />
                        <div>
                          <label
                            htmlFor={`skill-${sIdx}-${kIdx}`}
                            className="font-bold text-xs cursor-pointer select-none"
                            style={{ color: isChecked ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                          >
                            {skill.name}
                          </label>
                          <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'var(--color-text-muted)' }}>
                            {skill.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
