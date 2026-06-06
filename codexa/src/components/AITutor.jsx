import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minus, Send, GripVertical, AlertCircle, Compass, HelpCircle } from 'lucide-react';
import { useAITutor } from '../lib/AITutorContext';
import { useProgress } from '../lib/ProgressContext';
import { getLessonById } from '../lib/lessonData';

const initialMessages = [
  {
    role: 'ai',
    text: "Hi! I'm your Codexa AI Tutor. I know everything about your current lesson, code editor, and quiz state. Ask me anything or select a suggested doubt below!",
  },
];

// Rich context-aware answers based on active lesson
const aiKnowledgeBase = {
  '1': {
    analogy: "JavaScript is like the nervous system of a house. HTML is the concrete foundation, CSS is the wall paint, but JavaScript is the wiring that lets you flick a switch and turn on the lights or open the garage door dynamically.",
    debug: "Your syntax looks solid. Remember, JavaScript is case-sensitive! Make sure `console.log()` is typed in all lowercase, otherwise the engine will throw a ReferenceError.",
    practice: "Try writing a program that prints your name and your favorite programming language to the console using two separate `console.log()` statements.",
    summary: "Lesson 1 covers why JavaScript was invented (as a lightweight 'glue' language for web design), its historic 10-day scramble in 1995, and how it outlived Java applets because it runs natively in the browser without plugins.",
    explain: "In JavaScript, statements are executed in order. The `console.log()` method is a built-in function that takes an input and writes it directly to the system's output console.",
    interview: "Q: What is the difference between Java and JavaScript?\n\nAnswer: Java and JavaScript are entirely unrelated. Java is a compiled, statically typed class-based language running in a VM, while JavaScript is an interpreted, lightweight, dynamically typed scripting language running natively in browsers."
  },
  '2': {
    analogy: "Think of variables like storage cups with labels taped on them. A primitive type (like a number) fits directly inside the cup. An object type (like an array) is too big to fit inside the cup, so the cup just holds a paper slip with the address of where that object is stored in a larger warehouse.",
    debug: "Make sure you don't re-declare a let variable in the same scope, like this:\n`let age = 20; let age = 21;` // SyntaxError. Instead, use: `age = 21;` without the let keyword.",
    practice: "Practice declaring a variable using `const` that stores your birth year. Then try to assign a new value to it and observe the error in your console.",
    summary: "Lesson 2 details primitive types (number, string, boolean, undefined, null, symbol, bigint) which are copied by value, and object types which are copied by reference. It also explains variable scopes.",
    explain: "Primitive values are stored directly on the Stack. Objects, being dynamic in size, are stored on the Heap, and variables store a pointer address referring to that heap location.",
    interview: "Q: What is the Temporal Dead Zone (TDZ)?\n\nAnswer: TDZ is the period of time from the start of a block until a `let` or `const` variable is declared. Accessing the variable during this window throws a ReferenceError."
  },
  '3': {
    analogy: "Think of operators like gears or conveyor belts in a factory. You place inputs (operands) on the belt, the operator gear spins (performs math or comparison), and a new output drops off the end.",
    debug: "Common bug: using loose equality `==` which coerces types. Always prefer strict equality `===` which checks both value and type without silent coercion.",
    practice: "Write an expression that checks if a number variable is even and positive using mathematical and logical operators. Hint: `num % 2 === 0 && num > 0`.",
    summary: "Lesson 3 explains operators: arithmetic (+, -, *, /, %, ++), comparisons (==, ===, !=, !==), and logical short-circuiting (&&, ||, !).",
    explain: "Short-circuiting means logical expressions evaluate from left to right. In `A && B`, if A is false, B is skipped. In `A || B`, if A is true, B is skipped.",
    interview: "Q: Why is `typeof null` returned as 'object'?\n\nAnswer: This is a legacy bug from the first version of JavaScript. Values were stored in 32-bit units with type tags. The tag for objects was 000, and null was represented as the NULL pointer (all 0s), leading `typeof` to mistakenly classify null as an object."
  },
  '4': {
    analogy: "A loop is like a carousel ride. The ticket booth checker checks if you still have remaining rides (loop condition). If yes, the carousel spins once (loop iteration). If no, you exit the ride.",
    debug: "Beware of infinite loops! If your loop condition never evaluates to false (e.g. you forgot to increment the counter), the loop will run forever and freeze the browser tab.",
    practice: "Write a for loop that calculates the sum of all numbers from 1 to 10 and prints the final result.",
    summary: "Lesson 4 teaches control flow structures: `if/else` branching, `switch` blocks, `while` loops, and `for` loop cycles.",
    explain: "A `for` loop combines three parts: initialization (`let i = 0`), condition (`i < limit`), and increment/decrement (`i++`). The loop runs body statements as long as the condition evaluates to truthy.",
    interview: "Q: What is the difference between `break` and `continue`?\n\nAnswer: `break` immediately terminates the loop and control passes to the statement following the loop. `continue` terminates the current iteration only, skipping remaining statements in the body, and jumps directly to the next iteration check."
  }
};

