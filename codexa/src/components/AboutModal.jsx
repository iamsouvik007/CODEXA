import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Target } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      setTimeout(() => closeRef.current?.focus(), 100);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocus.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bg/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-modal">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                    <Heart className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                  </div>
                  <h2 id="about-title" className="font-heading text-base font-semibold text-text">
                    About Codexa
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-8">
                {/* Mission */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Target className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-text">
                      Our Mission
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      Transform passive learning into active learning. We believe developers learn best
                      by doing — not by watching. Codexa exists because reading documentation and
                      watching tutorials isn&apos;t enough.
                    </p>
                  </div>
                </div>

                {/* Why */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/10">
                    <Sparkles className="h-5 w-5 text-info" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-text">
                      Why Codexa Exists
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      Every programming concept deserves to be experienced, not just explained. We built Codexa
                      to bridge the gap between understanding syntax and truly grasping how code works — through
                      interactive visualizations, real-time coding, and AI-powered mentorship.
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="rounded-lg border border-accent/20 bg-accent-bg p-4">
                  <p className="text-sm font-medium leading-relaxed text-text italic">
                    &ldquo;We&apos;re building the future of technical education — one interactive
                    lesson at a time.&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-text-muted">— The Codexa Team</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-border"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
