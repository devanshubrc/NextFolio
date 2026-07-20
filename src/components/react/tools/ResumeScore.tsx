import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from '../../../lib/pdfParser';
import { analyzeResumeText, type ResumeAnalysis } from '../../../lib/resumeAnalyzer';

export default function ResumeScore() {
  const [file, setFile] = useState<File | null>(null);
  const [jobCategory, setJobCategory] = useState('fullstack');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeBreakdown, setActiveBreakdown] = useState<string>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const parsed = await extractTextFromPDF(selectedFile);
      const result = analyzeResumeText(parsed.text, jobCategory);
      
      // Simulate slight delay
      setTimeout(() => {
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse the PDF file. Please ensure it is not password protected.');
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetAnalyzer = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  // Convert score to letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', desc: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score >= 80) return { grade: 'B', desc: 'Very Good', color: 'text-teal-400', bg: 'bg-teal-500/10' };
    if (score >= 70) return { grade: 'C', desc: 'Good', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    if (score >= 60) return { grade: 'D', desc: 'Fair', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { grade: 'F', desc: 'Poor', color: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  // Interactive rewrite examples
  const rewriteExamples = [
    {
      before: 'Responsible for maintaining the database and fixing bugs.',
      after: 'Optimized PostgreSQL database query execution time by 42% and resolved 35+ critical runtime bugs.',
      type: 'Technical Experience'
    },
    {
      before: 'Helped with marketing campaigns and social media accounts.',
      after: 'Managed 3 key social media campaigns, driving a 24% increase in organic user acquisition.',
      type: 'Marketing Role'
    },
    {
      before: 'Wrote frontend code using React.',
      after: 'Spearheaded migration of legacy dashboards to React, improving Core Web Vitals by 18%.',
      type: 'Frontend Engineer'
    }
  ];

  return (
    <div className="w-full">
      {!analysis && !isAnalyzing ? (
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-6 flex flex-col items-center justify-center">
            <label htmlFor="role-select-score" className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
              Select Target Career Track
            </label>
            <select
              id="role-select-score"
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border font-medium cursor-pointer transition-colors max-w-xs w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]"
            >
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="devops">DevOps / Cloud Engineer</option>
              <option value="datascience">Data Scientist / AI Engineer</option>
              <option value="pm">Product Manager</option>
              <option value="uiux">UI/UX Designer</option>
            </select>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className="border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center hover:border-[var(--color-text-accent)] group bg-[rgba(255,255,255,0.01)]"
            style={{ borderColor: 'var(--color-border-default)' }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
              aria-label="Upload resume PDF file"
            />
            
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
              style={{ background: 'var(--color-bg-secondary)' }}>
              📊
            </div>

            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Upload Resume for Quality Check
            </h3>
            
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Drag & drop your PDF file or click to browse
            </p>

            <span className="badge text-xs">Supports PDF up to 5MB</span>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl text-sm font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400">
              {error}
            </div>
          )}
        </div>
      ) : isAnalyzing ? (
        <div className="max-w-md mx-auto py-12 text-center flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-text-accent)] animate-spin"
              style={{ borderColor: 'rgba(255,255,255,0.05)', borderTopColor: 'var(--color-text-accent)' }}></div>
            <div className="absolute inset-2 rounded-full flex items-center justify-center text-2xl bg-[var(--color-bg-secondary)]">
              ⚙️
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Evaluating Resume Quality...
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Analyzing sections, impact metrics, action verbs, and formatting checks.
          </p>
        </div>
      ) : (
        analysis && (
          <div className="flex flex-col gap-8">
            {/* Header / Upload bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-2xl border"
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-default)' }}>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Resume Quality Scorecard
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {file?.name} • Evaluated for {jobCategory.toUpperCase()}
                </p>
              </div>

              <button onClick={resetAnalyzer} className="btn-secondary py-2 px-4 text-sm">
                Upload New Resume
              </button>
            </div>

            {/* Scoreboard block */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Overall Grade Card */}
              <div className="card p-6 flex flex-col items-center justify-center text-center">
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Overall Grade
                </h4>
                
                {(() => {
                  const info = getLetterGrade(analysis.overallScore);
                  return (
                    <>
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black mb-3 ${info.bg} ${info.color}`}>
                        {info.grade}
                      </div>
                      <div className="text-lg font-bold text-[var(--color-text-primary)]">
                        {info.desc}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        Quality Score: {analysis.overallScore}/100
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Breakdown metrics */}
              <div className="lg:col-span-3 card p-6">
                <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-[var(--color-text-muted)]">
                  Quality Matrix Breakdown
                </h4>
                <div className="flex flex-col gap-5">
                  {Object.entries(analysis.categoryScores).map(([key, category]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--color-border-default)] last:border-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[var(--color-text-primary)]">{category.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            category.score >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
                            category.score >= 50 ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {category.score}%
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 text-[var(--color-text-muted)] truncate">{category.description}</p>
                      </div>
                      <div className="w-full sm:w-36 h-2 rounded-full mt-1 sm:mt-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${category.score}%`,
                            backgroundColor: category.score >= 75 ? 'var(--color-status-success)' : category.score >= 50 ? 'var(--color-status-warning)' : 'var(--color-status-error)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist and Action suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Quality Checks Checklist */}
              <div className="card p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold mb-4 text-[var(--color-text-primary)]">
                    Quality Checklist
                  </h4>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      { check: analysis.wordCount >= 300 && analysis.wordCount <= 1000, label: 'Ideal resume length (300-1000 words)' },
                      { check: analysis.keywordsAnalysis.foundSections.includes('experience'), label: 'Experience section present' },
                      { check: analysis.keywordsAnalysis.foundSections.includes('skills'), label: 'Technical skills section present' },
                      { check: analysis.keywordsAnalysis.foundSections.includes('education'), label: 'Education section present' },
                      { check: analysis.keywordsAnalysis.matchedActionVerbs.length >= 3, label: 'Adequate action verb usage' },
                      { check: analysis.metricsMatched >= 3, label: 'Quantified impact and metrics' },
                      { check: analysis.wordCount > 0, label: 'Contact details (email, phone) present' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <span className="shrink-0">{item.check ? '✅' : '❌'}</span>
                        <span style={{ color: item.check ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t mt-6 border-[var(--color-border-default)]">
                  <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Checklist items correspond directly to critical guidelines recommended by global corporate hiring managers.
                  </div>
                </div>
              </div>

              {/* Right Column: Improvement suggestions list */}
              <div className="lg:col-span-2 card p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: 'var(--color-border-default)' }}>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                    Priority Recommendations
                  </h4>
                  <div className="flex gap-2">
                    {['all', 'critical', 'warning'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveBreakdown(tab)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer capitalize ${
                          activeBreakdown === tab
                            ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {analysis.suggestions
                    .filter(s => activeBreakdown === 'all' || s.severity === activeBreakdown)
                    .map((item) => (
                      <div key={item.id} className="p-3 rounded-lg border text-xs"
                        style={{
                          background: 'var(--color-bg-primary)',
                          borderColor: item.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'var(--color-border-default)'
                        }}>
                        <div className="font-bold flex items-center justify-between text-[var(--color-text-primary)]">
                          <span>{item.title}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            item.severity === 'critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>{item.severity}</span>
                        </div>
                        <p className="mt-1 text-[var(--color-text-secondary)] leading-relaxed">{item.message}</p>
                      </div>
                    ))}

                  {analysis.suggestions.filter(s => activeBreakdown === 'all' || s.severity === activeBreakdown).length === 0 && (
                    <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">
                      No matching recommendations for this selection.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Before / After Rewrite Widget */}
            <div className="card p-6">
              <h4 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">
                Quantify Impact: Interactive Rewrite Examples
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mb-6">
                Understand how to transform boring task descriptions into high-impact, outcome-oriented statements.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewriteExamples.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl border flex flex-col justify-between"
                    style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-default)' }}>
                    <div>
                      <div className="text-xs font-bold text-[var(--color-text-accent)] mb-3">{item.type}</div>
                      
                      <div className="mb-4">
                        <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">Before (Weak)</div>
                        <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">"{item.before}"</p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1">After (Strong)</div>
                        <p className="text-xs text-[var(--color-text-primary)] font-medium leading-relaxed">"{item.after}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )
      )}
    </div>
  );
}
