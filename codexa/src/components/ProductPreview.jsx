import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Terminal, Award, Bot, FileText, CheckCircle2, Circle, ChevronDown, 
  ChevronRight, Lock, Play, Sparkles, Send, HelpCircle, AlertTriangle, Lightbulb, Code2, Clipboard, ArrowRight
} from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';

export default function ProductPreview() {
  const [activeView, setActiveView] = useState('lesson'); // 'lesson' | 'code' | 'quiz' | 'ai'
  const views = ['lesson', 'code', 'quiz', 'ai'];

  // Auto-rotating showcase cycle (every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveView(current => {
        const nextIdx = (views.indexOf(current) + 1) % views.length;
        return views[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleViewSelect = (view) => {
    setActiveView(view);
  };

  // View configurations for tab header selectors
  const viewSelectorItems = [
    { id: 'lesson', label: 'Interactive Lesson', icon: BookOpen, desc: 'Visual Concepts & Analogies' },
    { id: 'code', label: 'Code Playground', icon: Terminal, desc: 'Write & Execute Real Code' },
    { id: 'quiz', label: 'Quiz Experience', icon: Award, desc: 'Interactive Challenges & XP' },
    { id: 'ai', label: 'Floating AI Tutor', icon: Bot, desc: 'Lesson-Aware Mentoring' }
  ];

  return (
    <section id="demo" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      {/* Outer Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.02] blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center">
          <SectionLabel>Product Preview</SectionLabel>
          <SectionHeading>See Codexa in Action</SectionHeading>
          <SectionDescription className="mx-auto">
            Experience the actual Codexa interface. See how we blend conceptual structures, live workspaces, active quizzes, and a floating AI mentor.
          </SectionDescription>
        </div>

        {/* View Selectors Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
          {viewSelectorItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleViewSelect(item.id)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    : 'border-border bg-bg-card hover:border-border-strong hover:bg-bg-elevated/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-accent/10 text-accent' : 'bg-bg-elevated text-text-muted'}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-text' : 'text-text-secondary'}`}>{item.label}</span>
                </div>
                <span className="text-[10px] text-text-muted mt-2 block">{item.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup Display Window Container */}
        <div className="mt-8 relative rounded-xl border border-border bg-[#08080a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Simulated Browser Header / Title Bar */}
          <div className="flex items-center justify-between border-b border-border bg-[#0a0a0d] px-4 py-3 select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="ml-3 font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Codexa — Interactive Platform Demo
              </span>
            </div>
            
            {/* Top Workspace Tab Indicators */}
            <div className="flex items-center gap-1.5 bg-[#141419] border border-border/40 rounded-lg p-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
              <span className={`px-2 py-1 rounded ${activeView === 'lesson' || activeView === 'ai' ? 'bg-accent/15 text-accent font-semibold' : ''}`}>Lesson</span>
              <span className={`px-2 py-1 rounded ${activeView === 'code' ? 'bg-accent/15 text-accent font-semibold' : ''}`}>Practice</span>
              <span className={`px-2 py-1 rounded ${activeView === 'quiz' ? 'bg-accent/15 text-accent font-semibold' : ''}`}>Quiz</span>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-[500px]">
            
            {/* 1. Left Sidebar Mockup (Matches Curriculum Explorer) */}
            <div className="hidden lg:flex flex-col border-r border-border bg-[#0a0a0c] p-3 select-none">
              
              {/* Sidebar Header Progress */}
              <div className="mb-4 border-b border-border/50 pb-3">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  <span>JavaScript Progress</span>
                  <span className="text-accent">75%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Sidebar Modules explorer tree */}
              <div className="space-y-3 flex-1 text-xs">
                {/* HTML (locked) */}
                <div className="flex items-center gap-2 text-text-muted/60 px-1.5 py-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>HTML (Coming Soon)</span>
                </div>

                {/* CSS (locked) */}
                <div className="flex items-center gap-2 text-text-muted/60 px-1.5 py-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>CSS (Coming Soon)</span>
                </div>

                {/* JavaScript (Active) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-text-secondary font-bold px-1.5 py-1 bg-bg-card/40 rounded">
                    <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
                    <span>JavaScript Track</span>
                  </div>
                  
                  {/* Module: Fundamentals */}
                  <div className="pl-3 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-text-secondary font-semibold py-0.5">
                      <ChevronDown className="h-3 w-3 text-text-muted" />
                      <span>Fundamentals</span>
                    </div>

                    {/* Lesson rows */}
                    <div className="pl-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 text-text-muted/60">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        <span className="truncate">L1: Introduction</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-muted/60">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        <span className="truncate">L2: Variables</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent font-semibold bg-accent/10 border-l border-accent rounded-r px-1.5 py-0.5">
                        <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                        <span className="truncate">L3: Operators</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-muted">
                        <Circle className="h-3 w-3 shrink-0 text-text-muted" />
                        <span className="truncate">L4: Loops</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Middle Content Pane (Interactive Showcase) */}
            <div className="p-5 sm:p-8 relative bg-[#08080a] flex flex-col justify-between overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* VIEW 1: INTERACTIVE LESSON */}
                {activeView === 'lesson' && (
                  <motion.div
                    key="lesson-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex-1"
                  >
                    {/* Header meta */}
                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-semibold">
                      <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded">L3</span>
                      <span>Learn &gt; JS Track &gt; Module 1</span>
                    </div>
                    <h2 className="text-lg font-bold text-text font-heading">Lesson 03 - Operators & Expressions</h2>

                    {/* Concept card */}
                    <div className="rounded-lg border border-border bg-[#0d0d0f] p-4 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold text-text">Strict vs Loose Equality</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-text-secondary">
                        JavaScript has two ways to check equality: <code className="bg-bg-elevated px-1 py-0.2 rounded text-[10px] text-accent">==</code> (loose equality) and <code className="bg-bg-elevated px-1 py-0.2 rounded text-[10px] text-accent">===</code> (strict equality). Loose equality tries to force types to match (coercion) before comparing, which can lead to unexpected bugs.
                      </p>
                    </div>

                    {/* Analogy card */}
                    <div className="rounded-lg border border-accent/20 bg-accent-bg/40 p-4 text-left shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-accent animate-pulse" />
                        <span className="text-xs font-bold text-accent">Real-World Analogy</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-text-secondary">
                        Loose equality <code className="text-accent font-semibold">==</code> is like a nightclub bouncer who only checks if you have a ticket, even if it is printed on a tissue paper. Strict equality <code className="text-accent font-semibold">===</code> checks if you have a ticket AND checks if your ID is valid and authentic.
                      </p>
                    </div>

                    {/* Visual cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="rounded-lg border border-border bg-[#0b0b0d] p-3 text-[10px]">
                        <span className="text-text-muted uppercase font-bold tracking-wider block mb-1">Loose Equality:</span>
                        <div className="font-mono text-xs text-text mb-1">5 == "5" // true</div>
                        <span className="text-text-secondary">JavaScript implicitly converts the string "5" into the number 5, returning true.</span>
                      </div>
                      <div className="rounded-lg border border-border bg-[#0b0b0d] p-3 text-[10px]">
                        <span className="text-text-muted uppercase font-bold tracking-wider block mb-1">Strict Equality:</span>
                        <div className="font-mono text-xs text-accent mb-1">5 === "5" // false</div>
                        <span className="text-text-secondary">Checks both value AND type. Since number does not equal string, it returns false.</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 2: CODE PLAYGROUND */}
                {activeView === 'code' && (
                  <motion.div
                    key="code-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex-1 flex flex-col justify-between"
                  >
                    <h3 className="text-xs font-bold text-text uppercase tracking-wider text-left">Interactive Sandbox</h3>
                    
                    {/* Simulated Monaco Editor */}
                    <div className="rounded-lg border border-border bg-[#0d0d0f] overflow-hidden text-left flex-1 flex flex-col shadow-card">
                      <div className="flex items-center justify-between border-b border-border bg-[#090a0d] px-3 py-1.5">
                        <span className="font-mono text-[10px] text-text-muted">equality.js</span>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[8px] font-bold text-accent uppercase">
                          Vite JS Sandbox
                        </span>
                      </div>
                      
                      {/* Code Area */}
                      <div className="p-4 font-mono text-[11px] leading-relaxed flex-1 bg-black/30">
                        <div className="flex gap-2">
                          <span className="text-text-muted/30 select-none">1</span>
                          <span><span className="text-[#c084fc]">const</span> speed = <span className="text-[#fdba74]">100</span>;</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-text-muted/30 select-none">2</span>
                          <span><span className="text-[#c084fc]">const</span> limit = <span className="text-[#a5f3fc]">"100"</span>;</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-text-muted/30 select-none">3</span>
                          <span></span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-text-muted/30 select-none">4</span>
                          <span><span className="text-[#67e8f9]">console</span>.<span className="text-[#4ade80]">log</span>(speed == limit); <span className="text-text-muted/50">// → true</span></span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-text-muted/30 select-none">5</span>
                          <span><span className="text-[#67e8f9]">console</span>.<span className="text-[#4ade80]">log</span>(speed === limit); <span className="text-text-muted/50">// → false</span></span>
                        </div>
                      </div>

                      {/* Run Action Panel */}
                      <div className="bg-[#08080a] px-3 py-2 border-t border-border flex justify-end">
                        <button className="flex items-center gap-1.5 bg-accent hover:bg-accent-deep text-white px-4 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider shadow-md shadow-accent/15">
                          <Play className="h-3 w-3 fill-white" />
                          Run Code
                        </button>
                      </div>
                    </div>

                    {/* Output log */}
                    <div className="rounded-lg border border-border bg-[#050507] p-3 text-left">
                      <div className="font-mono text-[9px] text-text-muted mb-1">TERMINAL CONSOLE OUTPUT</div>
                      <div className="font-mono text-xs text-emerald-400">
                        <div>&gt; [1] true</div>
                        <div>&gt; [2] false</div>
                        <div className="text-[10px] text-text-muted mt-1 italic">✓ Program execution completed (20ms)</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 3: QUIZ EXPERIENCE */}
                {activeView === 'quiz' && (
                  <motion.div
                    key="quiz-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header metadata */}
                      <div className="flex justify-between items-center text-[10px] text-text-muted font-semibold select-none">
                        <span>QUESTION 2 OF 4</span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          +100 XP REWARD
                        </span>
                      </div>
                      <div className="h-1 w-full bg-bg-elevated rounded-full overflow-hidden mt-1.5">
                        <div className="h-full bg-gradient-to-r from-accent to-amber-500" style={{ width: '50%' }} />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="my-2 text-left">
                      <h3 className="text-sm font-semibold text-text leading-snug">
                        Which comparison operator checks both value and type equality without implicit coercion in JavaScript?
                      </h3>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 text-left flex-1">
                      <div className="rounded-lg border border-border bg-bg-card p-3 text-xs text-text-secondary hover:border-border-strong cursor-pointer">
                        <span className="font-bold text-text-muted mr-2">A.</span>
                        <code>==</code>
                      </div>
                      <div className="rounded-lg border-2 border-success bg-success/5 p-3 text-xs text-success font-semibold flex items-center justify-between shadow-[0_0_15px_rgba(39,201,63,0.1)]">
                        <div>
                          <span className="font-bold mr-2 text-success">B.</span>
                          <code>===</code>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <div className="rounded-lg border border-border bg-bg-card p-3 text-xs text-text-secondary hover:border-border-strong cursor-pointer">
                        <span className="font-bold text-text-muted mr-2">C.</span>
                        <code>=</code>
                      </div>
                    </div>

                    {/* Completion Flow Button */}
                    <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-success py-2.5 text-xs font-semibold text-white transition-all shadow-md shadow-success/15 active:scale-98">
                      Correct! Next Question
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* VIEW 4: AI TUTOR */}
                {activeView === 'ai' && (
                  <motion.div
                    key="ai-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex-1 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Underlying Workspace mock (dimmed background) */}
                    <div className="opacity-15 pointer-events-none select-none text-left space-y-4">
                      <div className="flex items-center gap-2 text-[10px] text-text-muted font-semibold">
                        <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded">L3</span>
                        <span>Learn &gt; JS Track</span>
                      </div>
                      <h2 className="text-lg font-bold text-text">Lesson 03 - Operators & Expressions</h2>
                      <div className="rounded-lg border border-border bg-[#0d0d0f] p-4 text-[11px] leading-relaxed text-text-secondary">
                        JavaScript has two ways to check equality: == (loose) and === (strict). Loose equality tries to force types to match...
                      </div>
                    </div>

                    {/* OVERLAID AI CHAT WINDOW (Floating popup popup mockup) */}
                    <div className="absolute inset-x-0 top-0 bottom-0 z-10 flex flex-col rounded-xl border border-border bg-[#0b0b0e] shadow-[0_12px_45px_rgba(0,0,0,0.7)] overflow-hidden text-left">
                      {/* Window Header */}
                      <div className="flex items-center justify-between border-b border-border bg-[#090a0d] px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <Bot className="h-4 w-4 text-accent" />
                          <span className="text-[10px] font-bold text-text">AI Mentor</span>
                          <span className="rounded-full bg-success/10 border border-success/30 px-1.5 py-0.2 text-[8px] text-success animate-pulse uppercase font-semibold">
                            Online
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-bg-elevated" />
                          <span className="h-2 w-2 rounded-full bg-bg-elevated" />
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[11px] leading-relaxed scrollbar-none">
                        {/* User Question */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-lg rounded-br-none bg-accent/10 border border-accent/20 px-3.5 py-2.5 text-text">
                            When should I use strict equality?
                          </div>
                        </div>

                        {/* AI Tutor Response */}
                        <div className="flex gap-2">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mt-0.5">
                            <Bot className="h-3 w-3 text-accent" />
                          </div>
                          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-bg-card border border-border px-3.5 py-2.5 text-text-secondary space-y-2">
                            <p>
                              Always prefer strict equality <code className="text-accent font-semibold">===</code>! It checks both **value** and **type** without performing type conversion.
                            </p>
                            <p>
                              This stops JavaScript from evaluating things like <code className="bg-bg-elevated text-xs px-1.5 rounded font-mono font-semibold">false == 0</code> or <code className="bg-bg-elevated text-xs px-1.5 rounded font-mono font-semibold">"" == 0</code> as true, eliminating silent type-coercion bugs.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action prompts row */}
                      <div className="bg-[#090a0d] py-1.5 px-3 border-t border-border/50 select-none">
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                          <span className="rounded border border-border bg-bg-input px-2 py-0.5 text-[8px] font-medium text-text-secondary shrink-0">
                            Explain Code
                          </span>
                          <span className="rounded border border-border bg-bg-input px-2 py-0.5 text-[8px] font-medium text-text-secondary shrink-0">
                            Generate Quiz
                          </span>
                          <span className="rounded border border-border bg-bg-input px-2 py-0.5 text-[8px] font-medium text-text-secondary shrink-0">
                            Practice Questions
                          </span>
                        </div>
                      </div>

                      {/* Input form */}
                      <div className="border-t border-border bg-[#08080a] p-2 flex gap-1.5">
                        <div className="flex-1 rounded border border-border bg-bg-input px-2.5 py-1.5 text-[10px] text-text-muted flex items-center justify-between">
                          <span>Ask AI Mentor a doubt...</span>
                          <Send className="h-3 w-3 text-text-muted" />
                        </div>
                      </div>
                    </div>

                    {/* Floating Assistant launcher at the bottom right */}
                    <div className="absolute right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-[#0f0a07] text-accent shadow-[0_0_15px_rgba(249,115,22,0.35)] animate-bounce select-none">
                      <Bot className="h-5 w-5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
