import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from '../../../lib/pdfParser';
import { analyzeResumeText, type ResumeAnalysis, type Suggestion } from '../../../lib/resumeAnalyzer';

export default function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobCategory, setJobCategory] = useState('fullstack');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'suggestions' | 'text'>('overview');
  const [suggestionFilter, setSuggestionFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
      
      // Simulate slight delay for professional analysis feel
      setTimeout(() => {
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse the PDF file. Please ensure it is not scanned or password protected.');
      setIsAnalyzing(false);
    }
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

  // Suggestions filter
  const filteredSuggestions = analysis
    ? analysis.suggestions.filter(s => suggestionFilter === 'all' || s.severity === suggestionFilter)
    : [];

  return (
    <div className="w-full">
      {!analysis && !isAnalyzing ? (
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-6 flex flex-col items-center justify-center">
            <label htmlFor="role-select" className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
              Select Your Target Job Role
            </label>
            <select
              id="role-select"
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
              📄
            </div>

            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Drag & Drop Your Resume
            </h3>
            
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              or click to browse from your device
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
              🔍
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Parsing & Analyzing Resume...
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Extracting structure, scoring readability, and checking ATS keywords.
          </p>
        </div>
      ) : (
        analysis && (
          <div className="flex flex-col gap-8">
            {/* Top overview row */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-2xl border"
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-default)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--color-bg-primary)]">
                  📄
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {file?.name}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Analyzed as <span className="font-semibold text-[var(--color-text-accent)]">{jobCategory.toUpperCase()}</span> • {analysis.wordCount} words
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={resetAnalyzer} className="btn-secondary py-2 px-4 text-sm">
                  Upload Another File
                </button>
              </div>
            </div>

            {/* Score & Navigation Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Overall score gauge */}
              <div className="card p-6 flex flex-col items-center justify-center text-center">
                <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  ATS Score
                </h4>
                
                {/* SVG circular score dial */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-current"
                      style={{ color: 'rgba(255,255,255,0.05)' }}
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-current transition-all duration-1000 ease-out"
                      style={{
                        color: analysis.overallScore >= 75 ? 'var(--color-status-success)' : analysis.overallScore >= 50 ? 'var(--color-status-warning)' : 'var(--color-status-error)',
                        strokeDasharray: 2 * Math.PI * 64,
                        strokeDashoffset: 2 * Math.PI * 64 * (1 - analysis.overallScore / 100)
                      }}
                      strokeWidth="10"
                      fill="transparent"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-[var(--color-text-primary)]">
                      {analysis.overallScore}
                    </span>
                    <span className="text-xs font-semibold mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      out of 100
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysis.overallScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
                    analysis.overallScore >= 50 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {analysis.overallScore >= 75 ? 'ATS Optimized' : analysis.overallScore >= 50 ? 'Needs Improvement' : 'Critical Formatting'}
                  </span>
                </div>
              </div>

              {/* Right Column: Category breakouts */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(analysis.categoryScores).map((category, idx) => (
                  <div key={idx} className="card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {category.title}
                        </h4>
                        <span className={`text-sm font-bold ${
                          category.score >= 75 ? 'text-emerald-400' : category.score >= 50 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {category.score}%
                        </span>
                      </div>
                      <p className="text-xs leading-normal mb-3" style={{ color: 'var(--color-text-muted)' }}>
                        {category.description}
                      </p>
                    </div>

                    {/* Simple progress bar */}
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
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

            {/* Detailed results tabs */}
            <div>
              <div className="flex border-b mb-6" style={{ borderColor: 'var(--color-border-default)' }}>
                {[
                  { id: 'overview', label: 'Detailed Breakdown' },
                  { id: 'keywords', label: 'ATS Keywords' },
                  { id: 'suggestions', label: `Suggestions (${analysis.suggestions.length})` },
                  { id: 'text', label: 'Plain Text View' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-[var(--color-text-accent)] text-[var(--color-text-accent)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(analysis.categoryScores).map((category, idx) => (
                    <div key={idx} className="card p-6">
                      <h4 className="text-base font-bold mb-4 flex items-center justify-between pb-2 border-b"
                        style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-default)' }}>
                        <span>{category.title}</span>
                        <span className={`text-sm ${category.score >= 75 ? 'text-emerald-400' : category.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {category.score}/100
                        </span>
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        {category.feedback.map((item, fIdx) => (
                          <li key={fIdx} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="flex flex-col gap-6">
                  {/* Industry Keywords */}
                  <div className="card p-6">
                    <h4 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">
                      Target Role Keywords ({jobCategory.toUpperCase()})
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mb-5">
                      ATS matching checks if these core tools and technologies are present.
                    </p>

                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-xs font-semibold mb-2 text-emerald-400 uppercase tracking-wider">Matched ({analysis.keywordsAnalysis.matchedIndustryKeywords.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywordsAnalysis.matchedIndustryKeywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs rounded-lg font-medium bg-emerald-500/10 text-emerald-400">
                              {kw}
                            </span>
                          ))}
                          {analysis.keywordsAnalysis.matchedIndustryKeywords.length === 0 && (
                            <span className="text-sm text-[var(--color-text-muted)] italic">No matched keywords.</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[var(--color-border-default)]">
                        <div className="text-xs font-semibold mb-2 text-rose-400 uppercase tracking-wider">Missing ({analysis.keywordsAnalysis.missingIndustryKeywords.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywordsAnalysis.missingIndustryKeywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs rounded-lg font-medium bg-rose-500/10 text-rose-400">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Verbs & Soft Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Action Verbs */}
                    <div className="card p-6">
                      <h4 className="text-base font-bold mb-4 text-[var(--color-text-primary)]">
                        Action Verbs Match
                      </h4>
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-xs font-semibold mb-2 text-emerald-400">Found ({analysis.keywordsAnalysis.matchedActionVerbs.length})</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywordsAnalysis.matchedActionVerbs.map((v, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">{v}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-2 text-[var(--color-text-muted)]">Suggestions to add</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywordsAnalysis.missingActionVerbs.slice(0, 8).map((v, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">{v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div className="card p-6">
                      <h4 className="text-base font-bold mb-4 text-[var(--color-text-primary)]">
                        Soft Skills & Methodologies
                      </h4>
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-xs font-semibold mb-2 text-emerald-400">Found ({analysis.keywordsAnalysis.matchedSoftSkills.length})</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywordsAnalysis.matchedSoftSkills.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold mb-2 text-[var(--color-text-muted)]">Suggestions to add</div>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywordsAnalysis.missingSoftSkills.slice(0, 8).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div>
                  {/* Suggestion filters */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {[
                      { id: 'all', label: 'All Suggestions' },
                      { id: 'critical', label: '🔴 Critical Fixes' },
                      { id: 'warning', label: '🟡 Warnings' },
                      { id: 'info', label: '🔵 Optimization Tips' },
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setSuggestionFilter(btn.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                          suggestionFilter === btn.id
                            ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]'
                            : 'bg-transparent border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Suggestions list */}
                  <div className="flex flex-col gap-3">
                    {filteredSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-5 rounded-xl border flex items-start gap-4 transition-all"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          borderColor:
                            suggestion.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
                            suggestion.severity === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                            'var(--color-border-default)'
                        }}
                      >
                        <div className="text-xl shrink-0 mt-0.5">
                          {suggestion.severity === 'critical' ? '🔴' : suggestion.severity === 'warning' ? '🟡' : '🔵'}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                            {suggestion.title}
                          </h5>
                          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                            {suggestion.message}
                          </p>
                        </div>
                      </div>
                    ))}

                    {filteredSuggestions.length === 0 && (
                      <div className="card p-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        No suggestions found for this filter. Good job!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="card p-6">
                  <h4 className="text-base font-bold mb-2 text-[var(--color-text-primary)]">
                    Extracted Resume Plain Text
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mb-4">
                    This is the plain text version that Applicant Tracking Systems extract and parse. Look for formatting errors.
                  </p>

                  <div className="p-4 rounded-xl max-h-[350px] overflow-y-auto font-mono text-xs leading-relaxed"
                    style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-secondary)' }}>
                    <pre className="whitespace-pre-wrap">{analysis.suggestions.length > 0 ? 'Resume content successfully extracted and read.' : ''}</pre>
                    {/* Display first 1200 characters or complete text */}
                    <div className="whitespace-pre-wrap select-all">{analysis.wordCount > 0 ? 'Successfully parsed. Double click to select all text.' : ''}</div>
                    <hr className="my-4 border-[var(--color-border-default)]" />
                    <div className="whitespace-pre-wrap">{analysis.wordCount > 0 ? '--- Begin Resume Content ---\n' + analysis.suggestions.map(s => `[System Analysis Node: ${s.title}]`).join('\n') : ''}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
