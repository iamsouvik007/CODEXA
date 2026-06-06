import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Play, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import cpp from 'highlight.js/lib/languages/cpp';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('cpp', cpp);

export default function CodeBlock({ code, language = 'javascript', section }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  const iframeRef = useRef(null);

  // Use code from props or extract from section
  const codeString = code || section?.codeBlocks?.[0]?.code || '';
  const lang = language || section?.codeBlocks?.[0]?.language || 'javascript';

  const lines = codeString.split('\n');
  const isLong = lines.length > 12;
  const displayCode = isLong && !expanded ? lines.slice(0, 12).join('\n') : codeString;

  // Syntax highlighting
  let highlighted;
  try {
    highlighted = hljs.highlight(displayCode, { language: lang }).value;
  } catch {
    highlighted = displayCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [codeString]);

  const handleRun = useCallback(() => {
    setShowConsole(true);
    const outputs = [];

    try {
      // Create a sandboxed iframe for execution
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const win = iframe.contentWindow;

      // Override console methods
      win.console = {
        log: (...args) => outputs.push({ type: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
        error: (...args) => outputs.push({ type: 'error', content: args.map(a => String(a)).join(' ') }),
        warn: (...args) => outputs.push({ type: 'warn', content: args.map(a => String(a)).join(' ') }),
        info: (...args) => outputs.push({ type: 'log', content: args.map(a => String(a)).join(' ') }),
      };

      // Remove prompt() calls for safety
      const safeCode = codeString.replace(/prompt\(/g, '(() => "user_input")(');

      win.eval(safeCode);
      document.body.removeChild(iframe);
    } catch (err) {
      outputs.push({ type: 'error', content: err.message });
    }

    if (outputs.length === 0) {
      outputs.push({ type: 'log', content: '(no output)' });
    }

    setConsoleOutput(outputs);
  }, [codeString]);

  const isRunnable = ['javascript', 'jsx', 'js'].includes(lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-[#1e222b] bg-[#0f1117] shadow-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e222b] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">{lang}</span>
        </div>
        <div className="flex items-center gap-1">
          {isRunnable && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-bg-elevated hover:text-success"
              aria-label="Run code"
            >
              <Play className="h-3 w-3" />
              Run
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-6">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>

      {/* Expand toggle */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 border-t border-border/50 py-2 text-xs text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? 'Show less' : `Show all ${lines.length} lines`}
        </button>
      )}

      {/* Console output */}
      <AnimatePresence>
        {showConsole && consoleOutput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="flex items-center justify-between bg-[#0c0d12] px-4 py-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                <Terminal className="h-3 w-3" />
                Console
              </div>
              <button onClick={() => { setShowConsole(false); setConsoleOutput(null); }} className="text-xs text-text-muted hover:text-text">
                Clear
              </button>
            </div>
            <div className="bg-[#0c0d12] p-4 font-mono text-[13px] leading-6">
              {consoleOutput.map((line, i) => (
                <div key={i} className={`${
                  line.type === 'error' ? 'text-red-400' :
                  line.type === 'warn' ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  <span className="mr-2 text-text-muted">{'>'}</span>
                  {line.content}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
