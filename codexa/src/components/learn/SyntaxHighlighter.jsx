import { useState, useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import { Check, Copy } from 'lucide-react';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

export default function SyntaxHighlighter({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState('');

  useEffect(() => {
    if (!code) return;
    try {
      const validLang = hljs.getLanguage(language) ? language : 'javascript';
      const result = hljs.highlight(code, { language: validLang });
      setHighlighted(result.value);
    } catch (e) {
      setHighlighted(code);
    }
  }, [code, language]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code ? code.trim().split('\n') : [];

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border/60 bg-[#1e1e24] shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[#25252b] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex overflow-x-auto p-4 text-[13px] leading-relaxed custom-scrollbar">
        <div className="flex select-none flex-col pr-4 text-right font-mono text-text-muted/40 border-r border-border/20 mr-4">
          {lines.map((_, i) => (
            <span key={i} className="inline-block">{i + 1}</span>
          ))}
        </div>
        <pre className="font-mono m-0 p-0 text-[#abb2bf] flex-1">
          <code
            className="syntax-block block min-w-full"
            dangerouslySetInnerHTML={{ __html: highlighted || code }}
          />
        </pre>
      </div>

      {/* Injecting Specific Highlight Overrides as requested */}
      <style>{`
        .syntax-block .hljs-keyword { color: #c678dd; } 
        .syntax-block .hljs-built_in { color: #61afef; }
        .syntax-block .hljs-function { color: #61afef; }
        .syntax-block .hljs-title.function_ { color: #61afef; } 
        .syntax-block .hljs-variable, .syntax-block .hljs-property { color: #56b6c2; } 
        .syntax-block .hljs-string { color: #98c379; } 
        .syntax-block .hljs-number { color: #d19a66; } 
        .syntax-block .hljs-class, .syntax-block .hljs-title.class_ { color: #e5c07b; } 
        .syntax-block .hljs-comment { color: #5c6370; font-style: italic; } 
        .syntax-block .hljs-operator, .syntax-block .hljs-punctuation, .syntax-block .hljs-attr { color: #abb2bf; } 
        .syntax-block .hljs-params { color: #e06c75; }
        .syntax-block .hljs-literal { color: #d19a66; }
      `}</style>
    </div>
  );
}