export default function AITutor() {
  const { isOpen, isMinimized, open, close, minimize, restore } = useAITutor();
  const { progress } = useProgress();
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 380, h: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const scrollRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const activeLessonId = progress.currentLesson || '3';
  const activeLesson = getLessonById(activeLessonId);

  // Suggested prompt list for this lesson
  const suggestedPrompts = [
    { label: 'Explain Concept', type: 'explain' },
    { label: 'Give Analogy', type: 'analogy' },
    { label: 'Summarize Lesson', type: 'summary' },
    { label: 'Interview Prep', type: 'interview' },
    { label: 'Practice Question', type: 'practice' },
    { label: 'Debug Help', type: 'debug' }
  ];

  // Auto scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle position initialization
  useEffect(() => {
    if (isOpen && position.x === 0 && position.y === 0) {
      setPosition({
        x: window.innerWidth - size.w - 24,
        y: window.innerHeight - size.h - 24,
      });
    }
  }, [isOpen, position.x, position.y, size.w, size.h]);

  // Drag handlers
  const onDragStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY, posX: position.x, posY: position.y };
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      
      const newX = Math.max(0, Math.min(window.innerWidth - size.w, dragStartRef.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - size.h, dragStartRef.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, size.w, size.h]);

  // Resize handlers
  const onResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = { x: clientX, y: clientY, w: size.w, h: size.h };
    setIsResizing(true);
  }, [size]);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dw = clientX - resizeStartRef.current.x;
      const dh = clientY - resizeStartRef.current.y;
      
      const newW = Math.max(320, Math.min(600, resizeStartRef.current.w + dw));
      const newH = Math.max(380, Math.min(700, resizeStartRef.current.h + dh));
      setSize({ w: newW, h: newH });
    };
    const onUp = () => setIsResizing(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isResizing]);

  const handleSend = useCallback((text) => {
    const textToSend = text || inputValue;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInputValue('');
    setIsTyping(true);

    // Context-aware query evaluation
    let responseText = "I know you are studying " + (activeLesson?.title || 'JavaScript') + ". However, I'm currently working offline. Ask me to explain the concept, provide an analogy, or generate practice questions!";
    const normText = textToSend.toLowerCase();

    const lessonKb = aiKnowledgeBase[activeLessonId] || aiKnowledgeBase['3'];

    if (normText.includes('analogy') || normText.includes('backpack') || normText.includes('train')) {
      responseText = lessonKb.analogy;
    } else if (normText.includes('debug') || normText.includes('error') || normText.includes('bug')) {
      responseText = lessonKb.debug;
    } else if (normText.includes('practice') || normText.includes('exercise') || normText.includes('challenge')) {
      responseText = lessonKb.practice;
    } else if (normText.includes('summar') || normText.includes('takeaway') || normText.includes('short')) {
      responseText = lessonKb.summary;
    } else if (normText.includes('explain') || normText.includes('concept') || normText.includes('how')) {
      responseText = lessonKb.explain;
    } else if (normText.includes('interview') || normText.includes('question') || normText.includes('prep')) {
      responseText = lessonKb.interview;
    } else {
      // General fallbacks based on keyword matches
      if (normText.includes('variable') || normText.includes('data type') || normText.includes('primitive')) {
        responseText = aiKnowledgeBase['2'].explain;
      } else if (normText.includes('closure')) {
        responseText = "A closure is when an inner function retains access to its lexical outer scope even after the outer function has returned. It carries its outer variables in a 'backpack' wherever it goes.";
      } else if (normText.includes('loop') || normText.includes('control flow') || normText.includes('if')) {
        responseText = aiKnowledgeBase['4'].explain;
      } else if (normText.includes('operator') || normText.includes('expression')) {
        responseText = aiKnowledgeBase['3'].explain;
      }
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    }, 1200);
  }, [inputValue, activeLessonId, activeLesson]);

  // RENDER FLOATING ROBOT LAUNCHER
  if (!isOpen || isMinimized) {
    return (
      <motion.button
        layoutId="ai-tutor-window"
        onClick={open}
        className="fixed right-6 bottom-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-[#0f0a07] text-accent cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 active:scale-95 group"
        aria-label="Ask AI Tutor"
      >
        <Bot className="h-6 w-6" />
        {/* Pulsing glow aura */}
        <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-25 pointer-events-none" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white shadow-md animate-bounce">
          AI
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        layoutId="ai-tutor-window"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed z-[55] flex flex-col overflow-hidden rounded-xl border border-border bg-[#0b0b0d] shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        style={{
          left: position.x,
          top: position.y,
          width: size.w,
          height: size.h,
          cursor: isDragging ? 'grabbing' : 'auto',
        }}
        role="dialog"
        aria-label="AI Tutor interface"
      >
        {/* Header (Draggable) */}
        <div
          ref={dragRef}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          className="flex shrink-0 items-center justify-between border-b border-border/60 bg-[#090a0d] px-4 py-3"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-3.5 w-3.5 text-text-muted select-none" />
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Bot className="h-4.5 w-4.5 text-accent" />
            </div>
            <div>
              <span className="text-xs font-bold text-text">AI Mentor</span>
              <span className="ml-2 rounded-full bg-success/15 border border-success/30 px-2 py-0.2 text-[8px] uppercase font-bold tracking-wider text-success animate-pulse">
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={minimize}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text cursor-pointer"
              aria-label="Minimize chatbot window"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={close}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text cursor-pointer"
              aria-label="Close chatbot window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Lesson Banner */}
        <div className="bg-bg-soft/40 px-4 py-2 border-b border-border/50 flex items-center justify-between text-[10px] text-text-muted font-semibold">
          <span className="truncate">Context: {activeLesson?.title || 'JavaScript fundamentals'}</span>
          <span className="text-accent shrink-0 font-mono">JS L{activeLessonId}</span>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 border border-accent/25 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-accent" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-tr-none bg-accent/10 border border-accent/20 text-text'
                    : 'rounded-tl-none bg-bg-card border border-border/40 text-text-secondary whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 border border-accent/25 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="rounded-xl px-4 py-2.5 bg-bg-card border border-border/40 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Doubts */}
        <div className="bg-[#090a0d] p-3 border-t border-border/50">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-2">Suggested Doubts:</span>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  const lessonKb = aiKnowledgeBase[activeLessonId] || aiKnowledgeBase['3'];
                  let query = '';
                  switch (prompt.type) {
                    case 'explain': query = `Explain ${activeLesson?.title || 'this concept'} dynamically.`; break;
                    case 'analogy': query = `Give me a real-world analogy for ${activeLesson?.title || 'this concept'}.`; break;
                    case 'summary': query = `Summarize this lesson for quick revision.`; break;
                    case 'interview': query = `Give me an interview question about this lesson.`; break;
                    case 'practice': query = `Generate a practice coding challenge for me.`; break;
                    case 'debug': query = `How do I debug syntax errors or reference issues in this code?`; break;
                  }
                  handleSend(query);
                }}
                className="rounded-md border border-border bg-bg-input px-2.5 py-1 text-[10px] text-text-secondary transition-colors hover:border-accent/40 hover:text-text hover:bg-accent/5 cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="shrink-0 border-t border-border/60 bg-[#08080a] p-3 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI Mentor a doubt..."
            className="flex-1 rounded-lg border border-border bg-bg-input px-3.5 py-2 text-xs text-text placeholder:text-text-muted outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-deep active:scale-95 transition-all cursor-pointer"
            aria-label="Submit query"
          >
            <SendIcon className="h-4.5 w-4.5" />
          </button>
        </form>

        {/* Resizer control */}
        <div
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
          className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize flex items-end justify-end p-0.5"
          aria-hidden="true"
        >
          <svg width="8" height="8" className="text-text-muted/40" viewBox="0 0 10 10">
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple Send icon
function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
