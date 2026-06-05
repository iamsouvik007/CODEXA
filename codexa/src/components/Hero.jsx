import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useScrollReveal, staggerContainer, fadeUp, brandReveal, useWordCycler } from '../lib/animations';

const cycleWords = ['Understand.', 'Visualize.', 'Practice.', 'Master.'];

export default function Hero() {
  const { ref, controls } = useScrollReveal(0.1);
  const { displayed, isTyping } = useWordCycler(cycleWords, 80, 40, 2200);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg pt-16"
      id="main-content"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />

      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[400px] rounded-full bg-accent/[0.02] blur-[80px]" />
      </div>

      {/* Large CODEXA brand text — background layer */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={brandReveal}
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span
          className="font-heading text-[clamp(100px,18vw,220px)] font-bold leading-none tracking-[-0.04em] whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.07) 0%, rgba(253,186,116,0.04) 50%, rgba(249,115,22,0.02) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CODEXA
        </span>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-[1200px] px-5 py-24 text-center sm:px-8 sm:py-32"
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeUp} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-card/80 px-4 py-1.5 text-sm font-medium text-text-secondary backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Interactive Learning Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-balance font-heading mx-auto max-w-5xl text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-text sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Stop reading code.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            Start experiencing it.
          </span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-6 flex items-center justify-center gap-2 text-xl text-text-secondary sm:text-2xl md:text-3xl"
        >
          <span className="font-heading font-medium tracking-tight text-text">
            {displayed}
          </span>
          <span
            className={`inline-block h-7 w-[3px] rounded-full bg-accent sm:h-8 ${
              isTyping ? 'opacity-100' : 'animate-pulse'
            }`}
            aria-hidden="true"
          />
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Codexa transforms programming concepts into interactive, visual experiences.
          Learn, see it in action, write real code, and master every topic with AI guidance.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#learn"
            className="group inline-flex items-center gap-2 rounded-pill bg-accent px-8 py-3.5 text-base font-medium text-white shadow-card transition-all hover:bg-accent-deep hover:shadow-elevated"
          >
            Start Learning — Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-pill border border-border bg-bg-card/60 px-8 py-3.5 text-base font-medium text-text-secondary backdrop-blur-sm transition-all hover:border-border-strong hover:text-text"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Explore Curriculum
          </a>
        </motion.div>

        {/* Hero code preview card */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-16 max-w-3xl sm:mt-20"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-elevated">
            {/* Editor title bar */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="ml-2 font-mono text-xs text-text-muted">codexa.js</span>
            </div>
            {/* Code content */}
            <div className="p-6 sm:p-8">
              <pre className="text-left font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
                <code>
                  <span className="text-text-muted">{'// 🚀 The Codexa learning pipeline\n\n'}</span>
                  <span className="text-[#c084fc]">const</span>{' '}
                  <span className="text-[#67e8f9]">learn</span>{' = {\n'}
                  {'  '}
                  <span className="text-text">concept</span>
                  {'   : '}
                  <span className="text-[#a5f3fc]">{'"Understand the idea"'}</span>
                  {',\n  '}
                  <span className="text-text">analogy</span>
                  {'   : '}
                  <span className="text-[#a5f3fc]">{'"Connect to what you know"'}</span>
                  {',\n  '}
                  <span className="text-text">visualize</span>
                  {' : '}
                  <span className="text-[#a5f3fc]">{'"See it come alive"'}</span>
                  {',\n  '}
                  <span className="text-text">practice</span>
                  {'  : '}
                  <span className="text-[#a5f3fc]">{'"Write real code"'}</span>
                  {',\n  '}
                  <span className="text-text">master</span>
                  {'    : '}
                  <span className="text-[#a5f3fc]">{'"Prove your knowledge"'}</span>
                  {'\n};\n\n'}
                  <span className="text-accent">{'learn'}</span>
                  <span className="text-text-muted">.start()</span>
                  {'  '}
                  <span className="text-text-muted">{'// → Begin your journey'}</span>
                </code>
              </pre>
            </div>
          </div>
          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
            <span>✦ Interactive lessons</span>
            <span>✦ Live code editor</span>
            <span>✦ AI mentor</span>
            <span className="hidden sm:inline">✦ Visual explanations</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
