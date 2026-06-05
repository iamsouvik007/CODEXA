import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAITutor } from '../lib/AITutorContext';

const navLinks = [
  { label: 'Home', href: '#main-content' },
  { label: 'Learn', href: '#learn' },
  { label: 'Playground', href: '#playground', modal: 'playground' },
  { label: 'AI Tutor', href: '#ai-tutor', action: 'ai-tutor' },
  { label: 'Premium', href: '#premium' },
  { label: 'About', href: '#about', modal: 'about' },
];

export default function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const aiTutor = useAITutor();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, link) => {
    if (link.modal) {
      e.preventDefault();
      onOpenModal?.(link.modal);
      setMobileOpen(false);
    } else if (link.action === 'ai-tutor') {
      e.preventDefault();
      aiTutor.open();
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-none">
        Skip to main content
      </a>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border bg-bg/80 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-text" aria-label="Codexa home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight">Codexa</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="nav-link-item relative rounded-lg px-3.5 py-2 text-sm text-text-secondary transition-colors hover:text-text"
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute bottom-1 left-3.5 right-3.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-200 ease-out hover:scale-x-0 group-hover:scale-x-100" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#demo"
              className="rounded-pill border border-border px-5 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-strong hover:text-text"
            >
              Explore Curriculum
            </a>
            <a
              href="#learn"
              className="rounded-pill bg-accent px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-deep"
            >
              Start Learning
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-card hover:text-text lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-6" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-heading text-2xl font-medium text-text-secondary transition-colors hover:text-text"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#learn"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 rounded-pill bg-accent px-8 py-3 text-base font-medium text-white"
              >
                Start Learning
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
