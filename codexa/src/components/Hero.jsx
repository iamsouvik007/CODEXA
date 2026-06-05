import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useScrollReveal, staggerContainer, fadeUp, brandReveal, useWordCycler } from '../lib/animations';

const cycleWords = ['Understand.', 'Visualize.', 'Practice.', 'Ask.', 'Master.'];

// Floating code fragments for the background reveal
const codeFragments = [
  // Snippets
  { text: 'const learning = true;', top: '15%', left: '10%', fontSize: 'text-sm' },
  { text: 'function masterConcept() {}', top: '25%', left: '75%', fontSize: 'text-xs' },
  { text: 'if (practice) {\n  improve();\n}', top: '65%', left: '12%', fontSize: 'text-sm' },
  { text: 'export default Codexa;', top: '80%', left: '70%', fontSize: 'text-sm' },
  
  // Symbols
  { text: '{}', top: '20%', left: '45%', fontSize: 'text-3xl' },
  { text: '[]', top: '75%', left: '40%', fontSize: 'text-2xl' },
  { text: '()', top: '40%', left: '15%', fontSize: 'text-2xl' },
  { text: '<>', top: '35%', left: '85%', fontSize: 'text-xl' },
  { text: '=>', top: '55%', left: '50%', fontSize: 'text-lg' },
  { text: '&&', top: '10%', left: '30%', fontSize: 'text-lg' },
  { text: '||', top: '85%', left: '55%', fontSize: 'text-lg' },
  { text: '===', top: '90%', left: '25%', fontSize: 'text-xl' },
  { text: '!==', top: '60%', left: '88%', fontSize: 'text-xl' },
  { text: 'async', top: '30%', left: '55%', fontSize: 'text-sm' },
  { text: 'await', top: '45%', left: '25%', fontSize: 'text-sm' },
  { text: 'import', top: '12%', left: '80%', fontSize: 'text-sm' },
  { text: 'export', top: '88%', left: '80%', fontSize: 'text-sm' },

  // Keywords
  { text: 'Variables', top: '42%', left: '70%', fontSize: 'text-xs' },
  { text: 'Functions', top: '18%', left: '60%', fontSize: 'text-xs' },
  { text: 'Arrays', top: '50%', left: '35%', fontSize: 'text-xs' },
  { text: 'Objects', top: '78%', left: '18%', fontSize: 'text-xs' },
  { text: 'Closures', top: '28%', left: '40%', fontSize: 'text-xs' },
  { text: 'Promises', top: '58%', left: '10%', fontSize: 'text-xs' },
  { text: 'Async/Await', top: '70%', left: '60%', fontSize: 'text-xs' },
  { text: 'React', top: '22%', left: '22%', fontSize: 'text-xs' },
  { text: 'Backend', top: '52%', left: '80%', fontSize: 'text-xs' },
  { text: 'System Design', top: '82%', left: '45%', fontSize: 'text-xs' },
  { text: 'DevOps', top: '15%', left: '5%', fontSize: 'text-xs' },
  { text: 'GenAI', top: '68%', left: '92%', fontSize: 'text-xs' },

  // Folders
  { text: '/javascript', top: '8%', left: '50%', fontSize: 'text-xs' },
  { text: '/react', top: '35%', left: '5%', fontSize: 'text-xs' },
  { text: '/backend', top: '62%', left: '28%', fontSize: 'text-xs' },
  { text: '/system-design', top: '48%', left: '90%', fontSize: 'text-xs' },
  { text: '/devops', top: '92%', left: '10%', fontSize: 'text-xs' },
  { text: '/genai', top: '75%', left: '85%', fontSize: 'text-xs' },
];

export default function Hero() {
  const { ref, controls } = useScrollReveal(0.1);
  const { displayed, isTyping } = useWordCycler(cycleWords, 80, 40, 2200);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg pt-16"
      id="main-content"
    >
      {/* 1. Base Layer: Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid z-0 opacity-60" aria-hidden="true" />

      {/* 2 & 3. Hidden Developer Layer + Mask Reveal */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-70 mix-blend-screen transition-opacity duration-500"
        style={{
          maskImage: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {codeFragments.map((fragment, i) => (
          <div 
            key={i} 
            className={`absolute font-mono font-medium text-accent whitespace-pre tracking-wide`}
            style={{ top: fragment.top, left: fragment.left }}
          >
            <span className={fragment.fontSize}>{fragment.text}</span>
          </div>
        ))}
      </div>

      {/* Background radial glows for general ambiance */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[400px] rounded-full bg-accent/[0.03] blur-[80px]" />
      </div>

      {/* 4. Large CODEXA watermark — background layer */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={brandReveal}
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span
          className="font-heading text-[clamp(120px,25vw,350px)] font-bold leading-none tracking-[-0.04em] whitespace-nowrap opacity-10"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(253,186,116,0.05) 50%, rgba(249,115,22,0.02) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CODEXA
        </span>
      </motion.div>

      {/* 5 & 6. Content Layer */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-[1200px] px-5 py-24 text-center sm:px-8 sm:py-32"
      >
        {/* Foreground CODEXA Brand */}
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
           <h1 className="font-heading text-[5rem] font-bold tracking-tight sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] bg-gradient-to-b from-text via-text to-text-secondary bg-clip-text text-transparent drop-shadow-2xl select-none text-center leading-[0.85]">
             CODEXA
           </h1>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="text-balance font-heading mx-auto max-w-5xl text-3xl font-semibold leading-[1.06] tracking-[-0.03em] text-text sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Stop reading code.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            Start experiencing it.
          </span>
        </motion.h2>

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
            href="/learn"
            className="group inline-flex items-center gap-2 rounded-pill bg-accent px-8 py-3.5 text-base font-medium text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep hover:shadow-glow"
          >
            Start Learning — Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#roadmap"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#roadmap')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 rounded-pill border border-border bg-bg-card/60 px-8 py-3.5 text-base font-medium text-text-secondary backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:text-text"
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
          <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-elevated transition-transform duration-500 hover:shadow-glow">
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-text-muted">
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
