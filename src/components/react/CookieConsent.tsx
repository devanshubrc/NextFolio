import { useState, useEffect } from 'react';

/**
 * CookieConsent — GDPR compliant client-side cookie consent banner
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('nextfolios-consent');
      if (!consent) {
        // Show banner after a short delay for better UX
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      } else if (consent === 'accepted') {
        // Trigger analytics loading
        document.dispatchEvent(new CustomEvent('analytics-consent-granted'));
      }
    } catch (e) {
      console.error('Failed to read cookie consent', e);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('nextfolios-consent', 'accepted');
      setShowBanner(false);
      // Notify page to load analytics script
      document.dispatchEvent(new CustomEvent('analytics-consent-granted'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('nextfolios-consent', 'declined');
      setShowBanner(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[200] p-5 rounded-2xl shadow-elevated border"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border-default)',
        animation: 'var(--animate-slide-up)',
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5" aria-hidden="true">🍪</span>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Cookie Consent
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              We use analytics cookies to understand how you interact with our free career tools and to improve your experience. Your data is anonymized.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 text-xs">
          <button
            onClick={handleDecline}
            className="px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer hover:bg-[var(--color-bg-tertiary)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-mid))',
              color: '#ffffff',
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
