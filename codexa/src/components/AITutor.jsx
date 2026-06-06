import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Minus, Send, GripVertical, AlertCircle, Eye, EyeOff, 
  Check, Copy, ArrowRight, ArrowLeft, Key, Settings, Maximize2, Minimize2, Bookmark, HelpCircle
} from 'lucide-react';
import { useAITutor } from '../lib/AITutorContext';
import { useProgress } from '../lib/ProgressContext';
import { getLessonById } from '../lib/lessonData';
import { validateKeyFormat, testConnection, callAIProvider } from '../lib/aiClient';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import cpp from 'highlight.js/lib/languages/cpp';

// Register hljs languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('cpp', cpp);

const initialMessages = [
  {
    role: 'ai',
    text: "Hi! I'm your Codexa AI Tutor. I know everything about your current lesson, code editor, and quiz state. Ask me anything or click a quick action below!",
  },
];

// Helper to parse message contents into paragraphs vs code blocks
function parseMessageContent(text) {
  if (!text) return [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push({ type: 'text', content: textBefore });
    }
    parts.push({ type: 'code', language: match[1] || 'javascript', content: match[2] });
    lastIndex = regex.lastIndex;
  }

  const textAfter = text.substring(lastIndex);
  if (textAfter) {
    parts.push({ type: 'text', content: textAfter });
  }

  if (parts.length === 0 && text) {
    parts.push({ type: 'text', content: text });
  }

  return parts;
}

