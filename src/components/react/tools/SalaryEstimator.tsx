import React, { useState, useEffect } from 'react';
import salaryData from '../../../data/salaryData.json';

type RoleKey = 'frontend' | 'backend' | 'devops' | 'datascience' | 'pm' | 'uiux';
type ExpKey = 'junior' | 'mid' | 'senior' | 'lead';

export default function SalaryEstimator() {
  const [role, setRole] = useState<RoleKey>('frontend');
  const [country, setCountry] = useState('US');
  const [experience, setExperience] = useState<ExpKey>('mid');
  const [salaryVal, setSalaryVal] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [negotiationTab, setNegotiationTab] = useState<'counter' | 'raise' | 'benefits'>('counter');

  const selectedCountryInfo = salaryData.countries.find(c => c.code === country) || salaryData.countries[0];

  useEffect(() => {
    try {
      const dataSet = (salaryData.salaries as any)[role]?.[country];
      if (dataSet) {
        setSalaryVal(dataSet[experience]);
      }
      setCurrencySymbol(selectedCountryInfo.currency);
    } catch (e) {
      console.error(e);
    }
  }, [role, country, experience, selectedCountryInfo]);

  // Format currency
  const formatVal = (val: number) => {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(val);
  };

  // Negotiation scripts based on parameters
  const getNegotiationScript = () => {
    const formattedVal = `${currencySymbol}${formatVal(salaryVal)}`;
    const roleTitle = role.toUpperCase();
    
    if (negotiationTab === 'counter') {
      return {
        scenario: 'Handling an initial job offer that falls below expectations',
        bullets: [
          'Acknowledge and show genuine excitement for the offer and the team.',
          'Present the market-rate data backed by NextFolios benchmarks.',
          'State a counter-proposal range that is 10-15% higher than the initial offer.',
          'Emphasize your immediate value and skills you bring to the position.'
        ],
        template: `Thank you so much for extending the offer for the ${roleTitle} position! I am extremely excited about the opportunity to join the team and contribute to your upcoming projects.\n\nBased on my research of current market benchmarks for someone with my experience in this location, the standard compensation ranges around ${formattedVal}. Given my technical skills in this domain, I would like to discuss if we could adjust the base salary to a range closer to ${currencySymbol}${formatVal(salaryVal * 1.1)} – ${currencySymbol}${formatVal(salaryVal * 1.15)}.\n\nI believe my background makes me well-positioned to drive immediate impact, and I am eager to align on a package that reflects this value. Let me know if we can schedule a brief call to discuss this.`
      };
    } else if (negotiationTab === 'raise') {
      return {
        scenario: 'Preparing for an internal review or raise request',
        bullets: [
          'Highlight specific contributions, optimizations, and deliverables from the past year.',
          'Provide clear benchmarks demonstrating that your current salary is below market value.',
          'Link the salary adjustment to your continued dedication to the team\'s long-term success.',
          'Keep the tone collaborative and focused on value added.'
        ],
        template: `I want to thank you for taking the time to discuss my career progression. Over the past year, I have really enjoyed leading our key initiatives, including optimizing our system structures, which helped save hours of developer time.\n\nI have been reviewing market data for similar ${roleTitle} roles, and the current benchmark stands around ${formattedVal}. To ensure my compensation aligns with both these market rates and the scope of my contributions, I would like to request an adjustment of my base salary to ${currencySymbol}${formatVal(salaryVal * 1.08)}.\n\nI am deeply committed to the team's goals and look forward to continuing to drive results in the upcoming quarters.`
      };
    } else {
      return {
        scenario: 'Negotiating for non-salary benefits and equity perks',
        bullets: [
          'Use this when the base salary budget is strictly capped.',
          'Propose high-value, low-cost perks (remote work, training budgets, extra PTO).',
          'Ask for a performance-based review in 6 months instead of 12.',
          'Get all agreed modifications documented in the final contract.'
        ],
        template: `I understand that there may be strict budget constraints regarding the base salary for this ${roleTitle} role. Because I am very keen on joining the team, I would be open to discussing alternative benefits to bridge the gap.\n\nSpecifically, could we explore options such as a remote-first work schedule, an annual learning/conference budget of ${currencySymbol}2,000, or an additional 5 days of paid time off?\n\nAdditionally, I would love to request a milestone-based salary review in 6 months rather than a year, to align compensation as I hit key deliverables. Thank you for your flexibility!`
      };
    }
  };

  const activeScript = getNegotiationScript();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="card p-6 flex flex-col gap-5">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] border-b pb-2 mb-2" style={{ borderColor: 'var(--color-border-default)' }}>
            Estimate Parameters
          </h3>

          {/* Job Role Select */}
          <div>
            <label htmlFor="salary-role" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Target Job Role</label>
            <select
              id="salary-role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border font-medium cursor-pointer transition-colors w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="devops">DevOps / Site Reliability</option>
              <option value="datascience">Data Scientist / AI Engineer</option>
              <option value="pm">Product Manager</option>
              <option value="uiux">UI/UX Designer</option>
            </select>
          </div>

          {/* Location Country Select */}
          <div>
            <label htmlFor="salary-country" className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Target Location</label>
            <select
              id="salary-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-2.5 rounded-xl border font-medium cursor-pointer transition-colors w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              {salaryData.countries.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
              ))}
            </select>
          </div>

          {/* Experience level selector */}
          <div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">Experience Level</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'junior', label: 'Junior (0-2y)' },
                { key: 'mid', label: 'Mid (2-5y)' },
                { key: 'senior', label: 'Senior (5-10y)' },
                { key: 'lead', label: 'Lead (10y+)' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setExperience(item.key as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer text-center ${
                    experience === item.key
                      ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]'
                      : 'bg-transparent border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Scripts Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Big display card */}
          <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))' }}>
            <div className="relative z-10 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Estimated Average Base Salary</span>
              <div className="text-5xl font-black gradient-text my-2">
                {currencySymbol}{formatVal(salaryVal)}
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">Annual Gross Salary Benchmark</span>
            </div>
            
            <div className="shrink-0 text-center bg-[var(--color-bg-primary)] px-5 py-4 rounded-xl border border-[var(--color-border-default)]">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">Target Range</span>
              <span className="text-sm font-bold text-[var(--color-text-primary)] mt-1 block">
                {currencySymbol}{formatVal(salaryVal * 0.9)} – {currencySymbol}{formatVal(salaryVal * 1.1)}
              </span>
            </div>
          </div>

          {/* Negotiation scripts widget */}
          <div className="card p-6">
            <div className="flex border-b border-[var(--color-border-default)] mb-4 pb-2 justify-between items-center flex-wrap gap-2">
              <h4 className="text-sm font-bold text-[var(--color-text-primary)]">Negotiation Scripts</h4>
              
              <div className="flex gap-1">
                {[
                  { id: 'counter', label: 'Counter Offer' },
                  { id: 'raise', label: 'Ask for Raise' },
                  { id: 'benefits', label: 'Benefits & Perks' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setNegotiationTab(tab.id as any)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      negotiationTab === tab.id
                        ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-bold text-[var(--color-text-accent)] block mb-1">Scenario</span>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{activeScript.scenario}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-[var(--color-text-accent)] block mb-1">Talking Points Checklist</span>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {activeScript.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[var(--color-text-accent)]">Response Script Template</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeScript.template);
                      alert('Script template copied!');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Copy Template
                  </button>
                </div>
                
                <textarea
                  readOnly
                  value={activeScript.template}
                  rows={6}
                  className="w-full p-4 rounded-xl font-mono text-xs leading-relaxed bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
