import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Lightbulb, Eye, Gamepad2, HelpCircle, Brain, Bot, Trophy,
  ArrowRight, BookX, Video, BrainCircuit, RefreshCcw, Frown, Sparkles
} from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer } from '../lib/animations';

const steps = [
  {
    icon: BookOpen,
    title: 'Concept',
    desc: 'Clear, structured explanation of the programming concept. No fluff — just what you need to understand.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Lightbulb,
    title: 'Analogy',
    desc: 'Every concept linked to something you already know. Closures become backpacks, arrays become playlists.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Eye,
    title: 'Visualize',
    desc: 'Animated diagrams that show how data flows, how memory works, how functions execute — step by step.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Gamepad2,
    title: 'Interact',
    desc: 'Hands-on interaction with the concept. Drag values, click through execution, see cause and effect.',
    color: 'text-[#a78bfa]',
    bg: 'bg-[#a78bfa]/10',
  },
  {
    icon: HelpCircle,
    title: 'Practice',
    desc: 'Real coding challenges that test your understanding. Not syntax drills — conceptual challenges.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: Brain,
    title: 'Quiz',
    desc: 'Targeted questions that reveal whether you truly understood or just memorized. Spaced repetition built in.',
    color: 'text-[#f472b6]',
    bg: 'bg-[#f472b6]/10',
  },
  {
    icon: Bot,
    title: 'AI Tutor',
    desc: 'Stuck? Ask the AI mentor. It knows what lesson you\'re on and gives context-aware explanations.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Trophy,
    title: 'Mastery',
    desc: 'Concept marked as mastered only when you\'ve demonstrated understanding through practice and recall.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

const traditionalFlow = [
  { icon: BookX, label: 'Read Notes' },
  { icon: Video, label: 'Watch Videos' },
  { icon: BrainCircuit, label: 'Forget' },
  { icon: Frown, label: 'Confused' },
  { icon: RefreshCcw, label: 'Start Again' },
];

const codexaFlow = [
  { icon: BookOpen, label: 'Learn' },
  { icon: Eye, label: 'Visualize' },
  { icon: Gamepad2, label: 'Practice' },
  { icon: Brain, label: 'Quiz' },
  { icon: Bot, label: 'AI Tutor' },
  { icon: Trophy, label: 'Master' },
];

export default function LearningMethod() {
  const { ref, controls } = useScrollReveal(0.08);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section ref={ref} id="learn" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        {/* The Problem — visual comparison */}
        <motion.div variants={fadeUp} className="mx-auto mb-20 max-w-5xl text-center sm:mb-28">
          <SectionLabel>Why Codexa</SectionLabel>
          <SectionHeading>Traditional learning is broken.</SectionHeading>
          <SectionDescription className="mx-auto mb-12">
            Reading docs and watching tutorials isn&apos;t enough. You forget 80% within 24 hours.
            Codexa replaces passive consumption with an active learning pipeline.
          </SectionDescription>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Traditional Flow */}
            <div className="flex flex-col items-center rounded-2xl border border-border bg-bg-card p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-center gap-2">
                <span className="font-heading text-lg font-semibold text-text-secondary">Traditional Learning</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                {traditionalFlow.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated text-text-muted transition-colors hover:bg-border">
                        <step.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium text-text-muted">{step.label}</span>
                    </div>
                    {i < traditionalFlow.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-border" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex w-full flex-col items-center border-t border-border pt-6">
                <span className="text-sm font-medium text-text-muted">Result</span>
                <span className="mt-1 font-heading text-xl font-semibold text-error">Frustration</span>
              </div>
            </div>

            {/* Codexa Flow */}
            <div className="relative flex flex-col items-center rounded-2xl border border-accent/30 bg-accent/[0.03] p-8 shadow-elevated">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
              <div className="mb-8 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="font-heading text-lg font-semibold text-text">Codexa Learning</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                {codexaFlow.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors hover:bg-accent/20 shadow-sm shadow-accent/5">
                        <step.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium text-text">{step.label}</span>
                    </div>
                    {i < codexaFlow.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-accent/40" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex w-full flex-col items-center border-t border-accent/20 pt-6">
                <span className="text-sm font-medium text-accent/80">Result</span>
                <span className="mt-1 font-heading text-xl font-semibold text-accent drop-shadow-sm">Real Understanding</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Codexa Method — 8 steps */}
        <motion.div variants={fadeUp}>
          <div className="mb-10 text-center">
            <h3 className="font-heading text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              The Codexa Method.
            </h3>
            <p className="mt-3 text-base text-text-secondary">
              Every lesson follows the same proven learning flow.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-16">
            {/* Step selector */}
            <div className="flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  className={`group relative flex shrink-0 items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-300 lg:w-full ${
                    activeStep === i
                      ? 'bg-bg-card shadow-sm'
                      : 'hover:bg-bg-card/50'
                  }`}
                >
                  {activeStep === i && (
                    <motion.div
                      layoutId="active-step-border"
                      className="absolute inset-0 rounded-xl border border-border"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {activeStep === i && (
                    <div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-accent lg:block hidden" />
                  )}
                  <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                    activeStep === i ? step.bg : 'bg-bg-elevated'
                  }`}>
                    <step.icon className={`h-4.5 w-4.5 transition-colors duration-300 ${
                      activeStep === i ? step.color : 'text-text-muted group-hover:text-text-secondary'
                    }`} aria-hidden="true" />
                  </div>
                  <div>
                    <div className={`text-xs font-mono font-medium mb-0.5 transition-colors duration-300 ${
                      activeStep === i ? step.color : 'text-text-muted/60'
                    }`}>
                      STEP {i + 1}
                    </div>
                    <span className={`whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${
                      activeStep === i ? 'text-text' : 'text-text-secondary group-hover:text-text'
                    }`}>{step.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active step detail */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex h-full min-h-[360px] flex-col justify-center rounded-2xl border border-border bg-bg-card p-8 sm:p-12 lg:p-16 shadow-elevated relative overflow-hidden"
                >
                  {/* Subtle background glow */}
                  <div className={`absolute top-0 right-0 h-64 w-64 rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3 ${steps[activeStep].bg}`} />

                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${steps[activeStep].bg}`}>
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return <Icon className={`h-8 w-8 ${steps[activeStep].color}`} aria-hidden="true" />;
                    })()}
                  </div>
                  <h3 className="font-heading mb-4 text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-4xl">
                    {steps[activeStep].title}
                  </h3>
                  <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
                    {steps[activeStep].desc}
                  </p>
                  
                  {/* Progress Indicators */}
                  <div className="mt-10 flex items-center gap-2">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === activeStep ? 'w-8 bg-accent' : 
                          i < activeStep ? 'w-2 bg-accent/30' : 'w-2 bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
