import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen, Lightbulb, Eye, Gamepad2, HelpCircle, Brain, Bot, Trophy,
  BookX, Sparkles, Check, ChevronRight, FolderGit2
} from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { fadeUp, staggerContainer } from '../lib/animations';

const steps = [
  {
    step: '01',
    icon: BookOpen,
    title: 'Concept',
    desc: 'Learn the core programming ideas with zero fluff.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'hover:border-accent/50',
    glow: 'shadow-accent/5'
  },
  {
    step: '02',
    icon: Lightbulb,
    title: 'Analogy',
    desc: 'Relate abstract concepts to real-world objects.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'hover:border-warning/50',
    glow: 'shadow-warning/5'
  },
  {
    step: '03',
    icon: Eye,
    title: 'Visualize',
    desc: 'Watch interactive data flow diagrams in real-time.',
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'hover:border-info/50',
    glow: 'shadow-info/5'
  },
  {
    step: '04',
    icon: Gamepad2,
    title: 'Interact',
    desc: 'Click and drag to run step-by-step visualizations.',
    color: 'text-[#a78bfa]',
    bg: 'bg-[#a78bfa]/10',
    border: 'hover:border-[#a78bfa]/50',
    glow: 'shadow-[#a78bfa]/5'
  },
  {
    step: '05',
    icon: HelpCircle,
    title: 'Practice',
    desc: 'Write code to solve conceptual programming puzzles.',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'hover:border-success/50',
    glow: 'shadow-success/5'
  },
  {
    step: '06',
    icon: Brain,
    title: 'Quiz',
    desc: 'Test your recall with spaced repetition questions.',
    color: 'text-[#f472b6]',
    bg: 'bg-[#f472b6]/10',
    border: 'hover:border-[#f472b6]/50',
    glow: 'shadow-[#f472b6]/5'
  },
  {
    step: '07',
    icon: Bot,
    title: 'AI Tutor',
    desc: 'Get context-aware explanations when you get stuck.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'hover:border-accent/50',
    glow: 'shadow-accent/5'
  },
  {
    step: '08',
    icon: Trophy,
    title: 'Mastery',
    desc: 'Demonstrate deep understanding to unlock credentials.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'hover:border-warning/50',
    glow: 'shadow-warning/5',
    project: 'Top Level Project'
  }
];

