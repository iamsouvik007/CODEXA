import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronDown, Video, FileText, MessageSquare, Zap, Star } from 'lucide-react';
import { useAITutor } from '../lib/AITutorContext';

export default function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
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
    } else if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(link.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  };

  const handleMouseEnter = (dropdownName) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const navLinks = [
    { label: 'Home', href: '#main-content' },
    { label: 'Learn', href: '#learn' },
    { label: 'Playground', href: '#playground', modal: 'playground' },
    { label: 'AI Tutor', href: '#ai-tutor', action: 'ai-tutor' },
    { label: 'About', href: '#about', modal: 'about' },
  ];

  const interviewItems = [
    { title: 'Live Mock Interview', icon: Video, desc: 'Practice with an AI interviewer', modal: 'interview' },
    { title: 'Resume Templates', icon: FileText, desc: 'Developer-focused templates', modal: 'interview' },
    { title: 'Most Asked Questions', icon: MessageSquare, desc: 'Curated by top engineers', modal: 'interview' },
  ];

  const premiumItems = [
    { title: 'Strike', icon: Zap, desc: 'Project-based learning program', href: 'https://strikes.in/', featured: true },
    { title: 'Advanced Patterns', icon: Star, desc: 'Architecture & performance', modal: 'premium' },
    { title: 'System Design Lab', icon: Star, desc: 'Interactive architecture diagrams', modal: 'premium' },
  ];

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
          <a href="#main-content" onClick={(e) => handleNavClick(e, {href: '#main-content'})} className="flex items-center gap-2.5 text-text" aria-label="Codexa home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight">Codexa</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(0, 4).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="group relative rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}

            {/* Interview Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('interview')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="group relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text">
                Interview
                <ChevronDown className="h-3 w-3 text-text-muted transition-transform group-hover:text-text" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'interview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-bg-card shadow-elevated"
                  >
                    <div className="p-2">
                      {interviewItems.map((item, i) => (
                        <button
                          key={i}
                          onClick={(e) => handleNavClick(e, { modal: item.modal })}
                          className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-bg-elevated"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10">
                            <item.icon className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text">{item.title}</span>
                              <span className="rounded-full bg-bg-input px-2 py-0.5 text-[9px] font-medium text-text-muted uppercase tracking-wider">Soon</span>
                            </div>
                            <span className="text-xs text-text-secondary">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('premium')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="group relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text">
                Premium
                <ChevronDown className="h-3 w-3 text-text-muted transition-transform group-hover:text-text" />
              </button>
              <AnimatePresence>
                {activeDropdown === 'premium' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-bg-card shadow-elevated"
                  >
                    <div className="border-b border-border bg-bg-soft px-4 py-3">
                      <h4 className="text-sm font-medium text-text">Trusted Course Providers</h4>
                      <p className="mt-0.5 text-xs text-text-muted">Hand-picked programs recommended by Codexa.</p>
                    </div>
                    <div className="p-2">
                      {premiumItems.map((item, i) => (
                        <a
                          key={i}
                          href={item.href || '#'}
                          onClick={(e) => item.href ? null : handleNavClick(e, { modal: item.modal })}
                          target={item.href ? "_blank" : undefined}
                          rel={item.href ? "noopener noreferrer" : undefined}
                          className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-bg-elevated"
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.featured ? 'bg-[#ff5f57]/10' : 'bg-accent/10'}`}>
                            <item.icon className={`h-4 w-4 ${item.featured ? 'text-[#ff5f57]' : 'text-accent'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text">{item.title}</span>
                              {item.featured && (
                                <span className="rounded-full bg-[#ff5f57]/10 px-2 py-0.5 text-[9px] font-medium text-[#ff5f57] uppercase tracking-wider">Featured</span>
                              )}
                              {!item.featured && (
                                <span className="rounded-full bg-bg-input px-2 py-0.5 text-[9px] font-medium text-text-muted uppercase tracking-wider">Soon</span>
                              )}
                            </div>
                            <span className="text-xs text-text-secondary">{item.desc}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#about"
              onClick={(e) => handleNavClick(e, navLinks.find(l => l.label === 'About'))}
              className="group relative rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text"
            >
              About
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#roadmap"
              onClick={(e) => handleNavClick(e, {href: '#roadmap'})}
              className="rounded-pill border border-border px-5 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-strong hover:text-text"
            >
              Explore Curriculum
            </a>
            <a
              href="#learn"
              onClick={(e) => handleNavClick(e, {href: '#learn'})}
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
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl lg:hidden pt-20 px-6 pb-6 overflow-y-auto"
          >
            <nav className="flex flex-col gap-8" aria-label="Mobile navigation">
              <div className="flex flex-col gap-4">
                {navLinks.slice(0, 4).map((link, i) => (
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
              </div>

              {/* Mobile Mobile Dropdowns (just listed out) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div className="text-sm font-semibold text-text uppercase tracking-wider">Interview</div>
                {interviewItems.map((item, i) => (
                   <button
                   key={i}
                   onClick={(e) => handleNavClick(e, { modal: item.modal })}
                   className="flex items-center gap-3 text-left transition-colors hover:text-text text-text-secondary"
                 >
                   <item.icon className="h-4 w-4 text-accent" />
                   <span className="font-medium">{item.title}</span>
                 </button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="text-sm font-semibold text-text uppercase tracking-wider">Premium</div>
                {premiumItems.map((item, i) => (
                   <a
                   key={i}
                   href={item.href || '#'}
                   onClick={(e) => item.href ? null : handleNavClick(e, { modal: item.modal })}
                   target={item.href ? "_blank" : undefined}
                   rel={item.href ? "noopener noreferrer" : undefined}
                   className="flex items-center gap-3 text-left transition-colors hover:text-text text-text-secondary"
                 >
                   <item.icon className={`h-4 w-4 ${item.featured ? 'text-[#ff5f57]' : 'text-accent'}`} />
                   <span className="font-medium">{item.title}</span>
                 </a>
                ))}
              </motion.div>

              <motion.a
                href="#learn"
                onClick={(e) => handleNavClick(e, {href: '#learn'})}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex items-center justify-center rounded-pill bg-accent px-8 py-4 text-lg font-medium text-white shadow-card"
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
