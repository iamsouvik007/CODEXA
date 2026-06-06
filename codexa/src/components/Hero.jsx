import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useScrollReveal, staggerContainer, fadeUp } from '../lib/animations';
import { useWordCycler } from '../lib/animations';

const cycleWords = [
  'Understand.',
  'Visualize.',
  'Practice.',
  'Build.',
  'Debug.',
  'Master.',
  'Think Like An Engineer.',
  'Learn By Doing.'
];

// Static configuration constants for Code Card tilt
const TILT_INPUT_Y = [-200, 200];
const TILT_OUTPUT_X = [8, -8];
const TILT_INPUT_X = [-300, 300];
const TILT_OUTPUT_Y = [-10, 10];
const CARD_SPRING_CONFIG = { damping: 25, stiffness: 120 };

// Color-coded keyword items to match VS Code token classes
const developerKeywords = [
  { text: 'JavaScript', top: '12%', left: '8%', fontSize: 'text-sm', color: 'text-[#facc15]' },
  { text: 'TypeScript', top: '48%', left: '5%', fontSize: 'text-sm', color: 'text-[#facc15]' },
  { text: 'React', top: '22%', left: '82%', fontSize: 'text-base', color: 'text-[#67e8f9]' },
  { text: 'Python', top: '78%', left: '12%', fontSize: 'text-xs', color: 'text-[#facc15]' },
  { text: 'Node.js', top: '85%', left: '88%', fontSize: 'text-sm', color: 'text-[#4ade80]' },
  { text: 'API', top: '10%', left: '72%', fontSize: 'text-xs', color: 'text-[#a5f3fc]' },
  { text: 'DOM', top: '68%', left: '86%', fontSize: 'text-xs', color: 'text-[#a5f3fc]' },
  { text: 'Async', top: '32%', left: '16%', fontSize: 'text-sm', color: 'text-[#4ade80]' },
  { text: 'Promise', top: '58%', left: '10%', fontSize: 'text-sm', color: 'text-[#4ade80]' },
  { text: 'Array', top: '26%', left: '26%', fontSize: 'text-xs', color: 'text-[#a5f3fc]' },
  { text: 'Object', top: '72%', left: '20%', fontSize: 'text-xs', color: 'text-[#a5f3fc]' },
  { text: 'Algorithm', top: '82%', left: '38%', fontSize: 'text-sm', color: 'text-[#c084fc]' },
  { text: 'Data Structure', top: '16%', left: '55%', fontSize: 'text-xs', color: 'text-[#c084fc]' },
  { text: 'Binary Search', top: '42%', left: '88%', fontSize: 'text-xs', color: 'text-[#c084fc]' },
  { text: 'O(n)', top: '55%', left: '82%', fontSize: 'text-sm', color: 'text-[#f97316]' },
  { text: 'HashMap', top: '65%', left: '76%', fontSize: 'text-xs', color: 'text-[#c084fc]' },
  { text: 'System Design', top: '88%', left: '52%', fontSize: 'text-sm', color: 'text-[#c084fc]' },
  { text: 'AI', top: '8%', left: '24%', fontSize: 'text-base', color: 'text-[#f97316]' },
  { text: 'Machine Learning', top: '92%', left: '22%', fontSize: 'text-xs', color: 'text-[#f97316]' },
  { text: 'Backend', top: '35%', left: '74%', fontSize: 'text-sm', color: 'text-[#3b82f6]' },
  { text: 'Frontend', top: '62%', left: '4%', fontSize: 'text-sm', color: 'text-[#3b82f6]' }
];