export default function LearningMethod() {
  const { ref, controls } = useScrollReveal(0.08);
  const shouldReduceMotion = useReducedMotion();

  // Auto-play index and hover state variables
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Active step in focus is either hovered card or currently auto-playing step
  const displayStep = hoveredStep !== null ? hoveredStep : activeStep;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 8);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Desktop horizontal trace coordinates: runs from 6.25% to 93.75%
  const totalSpan = 87.5;
  const startOffset = 6.25;
  const activeWidth = (displayStep / 7) * totalSpan;
  const dotLeft = startOffset + activeWidth;

  return (
    <section ref={ref} id="learn" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      {/* Soft atmospheric background glow */}
      <div className="absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.015] blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1400px] px-5 sm:px-8"
      >
        {/* Header Block */}
        <motion.div variants={fadeUp} className="mx-auto mb-16 max-w-3xl text-center">
          <SectionLabel>Our Learning Engine</SectionLabel>
          <SectionHeading>The Codexa Method.</SectionHeading>
          <SectionDescription className="mx-auto">
            Reading docs and watching videos isn&apos;t enough. We translate complex programming constructs into a living, visual roadmap.
          </SectionDescription>
        </motion.div>

        {/* 8-Stage Connected Pipeline Section */}
        <motion.div variants={fadeUp} className="relative z-10 w-full mb-24">
          
          {/* Desktop Horizontal Connecting Path */}
          <div className="absolute top-[68px] left-0 right-0 h-[2px] bg-border/40 hidden lg:block z-0">
            {/* Glowing active path segment */}
            <motion.div
              className="absolute h-full bg-gradient-to-r from-accent to-accent-soft shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              initial={{ width: '0%' }}
              animate={{ width: `${dotLeft}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            />
            {/* Desktop continuous moving glow dot */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute h-3.5 w-3.5 -top-[6px] rounded-full bg-white shadow-[0_0_12px_rgba(249,115,22,0.9)] border-2 border-accent"
                animate={{
                  left: `${dotLeft}%`
                }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
                style={{ x: '-50%' }}
              />
            )}
          </div>

          {/* Mobile Vertical Connecting Path */}
          <div className="absolute left-[36px] top-8 bottom-8 w-[2px] bg-border/30 lg:hidden z-0">
            {/* Active vertical highlight */}
            <motion.div
              className="absolute w-full bg-gradient-to-b from-accent to-accent-soft shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              initial={{ height: '0%' }}
              animate={{ height: `${(displayStep / 7) * 100}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            />
            {/* Mobile continuous moving glow dot */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute w-3.5 h-3.5 -left-[6px] rounded-full bg-white shadow-[0_0_12px_rgba(249,115,22,0.9)] border-2 border-accent"
                animate={{
                  top: `${(displayStep / 7) * 100}%`
                }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
                style={{ y: '-50%' }}
              />
            )}
          </div>

          {/* Pipeline Cards Grid */}
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-8 lg:gap-3.5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = displayStep === idx;
              const isCompleted = idx < displayStep;
              
              return (
                <motion.div
                  key={step.title}
                  onMouseEnter={() => {
                    setHoveredStep(idx);
                    setIsAutoPlaying(false);
                  }}
                  onMouseLeave={() => {
                    setHoveredStep(null);
                    setIsAutoPlaying(true);
                  }}
                  whileHover={shouldReduceMotion ? {} : {
                    scale: 1.03,
                    y: -4
                  }}
                  className={`relative flex flex-row lg:flex-col items-center lg:items-start p-4 lg:p-5 rounded-xl border bg-bg-card/45 backdrop-blur-sm transition-all duration-300 pointer-events-auto select-none min-h-[90px] lg:min-h-[190px] ${
                    isActive
                      ? 'border-accent shadow-[0_0_24px_rgba(249,115,22,0.18)] bg-accent/[0.02]'
                      : isCompleted
                      ? 'border-accent/25 bg-bg-card/30'
                      : 'border-border/60 bg-bg-card/10'
                  }`}
                >
                  {/* Step Header info */}
                  <div className="flex items-center justify-between w-full lg:mb-3.5 absolute lg:relative top-3 right-4 lg:top-0 lg:right-0">
                    <span className={`font-mono text-[10px] font-semibold tracking-wider ${isActive ? 'text-accent' : 'text-text-muted/65'}`}>
                      {step.step}
                    </span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border hidden lg:inline-block ${
                      isActive
                        ? 'bg-accent/10 text-accent border-accent/20 animate-pulse'
                        : isCompleted
                        ? 'bg-success/5 text-success/80 border-success/15'
                        : 'bg-bg-elevated/40 text-text-muted/50 border-transparent'
                    }`}>
                      {isActive ? 'Active' : isCompleted ? 'Done' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Icon Wrapper */}
                  <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg mr-4 lg:mr-0 lg:mb-3.5 transition-all duration-300 ${
                    isActive
                      ? `${step.bg} ${step.color} shadow-[0_0_12px_rgba(249,115,22,0.3)] scale-105`
                      : isCompleted
                      ? 'bg-success/5 text-success/70'
                      : 'bg-bg-elevated/30 text-text-muted'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                      </span>
                    )}
                  </div>

                  {/* Copy Details */}
                  <div className="flex-1 lg:w-full text-left">
                    <h4 className={`font-heading text-sm font-semibold tracking-tight mb-1 transition-colors ${isActive ? 'text-text' : 'text-text-secondary'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-text-muted/80 font-light max-w-[200px] lg:max-w-none pr-8 lg:pr-0">
                      {step.desc}
                    </p>
                    {step.project && (
                      <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'border-warning/30 bg-warning/10 text-warning shadow-[0_0_8px_rgba(234,179,8,0.2)]'
                          : 'border-border/50 bg-bg-elevated/30 text-text-muted/60'
                      }`}>
                        <FolderGit2 className="h-2.5 w-2.5 shrink-0" />
                        {step.project}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Side-by-Side Transformation Comparison Panel */}
        <motion.div
          variants={fadeUp}
          className="mx-auto grid gap-8 md:grid-cols-2 max-w-4xl"
        >
          {/* Traditional Learning Panel */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-bg-card/25 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6 select-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/10 text-error">
                <BookX className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <h4 className="font-heading text-base font-semibold text-text-secondary">Traditional Learning</h4>
            </div>
            
            <ul className="space-y-4">
              {[
                { label: 'Read Notes', desc: 'Sifting through long documents and textbooks.' },
                { label: 'Passive Learning', desc: 'Watching endless tutorials without typing code.' },
                { label: 'Forget Information', desc: '80% of concepts lost from memory in 24 hours.' },
                { label: 'No Feedback', desc: 'Struggling blindly without knowing why code fails.' },
                { label: 'No Guidance', desc: 'Getting stuck on syntax bugs with no help.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-text-muted text-left">
                  <span className="text-error text-xs mt-1 shrink-0 select-none">❌</span>
                  <div>
                    <span className="font-medium text-text-secondary pr-1">{item.label}</span>
                    <span className="font-light text-xs text-text-muted/80">({item.desc})</span>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-4 border-t border-border/30 flex items-center justify-between text-xs font-mono text-text-muted/60 select-none">
              <span>OUTCOME</span>
              <span className="text-error font-semibold uppercase tracking-wider">Frustration & Exhaustion</span>
            </div>
          </div>

          {/* Codexa Method Panel */}
          <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.005] p-6 sm:p-8 shadow-elevated">
            {/* Inner background gradient */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-2.5 mb-6 select-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-sm shadow-accent/15">
                <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <h4 className="font-heading text-base font-semibold text-text">The Codexa Method</h4>
            </div>
            
            <ul className="space-y-4">
              {[
                { label: 'Understand', desc: 'Clear, concise concept breakdowns.' },
                { label: 'Visualize', desc: 'Interactive visual structures of data.' },
                { label: 'Interact', desc: 'Click and drag to run execution paths.' },
                { label: 'Practice', desc: 'Solve conceptual programming puzzles.' },
                { label: 'Quiz', desc: 'Spaced repetition reinforces retention.' },
                { label: 'AI Guidance', desc: 'Contextual tutor checks your editor.' },
                { label: 'Master', desc: 'Achieve demonstrable engineering recall.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary text-left">
                  <span className="text-success text-xs mt-1 shrink-0 select-none">✅</span>
                  <div>
                    <span className="font-semibold text-text pr-1">{item.label}</span>
                    <span className="font-light text-xs text-text-muted/90">({item.desc})</span>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-4 border-t border-accent/15 flex items-center justify-between text-xs font-mono text-accent/80 select-none">
              <span>OUTCOME</span>
              <span className="text-accent font-semibold uppercase tracking-wider">Engineering Mastery</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Local custom scroll reveal hook ───
import { useRef, useEffect as useReactEffect } from 'react';
import { useInView, useAnimation } from 'framer-motion';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  useReactEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}
