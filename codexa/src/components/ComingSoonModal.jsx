import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Construction } from 'lucide-react';

export default function ComingSoonModal({ isOpen, modalType, onClose }) {
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  let content = {
    title: "Coming Soon",
    description: "This feature is currently under development."
  };

  if (modalType === 'playground') {
    content.description = "Interactive playground is currently under development. The actual playground exists inside lessons.";
  } else if (modalType === 'interview') {
    content.description = "This interview feature is currently under development and will be released soon.";
  } else if (modalType === 'premium') {
    content.description = "This partner program is currently being integrated and will be available soon.";
  }

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      // Delay to allow animation
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
            className="fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-modal">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                    <Construction className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                  </div>
                  <h2 id="coming-soon-title" className="font-heading text-base font-semibold text-text">
                    Coming Soon
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
              <div className="px-6 py-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                  <Construction className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-semibold tracking-tight text-text">
                  {content.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {content.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-pill bg-accent-bg px-4 py-2 text-xs font-medium text-accent">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  Under Development
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-border"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