// Syntax token structures for VS Code style highlight layers
const codeSnippets = [
  {
    tokens: [
      { text: 'const', color: 'text-[#c084fc]' },
      { text: ' learn = () ', color: 'text-text' },
      { text: '=>', color: 'text-accent' },
      { text: ' mastery;', color: 'text-[#67e8f9]' }
    ],
    top: '28%', left: '4%', fontSize: 'text-sm'
  },
  {
    tokens: [
      { text: 'async function', color: 'text-[#c084fc]' },
      { text: ' grow', color: 'text-[#67e8f9]' },
      { text: '() {}', color: 'text-text' }
    ],
    top: '14%', left: '84%', fontSize: 'text-sm'
  },
  {
    tokens: [
      { text: 'return', color: 'text-[#c084fc]' },
      { text: ' knowledge;', color: 'text-text' }
    ],
    top: '75%', left: '82%', fontSize: 'text-sm'
  },
  {
    tokens: [
      { text: 'const', color: 'text-[#c084fc]' },
      { text: ' skill = practice ', color: 'text-text' },
      { text: '+', color: 'text-accent' },
      { text: ' consistency;', color: 'text-[#67e8f9]' }
    ],
    top: '88%', left: '8%', fontSize: 'text-xs'
  },
  {
    tokens: [
      { text: 'if', color: 'text-[#c084fc]' },
      { text: ' (understand) ', color: 'text-text' },
      { text: 'mastery', color: 'text-[#67e8f9]' },
      { text: '++', color: 'text-accent' }
    ],
    top: '65%', left: '14%', fontSize: 'text-sm'
  },
  {
    tokens: [
      { text: 'const', color: 'text-[#c084fc]' },
      { text: ' future = ', color: 'text-text' },
      { text: '"developer"', color: 'text-[#a5f3fc]' },
      { text: ';', color: 'text-text' }
    ],
    top: '20%', left: '62%', fontSize: 'text-xs'
  },
  {
    tokens: [
      { text: 'useEffect', color: 'text-[#67e8f9]' },
      { text: '(() => {});', color: 'text-text' }
    ],
    top: '8%', left: '40%', fontSize: 'text-sm'
  },
  {
    tokens: [
      { text: 'const', color: 'text-[#c084fc]' },
      { text: ' array = ', color: 'text-text' },
      { text: '[]', color: 'text-[#fdba74]' },
      { text: ';', color: 'text-text' }
    ],
    top: '52%', left: '20%', fontSize: 'text-xs'
  },
  {
    tokens: [
      { text: 'const', color: 'text-[#c084fc]' },
      { text: ' mentor = ', color: 'text-text' },
      { text: '"AI"', color: 'text-[#a5f3fc]' },
      { text: ';', color: 'text-text' }
    ],
    top: '78%', left: '70%', fontSize: 'text-sm'
  }
];

const floatingSymbols = [
  { text: '{}', top: '18%', left: '22%', fontSize: 'text-3xl', color: 'text-[#facc15]' },
  { text: '[]', top: '72%', left: '7%', fontSize: 'text-2xl', color: 'text-[#facc15]' },
  { text: '()', top: '38%', left: '11%', fontSize: 'text-2xl', color: 'text-[#facc15]' },
  { text: '< />', top: '25%', left: '78%', fontSize: 'text-xl', color: 'text-[#67e8f9]' },
  { text: '</>', top: '82%', left: '32%', fontSize: 'text-2xl', color: 'text-[#67e8f9]' },
  { text: '===', top: '90%', left: '78%', fontSize: 'text-xl', color: 'text-[#c084fc]' },
  { text: '!==', top: '52%', left: '90%', fontSize: 'text-xl', color: 'text-[#c084fc]' },
  { text: '=>', top: '45%', left: '15%', fontSize: 'text-lg', color: 'text-[#c084fc]' },
  { text: '&&', top: '12%', left: '33%', fontSize: 'text-lg', color: 'text-[#c084fc]' },
  { text: '||', top: '85%', left: '64%', fontSize: 'text-lg', color: 'text-[#c084fc]' },
  { text: '⚡', top: '30%', left: '88%', fontSize: 'text-2xl', color: 'text-accent' },
  { text: '💡', top: '62%', left: '80%', fontSize: 'text-2xl', color: 'text-[#facc15]' },
  { text: '🧠', top: '6%', left: '14%', fontSize: 'text-2xl', color: 'text-[#fdba74]' }
];

