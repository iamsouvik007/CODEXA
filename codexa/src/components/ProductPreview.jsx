import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode2, BookOpen, CheckCircle2, Circle, ChevronRight,
  Bot, Send, Lightbulb, Eye, AlertTriangle
} from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer, useAutoCycle } from '../lib/animations';

const sidebarTopics = [
  { name: 'Variables & Types', completed: true },
  { name: 'Functions', completed: true },
  { name: 'Closures', completed: false, active: true },
  { name: 'Arrays & Methods', completed: false },
  { name: 'Objects', completed: false },
  { name: 'Async / Await', completed: false },
  { name: 'Error Handling', completed: false },
];

const lessonContent = {
  concept: `A closure is a function that remembers the variables from its outer scope, even after the outer function has finished running.`,
  analogy: `Think of a closure like a backpack. When a student (inner function) leaves the classroom (outer function), they carry their backpack with them — and that backpack contains notes (variables) from the class. Even after class is over, the student still has access to those notes.`,
  visual: [
    { label: 'Outer Function', desc: 'createCounter()', color: 'accent' },
    { label: 'Variable', desc: 'let count = 0', color: 'info' },
    { label: 'Inner Function', desc: 'return () => ++count', color: 'success' },
    { label: 'Closure Created', desc: 'count lives on', color: 'accent' },
  ],
  misconception: `"Closures create copies of variables" — Wrong! Closures hold references to the original variables, not copies. If the outer variable changes, the closure sees the updated value.`,
  code: `function createCounter() {
  let count = 0;       // ← captured
  return function() {
    count++;           // ← still accessible
    return count;
  };
}

const counter = createCounter();
counter();  // → 1
counter();  // → 2`,
};

const aiSuggestions = [
  'What happens if I call createCounter() twice?',
  'Can closures cause memory leaks?',
  'Show me a real-world closure example',
  'How do closures relate to React hooks?',
  'Explain closure scope chain step by step',
];

const tabs = ['lesson', 'code', 'ai'];