// Sub-component to render custom code block with Copy button and syntax highlighting
function AITutorCodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  let highlighted = '';
  try {
    const lang = hljs.getLanguage(language) ? language : 'javascript';
    highlighted = hljs.highlight(code.trim(), { language: lang }).value;
  } catch {
    highlighted = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-border bg-[#0d0d0f] text-left">
      <div className="flex items-center justify-between border-b border-border bg-[#090a0d] px-3 py-1.5 text-[10px] font-mono text-text-muted">
        <span className="uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-bg-elevated hover:text-text cursor-pointer transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed text-text bg-black/40">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

const getSystemPrompt = (context) => {
  let contextStr = '';
  if (context) {
    contextStr = `
You are a programming mentor on CODEXA, an interactive developer learning platform.
The user is currently studying the following lesson:
- **Lesson Title**: ${context.title}
- **Module ID**: ${context.moduleId}
- **Difficulty**: ${context.metadata?.difficulty || 'N/A'}
- **Estimated Reading Time**: ${context.metadata?.estimatedReadingTime || 'N/A'} minutes
- **Active Tab/Activity**: ${context.activeTab || 'lesson'}

Here is the lesson content they are reading:
${JSON.stringify(context.sections?.map(s => ({ type: s.type, heading: s.heading, content: s.content })))}

Current Quiz Questions for this lesson:
${JSON.stringify(context.quiz?.map(q => ({ question: q.question, options: q.options })))}
`;
  } else {
    contextStr = `You are a programming mentor on CODEXA. The user is currently browsing the learning hub.`;
  }

  return `
${contextStr}

Your role is to behave as a programming mentor.
Capabilities:
- Explain Concepts
- Explain Code Execution
- Generate Analogies
- Generate Quizzes
- Generate Practice Questions
- Debug Code
- Interview Preparation
- Summarize Lessons
- Suggest Learning Paths

Your responses should be educational, structured, and beginner-friendly. Use markdown rendering and syntax highlighting where appropriate. Keep your answers concise, engaging, and clear.
`;
};

export default function AITutor() {
  const { isOpen, isMinimized, open, close, minimize, restore, lessonContext } = useAITutor();
  const { progress } = useProgress();
  
  // Storage keys configuration
  const [isConfigured, setIsConfigured] = useState(() => {
    return !!(localStorage.getItem('selected_provider') && localStorage.getItem('provider_api_key'));
  });

  // Setup state
  const [setupStep, setSetupStep] = useState(1); // 1: Select, 2: Key Input, 3: Verifying
  const [selectedProvider, setSelectedProvider] = useState('gemini'); // gemini | openai | nvidia | groq | claude
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Chat window state
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 390, h: 540 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const scrollRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const activeLessonId = progress.currentLesson || '3';
  const activeLesson = getLessonById(activeLessonId);

  // Quick Action configuration
  const quickActions = [
    { label: 'Explain Topic', prompt: 'Explain this topic dynamically.' },
    { label: 'Explain Line by Line', prompt: 'Explain the code examples in this lesson line by line.' },
    { label: 'Generate Quiz', prompt: 'Generate a quick quiz with multiple-choice questions about this lesson.' },
    { label: 'Practice Questions', prompt: 'Give me some practice coding challenges for this lesson.' },
    { label: 'Interview Questions', prompt: 'Give me some typical developer interview questions on this topic.' },
    { label: 'Summarize Lesson', prompt: 'Provide a clean, bulleted summary of this lesson.' },
    { label: 'Debug Code', prompt: 'How do I debug syntax errors or reference issues in this code?' }
  ];

  // Auto scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, setupStep, isConfigured]);

  // Position setup modal or window
  useEffect(() => {
    if (isOpen && position.x === 0 && position.y === 0) {
      setPosition({
        x: window.innerWidth - size.w - 24,
        y: window.innerHeight - size.h - 24,
      });
    }
  }, [isOpen, position.x, position.y, size.w, size.h]);

  // Sync keys from localStorage on config changes
  useEffect(() => {
    if (!isConfigured) {
      const p = localStorage.getItem('selected_provider');
      const k = localStorage.getItem('provider_api_key');
      if (p && k) {
        setIsConfigured(true);
      }
    }
  }, [isConfigured]);

  // Drag handlers
  const onDragStart = useCallback((e) => {
    if (isMaximized) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY, posX: position.x, posY: position.y };
    setIsDragging(true);
  }, [position, isMaximized]);

  useEffect(() => {
    if (!isDragging || isMaximized) return;
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
  }, [isDragging, size.w, size.h, isMaximized]);

  // Resize handlers
  const onResizeStart = useCallback((e) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = { x: clientX, y: clientY, w: size.w, h: size.h };
    setIsResizing(true);
  }, [size, isMaximized]);

  useEffect(() => {
    if (!isResizing || isMaximized) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dw = clientX - resizeStartRef.current.x;
      const dh = clientY - resizeStartRef.current.y;
      
      const newW = Math.max(340, Math.min(800, resizeStartRef.current.w + dw));
      const newH = Math.max(400, Math.min(800, resizeStartRef.current.h + dh));
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
  }, [isResizing, isMaximized]);

  // Connection Handler
  const handleVerifyConnect = async () => {
    setVerifyError('');
    
    // 1. Format validation
    const isValidFormat = validateKeyFormat(selectedProvider, apiKey);
    if (!isValidFormat) {
      const prefMap = {
        openai: "'sk-'",
        nvidia: "'nvapi-'",
        groq: "'gsk_'",
        claude: "'sk-ant-'",
        gemini: 'at least 20 characters (get one free at aistudio.google.com)',
      };
      const pref = prefMap[selectedProvider] || 'a valid format';
      setVerifyError(`Invalid API Key format. ${selectedProvider === 'gemini' ? 'Key must be ' : 'Key must start with '}${pref}.`);
      return;
    }

    // 2. Perform connection verification
    setIsVerifying(true);
    setSetupStep(3);

    try {
      const isSuccess = await testConnection(selectedProvider, apiKey);
      if (isSuccess) {
        // Connected successfully! Save locally
        localStorage.setItem('selected_provider', selectedProvider);
        localStorage.setItem('provider_api_key', apiKey.trim());
        
        setTimeout(() => {
          setIsVerifying(false);
          setIsConfigured(true);
        }, 1500);
      } else {
        setIsVerifying(false);
        setSetupStep(2);
        setVerifyError('Invalid API Key. Please check your API key and try again.');
      }
    } catch (err) {
      setIsVerifying(false);
      setSetupStep(2);
      setVerifyError('Verification failed due to a network connection issue. Please try again.');
    }
  };

  // Chat send handler
  const handleSend = useCallback(async (text) => {
    const textToSend = text || inputValue;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const activeProvider = localStorage.getItem('selected_provider');
      const activeKey = localStorage.getItem('provider_api_key');

      if (!activeProvider || !activeKey) {
        throw new Error('AI Provider not configured. Reset settings.');
      }

      // Build system prompt using active lesson context
      const systemPrompt = getSystemPrompt(lessonContext);

      // Perform LLM API request
      const responseText = await callAIProvider(activeProvider, activeKey, [...messages.slice(-8), userMsg], systemPrompt);
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `⚠️ **Error communicating with AI**: ${err.message || 'Unknown error'}. 

Please check your network connection, verify that your API key is still valid, or click the ⚙️ icon in the header to re-configure.` 
      }]);
    }
  }, [inputValue, messages, lessonContext]);

  // Clean setup state
  const handleResetSetup = () => {
    localStorage.removeItem('selected_provider');
    localStorage.removeItem('provider_api_key');
    setIsConfigured(false);
    setSetupStep(1);
    setApiKey('');
    setVerifyError('');
  };

  // RENDER FLOATING ROBOT LAUNCHER
  if (!isOpen || isMinimized) {
    return (
      <motion.button
        layoutId="ai-tutor-window"
        onClick={open}
        className="fixed right-6 bottom-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-[#0f0a07] text-accent cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 active:scale-95 group"
        title="Open Codexa AI Tutor"
        aria-label="Ask AI Tutor"
      >
        <Bot className="h-6 w-6" />
        {/* Pulsing glow aura */}
        <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-25 pointer-events-none" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white shadow-md animate-bounce">
          AI
        </span>
      </motion.button>
    );
  }

  // Provider configuration list
  const providers = [
    { id: 'gemini', name: 'Google Gemini', desc: '✅ Recommended — works in browser (no CORS). Free key at aistudio.google.com', placeholder: 'AIzaSy...' },
    { id: 'openai', name: 'OpenAI', desc: 'GPT-4o-mini · Dev mode only (requires localhost proxy)', placeholder: 'sk-xxxxxxxx...' },
    { id: 'groq', name: 'Groq Cloud', desc: 'Llama-3 ultra-fast · Dev mode only (requires localhost proxy)', placeholder: 'gsk_xxxxxxxx...' },
    { id: 'nvidia', name: 'NVIDIA NIM', desc: 'Llama 3.1 & Nemotron · Dev mode only (requires localhost proxy)', placeholder: 'nvapi-xxxxxxxx...' },
    { id: 'claude', name: 'Anthropic Claude', desc: 'Claude 3.5 Haiku · Dev mode only (requires localhost proxy)', placeholder: 'sk-ant-xxxxxxxx...' }
  ];

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
          left: isMaximized ? 16 : position.x,
          top: isMaximized ? 64 : position.y, // Keep clean spacing with top nav
          width: isMaximized ? window.innerWidth - 32 : size.w,
          height: isMaximized ? window.innerHeight - 80 : size.h,
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
          className="flex shrink-0 items-center justify-between border-b border-border/60 bg-[#090a0d] px-4 py-3 select-none"
          style={{ cursor: isDragging ? 'grabbing' : (isMaximized ? 'default' : 'grab') }}
        >
          <div className="flex items-center gap-2">
            {!isMaximized && <GripVertical className="h-3.5 w-3.5 text-text-muted select-none" />}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Bot className="h-4.5 w-4.5 text-accent" />
            </div>
            <div>
              <span className="text-xs font-bold text-text">AI Mentor</span>
              {isConfigured ? (
                <span className="ml-2 rounded-full bg-success/15 border border-success/30 px-2 py-0.2 text-[8px] uppercase font-bold tracking-wider text-success animate-pulse">
                  Connected
                </span>
              ) : (
                <span className="ml-2 rounded-full bg-warning/15 border border-warning/30 px-2 py-0.2 text-[8px] uppercase font-bold tracking-wider text-warning">
                  Setup
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isConfigured && (
              <button
                onClick={handleResetSetup}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-accent cursor-pointer transition-colors"
                title="Change Provider / Reset Key"
                aria-label="Configure AI Provider"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text cursor-pointer transition-colors"
              title={isMaximized ? "Restore window" : "Maximize window"}
              aria-label="Toggle full screen"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={minimize}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text cursor-pointer transition-colors"
              title="Minimize window"
              aria-label="Minimize chatbot window"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={close}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text cursor-pointer transition-colors"
              title="Close window"
              aria-label="Close chatbot window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Outer Switch: First-time setup vs Active Chat */}
        {!isConfigured ? (
          <div className="flex-1 flex flex-col p-5 overflow-y-auto select-none bg-[#09090b]" data-lenis-prevent>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: SELECT PROVIDER */}
              {setupStep === 1 && (
                <motion.div
                  key="setup-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col flex-1"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-accent" />
                      Configure AI Tutor
                    </h3>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      Choose your AI provider. <span className="text-accent font-semibold">Gemini is recommended</span> — it's free and works directly in your browser without setup. Use <code className="bg-bg-elevated text-accent px-1 py-0.5 rounded text-[10px]">sk-mock-key</code> for a demo.
                    </p>
                  </div>

                  <div className="space-y-2 flex-1">
                    {providers.map((p) => {
                      const isSelected = selectedProvider === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProvider(p.id)}
                          className={`relative flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                              : 'border-border bg-bg-card hover:border-border-strong hover:bg-bg-elevated'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-text">{p.name}</span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-accent font-bold" />
                              )}
                            </div>
                            <span className="text-[10px] text-text-muted mt-0.5 block">{p.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSetupStep(2)}
                    className="mt-6 flex items-center justify-center gap-2 w-full rounded-lg bg-accent py-2.5 text-xs font-semibold text-white hover:bg-accent-deep transition-all cursor-pointer shadow-md shadow-accent/10 active:scale-98"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: ENTER API KEY */}
              {setupStep === 2 && (
                <motion.div
                  key="setup-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col flex-1 justify-between"
                >
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-text flex items-center gap-1.5">
                        <Key className="h-4 w-4 text-accent" />
                        Enter {providers.find(p => p.id === selectedProvider)?.name} API Key
                      </h3>
                      <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                        API keys are stored only on your local machine and never shared.
                        {selectedProvider === 'gemini'
                          ? <> Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent underline">aistudio.google.com</a>.</>
                          : <> Or use <code className="bg-bg-elevated text-accent px-1 py-0.5 rounded text-[10px]">sk-mock-key</code> to demo locally.</>
                        }
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => {
                            setApiKey(e.target.value);
                            setVerifyError('');
                          }}
                          placeholder={providers.find(p => p.id === selectedProvider)?.placeholder}
                          className="w-full rounded-lg border border-border bg-bg-input px-3.5 py-2.5 text-xs text-text placeholder:text-text-muted outline-none focus:border-accent font-mono pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
                        >
                          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {verifyError && (
                        <div className="flex items-start gap-1.5 rounded-lg border border-red-900/35 bg-red-950/15 p-3 text-[10px] text-red-400 font-medium">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{verifyError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-6">
                    <button
                      onClick={() => {
                        setSetupStep(1);
                        setVerifyError('');
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </button>
                    <button
                      onClick={handleVerifyConnect}
                      disabled={!apiKey.trim()}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2.5 text-xs font-semibold text-white hover:bg-accent-deep disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer shadow-md shadow-accent/10"
                    >
                      Connect
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: VERIFY CONNECTION */}
              {setupStep === 3 && (
                <motion.div
                  key="setup-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 items-center justify-center text-center py-12"
                >
                  {isVerifying ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
                      <div>
                        <span className="text-xs font-bold text-text">Testing Endpoint Connection...</span>
                        <p className="text-[10px] text-text-muted mt-1">
                          Verifying key with {providers.find(p => p.id === selectedProvider)?.name} servers.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 border border-success/30 text-success">
                        <Check className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text">Connected Successfully</span>
                        <p className="text-[10px] text-text-muted mt-1">
                          Your local mentor is ready. Loading workspace...
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        ) : (
          /* ACTIVE CHAT WORKSPACE */
          <>
            {/* Context Header */}
            {lessonContext && (
              <div className="bg-bg-soft/40 px-4 py-2 border-b border-border/50 flex items-center justify-between text-[10px] text-text-muted font-semibold select-none">
                <span className="truncate">Active Context: {lessonContext.title || 'JavaScript Fundamentals'}</span>
                <span className="text-accent shrink-0 font-mono">JS L{lessonContext.moduleId || '1'}</span>
              </div>
            )}

            {/* Chat Messages Screen */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" data-lenis-prevent>
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
                        ? 'rounded-tr-none bg-accent/10 border border-accent/20 text-text text-left'
                        : 'rounded-tl-none bg-bg-card border border-border/40 text-text-secondary text-left'
                    }`}
                  >
                    {/* Render message formatting segments */}
                    {msg.role === 'ai' ? (
                      parseMessageContent(msg.text).map((part, index) => {
                        if (part.type === 'code') {
                          return (
                            <AITutorCodeBlock
                              key={index}
                              code={part.content}
                              language={part.language}
                            />
                          );
                        } else {
                          const html = marked.parse(part.content);
                          return (
                            <div
                              key={index}
                              dangerouslySetInnerHTML={{ __html: html }}
                              className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-accent prose-code:bg-bg-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] prose-code:before:content-none prose-code:after:content-none"
                            />
                          );
                        }
                      })
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
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

            {/* Quick Actions Scroll Bar */}
            <div className="bg-[#090a0d] py-2 px-3 border-t border-border/50 select-none">
              <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Quick Actions:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pr-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.prompt)}
                    className="shrink-0 rounded-md border border-border bg-bg-input px-2.5 py-1 text-[9px] font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-text hover:bg-accent/5 cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Query Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="shrink-0 border-t border-border/60 bg-[#08080a] p-3 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isTyping ? "AI is reasoning..." : "Ask your AI mentor a doubt..."}
                disabled={isTyping}
                className="flex-1 rounded-lg border border-border bg-bg-input px-3.5 py-2 text-xs text-text placeholder:text-text-muted outline-none focus:border-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-deep active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                aria-label="Submit query"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Resizer anchor (disable when maximized) */}
            {!isMaximized && (
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
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
