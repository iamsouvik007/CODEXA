import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Lightbulb, Eye, Gamepad2, HelpCircle, Brain, Bot, Trophy,
  ArrowDown, BookX, Video, BrainCircuit,
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
    title: 'Real-Life Analogy',
    desc: 'Every concept linked to something you already know. Closures become backpacks, arrays become playlists.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Eye,
    title: 'Visual Explanation',
    desc: 'Animated diagrams that show how data flows, how memory works, how functions execute — step by step.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Gamepad2,
    title: 'Interactive Demo',
    desc: 'Hands-on interaction with the concept. Drag values, click through execution, see cause and effect.',
    color: 'text-[#a78bfa]',
    bg: 'bg-[#a78bfa]/10',
  },
  {
    icon: HelpCircle,
    title: 'Practice Challenge',
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
    title: 'AI Mentor',
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
        {/* The Problem — compact intro */}
        <motion.div variants={fadeUp} className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <SectionLabel>Why Codexa</SectionLabel>
          <SectionHeading>Traditional learning is broken.</SectionHeading>
          <SectionDescription className="mx-auto">
            Reading docs and watching tutorials isn&apos;t enough. You forget 80% within 24 hours.
            Codexa replaces passive consumption with an active learning pipeline.
          </SectionDescription>

          {/* Compact problem → solution flow */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <div className="flex items-center gap-3 rounded-lg border border-border-soft bg-bg-card px-4 py-3 opacity-50">
              <BookX className="h-4 w-4 text-text-muted" aria-hidden="true" />
              <span className="text-sm text-text-muted line-through">Read Notes</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border-soft bg-bg-card px-4 py-3 opacity-50">
              <Video className="h-4 w-4 text-text-muted" aria-hidden="true" />
              <span className="text-sm text-text-muted line-through">Watch Videos</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border-soft bg-bg-card px-4 py-3 opacity-50">
              <BrainCircuit className="h-4 w-4 text-text-muted" aria-hidden="true" />
              <span className="text-sm text-text-muted line-through">Forget 80%</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <ArrowDown className="h-5 w-5 text-accent/50" aria-hidden="true" />
          </div>

          <p className="mt-3 text-sm font-medium text-accent">
            Instead, Codexa guides you through 8 proven steps.
          </p>
        </motion.div>

        {/* The Codexa Method — 8 steps */}
        <motion.div variants={fadeUp}>
          <div className="mb-8 text-center">
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              The Codexa Method.
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Every lesson follows the same proven learning flow.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* Step selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  className={`group flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left transition-all lg:w-full ${
                    activeStep === i
                      ? 'border border-accent/20 bg-accent-bg'
                      : 'border border-transparent hover:bg-bg-card'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    activeStep === i ? step.bg : 'bg-bg-elevated'
                  }`}>
                    <span className={`font-mono text-xs font-medium ${
                      activeStep === i ? step.color : 'text-text-muted'
                    }`}>{i + 1}</span>
                  </div>
                  <span className={`whitespace-nowrap text-sm font-medium ${
                    activeStep === i ? 'text-text' : 'text-text-secondary'
                  }`}>{step.title}</span>
                </button>
              ))}
            </div>

            {/* Active step detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-start justify-center rounded-xl border border-border bg-bg-card p-8 sm:p-10 lg:p-12"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${steps[activeStep].bg}`}>
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className={`h-6 w-6 ${steps[activeStep].color}`} aria-hidden="true" />;
                  })()}
                </div>
                <h3 className="font-heading mb-2 text-xl font-semibold tracking-tight text-text sm:text-2xl">
                  Step {activeStep + 1}: {steps[activeStep].title}
                </h3>
                <p className="max-w-lg text-base leading-relaxed text-text-secondary">
                  {steps[activeStep].desc}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeStep ? 'w-6 bg-accent' : 'w-1.5 bg-border'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