export default function ProductPreview() {
  const { ref, controls } = useScrollReveal(0.05);
  const { activeIndex: activeTabIndex, setManual: setActiveTab } = useAutoCycle(tabs.length, 5000);
  const { activeIndex: activeSidebarIndex, setManual: setSidebarItem } = useAutoCycle(sidebarTopics.length, 3000);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];

  // Cycle AI suggestions
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSuggestionIndex((prev) => (prev + 1) % aiSuggestions.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="demo" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionLabel>Product Preview</SectionLabel>
          <SectionHeading>See Codexa in action.</SectionHeading>
          <SectionDescription className="mx-auto">
            This is not a mockup. This is how you actually learn inside Codexa — an interactive workspace
            where concepts, visuals, code, and AI mentoring come together.
          </SectionDescription>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 sm:mt-16">
          {/* Product mockup container */}
          <div className="overflow-hidden rounded-xl border border-border bg-bg shadow-elevated">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-3 font-mono text-xs text-text-muted">Codexa — JavaScript Fundamentals</span>
              </div>
              <div className="hidden items-center gap-1 sm:flex">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={`rounded-md px-3 py-1 font-mono text-xs capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {tab === 'ai' ? 'AI Mentor' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[220px_1fr_280px]">
              {/* Sidebar - Topics */}
              <div className="hidden border-r border-border bg-bg-soft/50 lg:block">
                <div className="p-3">
                  <div className="mb-3 flex items-center gap-2 px-2">
                    <FileCode2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    <span className="text-xs font-medium text-text-secondary">JS Fundamentals</span>
                  </div>
                  <ul role="list" className="space-y-0.5">
                    {sidebarTopics.map((topic, i) => (
                      <li key={topic.name}>
                        <button
                          onClick={() => setSidebarItem(i)}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-all duration-300 ${
                            i === activeSidebarIndex
                              ? 'bg-accent/10 text-accent'
                              : topic.completed
                                ? 'text-text-secondary hover:bg-bg-card hover:text-text'
                                : 'text-text-secondary hover:bg-bg-card hover:text-text'
                          }`}
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                          ) : (
                            <Circle className={`h-3.5 w-3.5 shrink-0 ${i === activeSidebarIndex ? 'text-accent' : 'text-text-muted'}`} aria-hidden="true" />
                          )}
                          <span className="truncate">{topic.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Progress bar */}
                  <div className="mt-4 px-2">
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>Progress</span>
                      <span>29%</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg-elevated">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: '29%' }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Lesson content */}
              <div className="overflow-y-auto border-r border-border p-5 sm:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'lesson' && (
                    <motion.div
                      key="lesson"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">Lesson 3</span>
                        <ChevronRight className="h-3 w-3 text-text-muted" aria-hidden="true" />
                        <span className="text-xs text-text-muted">JavaScript Fundamentals</span>
                      </div>
                      <h3 className="font-heading mb-5 text-xl font-semibold tracking-tight text-text sm:text-2xl">Closures</h3>

                      {/* Concept */}
                      <div className="mb-6">
                        <div className="mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
                          <span className="text-sm font-medium text-text">Concept</span>
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">{lessonContent.concept}</p>
                      </div>

                      {/* Real-life analogy */}
                      <div className="mb-6 rounded-lg border border-accent/20 bg-accent-bg p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-accent" aria-hidden="true" />
                          <span className="text-sm font-medium text-accent">Real-Life Analogy</span>
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">{lessonContent.analogy}</p>
                      </div>

                      {/* Visual explanation */}
                      <div className="mb-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-info" aria-hidden="true" />
                          <span className="text-sm font-medium text-text">Visual Explanation</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {lessonContent.visual.map((step, i) => (
                            <motion.div
                              key={step.label}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i, duration: 0.3 }}
                              className="flex items-center gap-3"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg-elevated text-xs font-mono font-medium text-text-muted">
                                {i + 1}
                              </div>
                              <div className="flex-1 rounded-md border border-border-soft bg-bg-card px-3 py-2">
                                <span className="text-xs font-medium text-text">{step.label}</span>
                                <span className="ml-2 font-mono text-xs text-text-muted">{step.desc}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Misconception */}
                      <div className="rounded-lg border border-warning/20 bg-warning-soft p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
                          <span className="text-sm font-medium text-warning">Common Misconception</span>
                        </div>
                        <p className="text-sm leading-relaxed text-text-secondary">{lessonContent.misconception}</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'code' && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="font-heading mb-4 text-lg font-semibold text-text">Interactive Code Editor</h3>
                      <div className="overflow-hidden rounded-lg border border-border bg-[#0d0d0f]">
                        <div className="flex items-center justify-between border-b border-border px-4 py-2">
                          <span className="font-mono text-xs text-text-muted">closures.js</span>
                          <button className="rounded-md bg-accent/10 px-3 py-1 font-mono text-xs text-accent transition-colors hover:bg-accent/20">
                            ▶ Run
                          </button>
                        </div>
                        <pre className="p-4 font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
                          <code>{lessonContent.code}</code>
                        </pre>
                      </div>
                      <div className="mt-3 rounded-lg border border-border bg-[#0d0d0f] p-4">
                        <div className="mb-2 font-mono text-xs text-text-muted">Output:</div>
                        <div className="font-mono text-sm text-success">{'→ 1\n→ 2'}</div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'ai' && (
                    <motion.div
                      key="ai-main"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="font-heading mb-4 text-lg font-semibold text-text">AI Mentor Chat</h3>
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-lg rounded-br-sm bg-accent/10 px-4 py-3 text-sm text-text">
                            Why does count persist after createCounter finishes?
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                            <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
                          </div>
                          <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-bg-card px-4 py-3 text-sm leading-relaxed text-text-secondary">
                            <p>Great question! When createCounter() runs, it creates a local variable <code className="rounded bg-bg-elevated px-1 py-0.5 text-xs text-text">count</code>.</p>
                            <p className="mt-2">The returned inner function still references <code className="rounded bg-bg-elevated px-1 py-0.5 text-xs text-text">count</code>. JavaScript&apos;s engine sees this and keeps it alive — this is the closure.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right sidebar - AI Mentor */}
              <div className="hidden flex-col bg-bg-soft/50 lg:flex">
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span className="text-sm font-medium text-text">AI Mentor</span>
                    <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">Online</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <p className="mb-4 text-xs text-text-muted">Suggested questions about Closures:</p>
                  <div className="space-y-2">
                    {aiSuggestions.map((q, i) => (
                      <button
                        key={i}
                        className={`block w-full rounded-lg border p-2.5 text-left text-xs transition-all duration-300 ${
                          i === activeSuggestionIndex
                            ? 'border-accent/30 bg-accent-bg text-accent'
                            : 'border-border-soft bg-bg-card text-text-secondary hover:border-accent/30 hover:text-text'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border p-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2">
                    <input
                      type="text"
                      placeholder="Ask about closures…"
                      className="flex-1 bg-transparent text-xs text-text placeholder:text-text-muted outline-none"
                      aria-label="Ask AI mentor a question"
                      readOnly
                    />
                    <Send className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="mt-4 flex justify-center gap-2 sm:hidden">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`rounded-pill px-4 py-2 text-xs font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-accent text-white'
                    : 'bg-bg-card text-text-secondary'
                }`}
              >
                {tab === 'ai' ? 'AI Mentor' : tab}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
