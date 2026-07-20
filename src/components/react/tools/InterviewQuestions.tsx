import React, { useState, useEffect } from 'react';
import questionsList from '../../../data/interviewQuestions.json';

interface Question {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  hints: string[];
  answer: string;
}

export default function InterviewQuestions() {
  const [questions, setQuestions] = useState<Question[]>(questionsList);
  const [selectedId, setSelectedId] = useState<string>(questionsList[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceNotes, setPracticeNotes] = useState<Record<string, string>>({});

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesCat && matchesDiff;
  });

  const selectedQuestion = questions.find(q => q.id === selectedId) || filteredQuestions[0] || null;

  // Load notes on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('nextfolios-interview-notes');
      if (savedNotes) {
        setPracticeNotes(JSON.parse(savedNotes));
      }
    } catch (e) {}
  }, []);

  // Save notes
  const handleNoteChange = (qId: string, val: string) => {
    const nextNotes = { ...practiceNotes, [qId]: val };
    setPracticeNotes(nextNotes);
    try {
      localStorage.setItem('nextfolios-interview-notes', JSON.stringify(nextNotes));
    } catch (e) {}
  };

  // Reset show answer when question selection changes
  useEffect(() => {
    setShowAnswer(false);
  }, [selectedId]);

  return (
    <div className="w-full">
      
      {/* Filtering Header */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border mb-6 bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] justify-between items-center">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Filter */}
          <div>
            <label htmlFor="filter-cat" className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-[var(--color-text-muted)]">Category</label>
            <select
              id="filter-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="behavioral">Behavioral (STAR)</option>
              <option value="technical">Technical Questions</option>
              <option value="design">System Design</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="filter-diff" className="text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-[var(--color-text-muted)]">Difficulty</label>
            <select
              id="filter-diff"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer bg-[var(--color-bg-primary)] border-[var(--color-border-default)] text-[var(--color-text-primary)] focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-[var(--color-text-muted)] font-medium">
          Showing {filteredQuestions.length} practice question{filteredQuestions.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Questions List */}
        <div className="card p-4 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedId(q.id)}
              className={`text-left p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer ${
                selectedId === q.id
                  ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-text-accent)]'
                  : 'bg-transparent border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  q.category === 'behavioral' ? 'bg-indigo-500/10 text-indigo-400' :
                  q.category === 'technical' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{q.category}</span>
                
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  q.difficulty === 'easy' ? 'bg-slate-500/10 text-slate-400' :
                  q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>{q.difficulty}</span>
              </div>
              <p className="text-xs font-bold leading-normal truncate text-[var(--color-text-primary)]">
                {q.question}
              </p>
            </button>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-10 text-sm text-[var(--color-text-muted)]">
              No questions match these filters.
            </div>
          )}
        </div>

        {/* Right Column: Question Details & Practice Notepad */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedQuestion ? (
            <div className="card p-6 flex flex-col gap-5">
              
              {/* Question text block */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge text-[10px] uppercase font-bold">{selectedQuestion.category}</span>
                  <span className="badge text-[10px] uppercase font-bold">{selectedQuestion.difficulty}</span>
                </div>
                <h3 className="text-xl font-extrabold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                  {selectedQuestion.question}
                </h3>
              </div>

              {/* Answering Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-accent)] mb-2">
                  Answering Checklist & Hints
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedQuestion.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>

              {/* notepad practice area */}
              <div className="pt-2">
                <label htmlFor="practice-notepad" className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-accent)] block mb-1.5">
                  Your Draft Response (Autosaved)
                </label>
                <textarea
                  id="practice-notepad"
                  rows={5}
                  value={practiceNotes[selectedQuestion.id] || ''}
                  onChange={(e) => handleNoteChange(selectedQuestion.id, e.target.value)}
                  placeholder="Type your outline notes or draft response here using the STAR framework to practice answering..."
                  className="w-full p-4 rounded-xl font-mono text-xs leading-relaxed bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] focus:outline-none resize-y"
                />
              </div>

              {/* Sample Outline Answer */}
              <div className="border-t pt-4" style={{ borderColor: 'var(--color-border-default)' }}>
                <button
                  onClick={() => setShowAnswer(s => !s)}
                  className="btn-secondary py-1.5 px-3.5 text-xs font-semibold"
                >
                  {showAnswer ? 'Hide Sample Outline' : 'Show Sample Outline'}
                </button>

                {showAnswer && (
                  <div className="mt-4 p-4 rounded-xl text-xs leading-relaxed border bg-[rgba(99,102,241,0.02)] border-[var(--color-border-default)]"
                    style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="font-bold text-[var(--color-text-primary)] mb-2">Recommended Response Outline:</div>
                    <p className="whitespace-pre-wrap">{selectedQuestion.answer}</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="card p-12 text-center text-sm text-[var(--color-text-muted)]">
              Please select a question from the list to begin practicing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
