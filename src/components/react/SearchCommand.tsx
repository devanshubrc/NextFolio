import { useState, useEffect, useCallback, useRef } from 'react';
import { searchItems, fuzzyMatch } from '../../lib/searchIndex';

/**
 * SearchCommand — Global search modal (Cmd+K / Ctrl+K)
 * Searches across tools, blog posts, and FAQs
 */

export default function SearchCommand() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? searchItems.filter(item => 
        fuzzyMatch(query, item.title) || fuzzyMatch(query, item.description)
      )
    : searchItems;

  const groupedResults = {
    tools: results.filter(r => r.type === 'tool'),
    pages: results.filter(r => r.type === 'page'),
    faqs: results.filter(r => r.type === 'faq'),
  };

  const flatResults = [...groupedResults.tools, ...groupedResults.pages, ...groupedResults.faqs];

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  // Listen for custom event from header
  useEffect(() => {
    const handler = () => open();
    document.addEventListener('open-search', handler);
    return () => document.removeEventListener('open-search', handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        e.preventDefault();
        const selected = flatResults[selectedIndex];
        if (selected) {
          window.location.href = selected.href;
          close();
        }
        break;
      }
      case 'Escape':
        close();
        break;
    }
  }, [flatResults, selectedIndex, close]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Search NextFolios"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ 
          background: 'var(--color-bg-elevated)', 
          border: '1px solid var(--color-border-default)',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'var(--animate-scale-in)',
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--color-border-default)' }}>
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, pages, and more..."
            className="flex-1 bg-transparent border-none outline-none text-base"
            style={{ color: 'var(--color-text-primary)' }}
            aria-label="Search"
            autoComplete="off"
          />
          <kbd 
            className="px-2 py-1 text-xs font-mono rounded"
            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2" role="listbox">
          {flatResults.length === 0 ? (
            <div className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <p className="text-lg mb-1">No results found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <>
              {groupedResults.tools.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Tools
                  </div>
                  {groupedResults.tools.map((item) => {
                    const idx = flatIndex++;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        data-index={idx}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-100"
                        style={{
                          background: idx === selectedIndex ? 'var(--color-bg-tertiary)' : 'transparent',
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        role="option"
                        aria-selected={idx === selectedIndex}
                      >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.title}</div>
                          <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{item.description}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              {groupedResults.pages.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Pages
                  </div>
                  {groupedResults.pages.map((item) => {
                    const idx = flatIndex++;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        data-index={idx}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-100"
                        style={{
                          background: idx === selectedIndex ? 'var(--color-bg-tertiary)' : 'transparent',
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        role="option"
                        aria-selected={idx === selectedIndex}
                      >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.title}</div>
                          <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{item.description}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ borderTop: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--color-bg-tertiary)' }}>↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--color-bg-tertiary)' }}>↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--color-bg-tertiary)' }}>Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