export default function Hero() {
  const { ref, controls } = useScrollReveal(0.1);
  const { displayed, status } = useWordCycler(cycleWords, 65, 25, 2000);
  const shouldReduceMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);

  // Instant mouse coordinate tracker (zero latency, bypasses spring animations)
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    window.requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.setProperty('--mouse-x', `${x}px`);
        ref.current.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg pt-16"
      id="main-content"
    >
      {/* Layer 1. Base Layer: Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid z-0 opacity-60" aria-hidden="true" />

      {/* Background System Container */}
      <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
        {/* Layer 2: Giant Background CODEXA (Fits cleanly on page) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-x-0 top-[18%] flex items-center justify-center pointer-events-none z-[1] select-none"
        >
          <span className="font-heading font-extrabold text-[clamp(100px,18vw,380px)] leading-none tracking-[-0.05em] text-accent select-none blur-[1px]">
            CODEXA
          </span>
        </motion.div>

        {/* Layer 3: Ambient Hero Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full bg-accent/[0.035] blur-[150px] z-[1] pointer-events-none" />

        {/* Layer 4: Floating Developer Canvas (Hardware accelerated) */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            y: [0, -10, 0],
            x: [0, 4, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-[2] will-change-transform"
        >
          {/* Base Faint Gray Layer (Visible without hover) */}
          <div className="absolute inset-0">
            {developerKeywords.map((kw, i) => (
              <div
                key={`kw-bg-${i}`}
                className={`absolute font-mono font-medium text-text-secondary/15 whitespace-nowrap select-none ${kw.fontSize}`}
                style={{ top: kw.top, left: kw.left }}
              >
                {kw.text}
              </div>
            ))}
            {codeSnippets.map((cs, i) => (
              <div
                key={`cs-bg-${i}`}
                className={`absolute font-mono text-text-secondary/15 whitespace-nowrap select-none ${cs.fontSize}`}
                style={{ top: cs.top, left: cs.left }}
              >
                {cs.tokens.map(t => t.text).join('')}
              </div>
            ))}
            {floatingSymbols.map((sym, i) => (
              <div
                key={`sym-bg-${i}`}
                className={`absolute font-mono text-text-secondary/15 whitespace-nowrap select-none ${sym.fontSize}`}
                style={{ top: sym.top, left: sym.left }}
              >
                {sym.text}
              </div>
            ))}
          </div>

          {/* Masked Revealed Color Syntax Layer (Visible only under hover spotlight) */}
          <motion.div
            className="absolute inset-0 select-none pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.25 }}
            style={{
              maskImage: 'radial-gradient(280px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(280px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
            }}
          >
            {developerKeywords.map((kw, i) => (
              <div
                key={`kw-fg-${i}`}
                className={`absolute font-mono font-semibold ${kw.color} whitespace-nowrap drop-shadow-[0_0_6px_rgba(255,255,255,0.1)] select-none ${kw.fontSize}`}
                style={{ top: kw.top, left: kw.left }}
              >
                {kw.text}
              </div>
            ))}
            {codeSnippets.map((cs, i) => (
              <div
                key={`cs-fg-${i}`}
                className={`absolute font-mono font-medium whitespace-nowrap select-none ${cs.fontSize}`}
                style={{ top: cs.top, left: cs.left }}
              >
                {cs.tokens.map((t, idx) => (
                  <span key={idx} className={t.color}>{t.text}</span>
                ))}
              </div>
            ))}
            {floatingSymbols.map((sym, i) => (
              <div
                key={`sym-fg-${i}`}
                className={`absolute font-mono font-bold ${sym.color} whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] select-none ${sym.fontSize}`}
                style={{ top: sym.top, left: sym.left }}
              >
                {sym.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 5: Cursor Spotlight Layer (GPU-accelerated warm background radial glow light) */}
        <motion.div
          className="absolute rounded-full pointer-events-none z-[3] mix-blend-screen"
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{
            left: 0,
            top: 0,
            width: '550px',
            height: '550px',
            background: 'radial-gradient(circle, rgba(253, 186, 116, 0.16) 0%, rgba(249, 115, 22, 0.04) 40%, transparent 70%)',
            transform: 'translate3d(var(--mouse-x, -1000px), var(--mouse-y, -1000px), 0) translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        {/* Floating micro node connection lines */}
        {!shouldReduceMotion && (
          <>
            <motion.svg
              className="absolute opacity-15 pointer-events-none z-[1]"
              style={{ top: '35%', left: '85%', width: '125px', height: '125px' }}
              animate={{
                rotate: [0, 360],
                y: [0, -8, 0]
              }}
              transition={{
                duration: 26,
                repeat: Infinity,
                ease: "linear"
              }}
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="3.5" fill="var(--color-accent)" />
              <circle cx="85" cy="50" r="2" fill="var(--color-text-secondary)" />
              <circle cx="45" cy="95" r="2.5" fill="var(--color-accent-soft)" />
              <line x1="20" y1="20" x2="85" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="85" y1="50" x2="45" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </motion.svg>

            <motion.svg
              className="absolute opacity-12 pointer-events-none z-[1]"
              style={{ top: '65%', left: '16%', width: '145px', height: '105px' }}
              animate={{
                rotate: [0, -360],
                y: [0, 6, 0]
              }}
              transition={{
                duration: 32,
                repeat: Infinity,
                ease: "linear"
              }}
              aria-hidden="true"
            >
              <circle cx="25" cy="75" r="2" fill="var(--color-text-secondary)" />
              <circle cx="105" cy="30" r="3.5" fill="var(--color-accent)" />
              <circle cx="55" cy="20" r="2" fill="var(--color-text-muted)" />
              <line x1="25" y1="75" x2="105" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="55" y1="20" x2="105" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </motion.svg>
          </>
        )}
      </div>

      {/* 7. Content Layer */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-[1200px] px-5 py-24 text-center sm:px-8 sm:py-32"
      >
        {/* Foreground CODEXA Brand Header */}
        <motion.div
          variants={fadeUp}
          className="mb-8 flex justify-center relative select-none"
        >
          <div className="absolute inset-x-0 -top-6 mx-auto w-[280px] h-[90px] bg-accent/15 blur-[45px] rounded-full pointer-events-none" />
          
          <h1
            className="font-heading text-[5.8rem] font-bold tracking-[-0.04em] sm:text-8xl md:text-[9.5rem] lg:text-[11rem] xl:text-[12.5rem] bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] text-center leading-[0.85]"
            style={{
              textShadow: '0 0 35px rgba(249,115,22,0.12)'
            }}
          >
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

        {/* Wobble-free Typing animation */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-6 flex items-center justify-center text-xl text-text-secondary sm:text-2xl md:text-3xl"
        >
          <div className="inline-flex w-[280px] sm:w-[380px] md:w-[440px] items-center justify-start text-left gap-1.5">
            <span className="font-heading font-medium tracking-tight text-text">
              {displayed || '\u200B'}
            </span>
            <span
              className={`inline-block h-6 w-[2.5px] rounded-full bg-accent sm:h-7 ${
                status === 'waiting' ? 'animate-cursor-blink' : 'opacity-100'
              }`}
              aria-hidden="true"
            />
          </div>
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
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-amber-500 px-8 py-3.5 text-base font-medium text-white shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Start Learning — Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href="#roadmap"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#roadmap');
              if (target) {
                if (window.lenis) {
                  window.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="group inline-flex items-center gap-2 rounded-pill border border-border bg-bg-card/60 px-8 py-3.5 text-base font-medium text-text-secondary backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Explore Curriculum
          </a>
        </motion.div>

        {/* Interactive Code Preview Card */}
        <motion.div variants={fadeUp}>
          <InteractiveCodeCard shouldReduceMotion={shouldReduceMotion} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Sub-Component: Interactive Code Card ───
function InteractiveCodeCard({ shouldReduceMotion }) {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);

  const smoothX = useSpring(cardX, CARD_SPRING_CONFIG);
  const smoothY = useSpring(cardY, CARD_SPRING_CONFIG);

  const rotateX = useTransform(smoothY, TILT_INPUT_Y, TILT_OUTPUT_X);
  const rotateY = useTransform(smoothX, TILT_INPUT_X, TILT_OUTPUT_Y);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [consoleLines, setConsoleLines] = useState([]);

  const handleCardMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mx = e.clientX - rect.left - width / 2;
    const my = e.clientY - rect.top - height / 2;
    cardX.set(mx);
    cardY.set(my);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    cardX.set(0);
    cardY.set(0);
  };

  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
  };

  // Cycle line highlight inside editor code area
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % 10);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Simulate output printing inside REPL terminal on hover
  useEffect(() => {
    if (isCardHovered) {
      const lines = [
        '> node codexa.js',
        '✓ Concept compiled: "Understand the idea"',
        '✓ Analogies resolved: "Connect to what you know"',
        '✓ Visualizations loaded: "See it come alive"',
        '✓ Code Sandbox initialized… [OK]',
        '⚡ Mastery achieved: "Learn by doing" 🚀'
      ];

      setConsoleLines([]);
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          setConsoleLines(prev => [...prev, lines[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
        }
      }, 350);

      return () => clearInterval(interval);
    } else {
      setConsoleLines([]);
    }
  }, [isCardHovered]);

  const codeLines = [
    { text: '// 🚀 The Codexa learning pipeline', type: 'comment' },
    { text: 'const learn = {', type: 'code' },
    { text: '  concept: "Understand the idea",', type: 'code' },
    { text: '  analogy: "Connect to what you know",', type: 'code' },
    { text: '  visualize: "See it come alive",', type: 'code' },
    { text: '  practice: "Write real code",', type: 'code' },
    { text: '  master: "Prove your knowledge"', type: 'code' },
    { text: '};', type: 'code' },
    { text: '', type: 'code' },
    { text: 'learn.start(); // → Begin your journey', type: 'action' }
  ];

  const renderHighlightedLine = (line) => {
    if (line.text === '') return '\u00A0';
    if (line.text.startsWith('//')) {
      return <span className="text-text-muted font-light">{line.text}</span>;
    }
    if (line.text.startsWith('const learn')) {
      return (
        <>
          <span className="text-[#c084fc]">const</span> <span className="text-[#67e8f9]">learn</span><span className="text-text"> = {'{'}</span>
        </>
      );
    }
    if (line.text.includes('concept:')) {
      return (
        <>
          <span className="text-text">  concept</span><span className="text-text-secondary">: </span><span className="text-[#a5f3fc]">"Understand the idea"</span><span className="text-text-secondary">,</span>
        </>
      );
    }
    if (line.text.includes('analogy:')) {
      return (
        <>
          <span className="text-text">  analogy</span><span className="text-text-secondary">: </span><span className="text-[#a5f3fc]">"Connect to what you know"</span><span className="text-text-secondary">,</span>
        </>
      );
    }
    if (line.text.includes('visualize:')) {
      return (
        <>
          <span className="text-text">  visualize</span><span className="text-text-secondary">: </span><span className="text-[#a5f3fc]">"See it come alive"</span><span className="text-text-secondary">,</span>
        </>
      );
    }
    if (line.text.includes('practice:')) {
      return (
        <>
          <span className="text-text">  practice</span><span className="text-text-secondary">: </span><span className="text-[#a5f3fc]">"Write real code"</span><span className="text-text-secondary">,</span>
        </>
      );
    }
    if (line.text.includes('master:')) {
      return (
        <>
          <span className="text-text">  master</span><span className="text-text-secondary">: </span><span className="text-[#a5f3fc]">"Prove your knowledge"</span>
        </>
      );
    }
    if (line.text === '};') {
      return <span className="text-text">{'};'}</span>;
    }
    if (line.text.startsWith('learn.start()')) {
      return (
        <>
          <span className="text-accent">learn</span><span className="text-text-secondary">.start(); </span><span className="text-text-muted font-light">// → Begin your journey</span>
        </>
      );
    }
    return <span className="text-text">{line.text}</span>;
  };

  return (
    <div className="perspective-1000 mx-auto mt-16 max-w-3xl sm:mt-20 w-full px-4 select-none">
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        onMouseEnter={handleCardMouseEnter}
        animate={{
          scale: isCardHovered ? 1.02 : 1,
          y: isCardHovered ? -6 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-xl border border-border bg-bg-card shadow-elevated transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.14),0_16px_32px_rgba(0,0,0,0.35)]"
      >
        {/* Glass Reflection Shine Sweep Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-20">
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-30"
            animate={{
              x: isCardHovered ? '50%' : '-50%',
              y: isCardHovered ? '50%' : '-50%',
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </div>

        {/* Editor title bar */}
        <div
          className="flex items-center gap-2 border-b border-border/60 bg-bg-card px-5 py-3 select-none"
          style={{ transform: shouldReduceMotion ? 'none' : 'translateZ(15px)' }}
        >
          <div className="flex gap-1.5 font-sans">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 font-mono text-xs text-text-muted">codexa.js</span>
          {isCardHovered && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-accent/80 animate-pulse bg-accent/5 px-2.5 py-0.5 rounded-full border border-accent/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              Running
            </span>
          )}
        </div>

        {/* Code content */}
        <div
          className="py-6 sm:py-8 bg-[#0b0b0d]"
          style={{ transform: shouldReduceMotion ? 'none' : 'translateZ(25px)' }}
        >
          <div className="flex flex-col font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
            {codeLines.map((line, idx) => {
              const isActive = activeLine === idx;
              return (
                <div
                  key={idx}
                  className={`relative flex items-center px-6 py-0.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-accent/[0.04] border-l-2 border-accent -ml-[2px]'
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  <span className="w-8 select-none text-text-muted text-right pr-4 text-xs font-light">
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">
                    {renderHighlightedLine(line)}
                  </span>
                  {isActive && idx === 9 && (
                    <span className="inline-block h-4 w-[2px] bg-accent ml-0.5 animate-pulse" />
                  )}
                  {isActive && (
                    <span className="absolute right-6 h-2 w-2 rounded-full bg-accent/40 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulated Run Console (Activity Indicator) */}
        <div
          className="border-t border-border/60 bg-bg/95 font-mono text-xs text-text-secondary select-none"
          style={{ transform: shouldReduceMotion ? 'none' : 'translateZ(10px)' }}
        >
          <div className="flex items-center gap-2 border-b border-border/30 px-6 py-2 bg-bg-card/50 text-[10px] text-text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${isCardHovered ? 'bg-success animate-pulse' : 'bg-text-muted'}`} />
            <span>TERMINAL</span>
            {isCardHovered && (
              <span className="ml-auto text-[9px] text-text-muted">codexa-repl-v1</span>
            )}
          </div>
          <div className="px-6 py-4 min-h-[110px] flex flex-col gap-1 text-[11px] leading-relaxed text-text-secondary text-left">
            {consoleLines.length === 0 ? (
              <div className="text-text-muted italic flex items-center gap-1.5 font-light">
                <span>Hover over card to execute pipeline…</span>
              </div>
            ) : (
              consoleLines.map((line, idx) => {
                const isCommand = line.startsWith('>');
                const isWarning = line.includes('⚡');
                return (
                  <div
                    key={idx}
                    className={`transition-opacity duration-300 ${
                      isCommand ? 'text-text-secondary font-medium' : isWarning ? 'text-accent' : 'text-success/90'
                    }`}
                  >
                    {line}
                  </div>
                );
              })
            )}
            {isCardHovered && consoleLines.length < 6 && (
              <div className="flex items-center gap-1 text-text-muted animate-pulse font-light">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>compiling…</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
