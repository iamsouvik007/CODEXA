import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing runtime...');

  useEffect(() => {
    // Has the loader already played this session? (Optional: prevent re-playing on soft reloads)
    // For now we play it once per hard refresh.
    const hasLoaded = sessionStorage.getItem('codexa_initial_loaded');
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    const sequence = [
      { p: 15, text: 'Resolving dependencies...', delay: 200 },
      { p: 40, text: 'Compiling interactive nodes...', delay: 600 },
      { p: 75, text: 'Booting AI mentor...', delay: 1100 },
      { p: 95, text: 'Starting execution context...', delay: 1600 },
      { p: 100, text: 'Ready.', delay: 2100 },
    ];

    const timers = [];

    sequence.forEach(({ p, text, delay }) => {
      timers.push(setTimeout(() => {
        setProgress(p);
        setLoadingText(text);
      }, delay));
    });

    const finalTimeout = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('codexa_initial_loaded', 'true');
    }, 2800);
    timers.push(finalTimeout);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
        >
          {/* Subtle grid background */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg opacity-80" />

          {/* Loader content */}
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center px-6 text-center">
            {/* Logo/Icon Pulse */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 shadow-[0_0_40px_rgba(249,115,22,0.2)]"
            >
              <img src="/favicon-32x32.png" alt="Codexa Logo" className="h-10 w-10" />
            </motion.div>

            {/* Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-heading text-3xl font-bold tracking-tight text-text"
            >
              CODEXA
            </motion.h1>

            {/* Terminal output */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex w-full flex-col gap-2"
            >
              <div className="flex w-full h-1.5 overflow-hidden rounded-full bg-bg-card border border-border">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <div className="flex w-full items-center justify-between text-xs font-mono text-text-muted mt-2">
                <span className="animate-pulse">{loadingText}</span>
                <span>{progress}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
