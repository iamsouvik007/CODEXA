import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minus, Send, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { useAITutor } from '../lib/AITutorContext';

const placeholderMessages = [
  {
    role: 'ai',
    text: "Hi! I'm your Codexa AI Tutor. I can help you understand programming concepts, debug code, or explain anything you're learning. Ask me anything!",
  },
];

const suggestedPrompts = [
  'Explain closures in JavaScript',
  'What is the difference between let and const?',
  'How does async/await work?',
  'Help me understand React hooks',
];

export default function AITutor() {
  const { isOpen, isMinimized, close, minimize, restore } = useAITutor();
  const [messages] = useState(placeholderMessages);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 380, h: 520 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef(null);
  const panelRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Initialize position to bottom-right
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
    if (e.target.closest('button') || e.target.closest('input')) return;
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
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.w, dragStartRef.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - size.h, dragStartRef.current.posY + dy)),
      });
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
      setSize({
        w: Math.max(320, Math.min(600, resizeStartRef.current.w + dw)),
        h: Math.max(400, Math.min(700, resizeStartRef.current.h + dh)),
      });
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

  if (!isOpen) return null;

  // Minimized state — small floating pill
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={restore}
        className="fixed right-6 bottom-6 z-[55] flex items-center gap-2 rounded-pill border border-accent/30 bg-bg-card px-4 py-3 shadow-elevated transition-all hover:border-accent/50 hover:shadow-modal"
        aria-label="Restore AI Tutor"
      >
        <Bot className="h-5 w-5 text-accent" aria-hidden="true" />
        <span className="text-sm font-medium text-text">AI Tutor</span>
        <span className="flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed z-[55] flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card shadow-modal"
        style={{
          left: position.x,
          top: position.y,
          width: size.w,
          height: size.h,
          cursor: isDragging ? 'grabbing' : 'auto',
        }}
        role="complementary"
        aria-label="AI Tutor chatbot"
      >
        {/* Header — draggable */}
        <div
          ref={dragRef}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          className="flex shrink-0 items-center justify-between border-b border-border bg-bg-soft px-4 py-3"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex items-center gap-2.5">
            <GripVertical className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-medium text-text">AI Tutor</span>
              <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={minimize}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
              aria-label="Minimize"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={close}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
              aria-label="Close AI Tutor"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <Bot className="h-4 w-4 text-accent" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-accent/10 text-text'
                      : 'rounded-tl-sm bg-bg-soft text-text-secondary'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested prompts */}
          <div className="mt-4">
            <p className="mb-2 text-xs text-text-muted">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="rounded-md border border-border-soft bg-bg-elevated px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-text"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your tutor…"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
              aria-label="Ask AI tutor a question"
            />
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-accent"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-text-muted">
            Powered by NVIDIA NIM · Coming Soon
          </p>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
          className="absolute right-0 bottom-0 h-5 w-5 cursor-se-resize"
          aria-hidden="true"
        >
          <svg width="10" height="10" className="absolute right-1 bottom-1 text-text-muted/40" viewBox="0 0 10 10">
            <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
