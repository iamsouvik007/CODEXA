import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Copy, Check, Terminal, Code2, Cpu, AlertCircle } from 'lucide-react';
import ExecutionVisualizer from './ExecutionVisualizer';
import { useProgress } from '../../lib/ProgressContext';

const initialCodes = {
  '1': `// Welcome to Codexa! Try running this code.\nconsole.log("Hello, World!");\nconsole.log("JavaScript is active!");`,
  '2': `// Create your profile variables here!\nlet name = "Alice";\nlet age = 25;\nlet isStudent = true;\n\nconsole.log("Name:", name);\nconsole.log("Age:", age);\nconsole.log("Is Student?", isStudent);`,
  '3': `// Try operating on some numbers!\nlet x = 10;\nlet y = 3;\n\nlet sum = x + y;\nlet remainder = x % y;\n\nconsole.log("Sum:", sum);\nconsole.log("Remainder of 10 / 3:", remainder);`,
  '4': `// Modify the loop condition to repeat 5 times instead of 3!\nlet count = 0;\nwhile (count < 3) {\n  console.log("Iteration:", count);\n  count++;\n}`
};

export default function PracticeWorkspace({ lessonId = '1' }) {
  const { triggerSandboxRun } = useProgress();
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [pythonAlert, setPythonAlert] = useState(false);

  useEffect(() => {
    setCode(initialCodes[lessonId] || initialCodes['1']);
    setLogs([]);
  }, [lessonId]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(initialCodes[lessonId] || initialCodes['1']);
    setLogs([{ type: 'info', text: 'Editor code reset to initial state.' }]);
  }, [lessonId]);

  const handleRun = useCallback(() => {
    triggerSandboxRun();
    setRunning(true);
    setLogs([{ type: 'info', text: 'Executing program...' }]);
    const outputs = [];

    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const win = iframe.contentWindow;
      win.console = {
        log: (...args) => outputs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
        error: (...args) => outputs.push({ type: 'error', text: args.map(a => String(a)).join(' ') }),
        warn: (...args) => outputs.push({ type: 'warn', text: args.map(a => String(a)).join(' ') }),
        info: (...args) => outputs.push({ type: 'info', text: args.map(a => String(a)).join(' ') }),
      };

      const safeCode = code.replace(/prompt\(/g, '(() => "user_input")(');
      win.eval(safeCode);
      document.body.removeChild(iframe);
    } catch (err) {
      outputs.push({ type: 'error', text: err.message });
    }

    if (outputs.length === 1 && outputs[0].type === 'info') {
      outputs.push({ type: 'log', text: '(Program executed but printed no output)' });
    }

    setTimeout(() => {
      setLogs(outputs);
      setRunning(false);
    }, 400);
  }, [code]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto px-1 py-4">
      {/* Visual Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[480px]">
        {/* Monaco-like Editor Panel Left */}
        <div className="flex flex-col rounded-xl border border-border bg-[#0a0a0d] overflow-hidden shadow-card">
          {/* Editor Header */}
          <div className="flex items-center justify-between bg-[#08080a] px-4 py-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-accent" />
              <select
                value={language}
                onChange={(e) => {
                  if (e.target.value === 'python') {
                    setPythonAlert(true);
                    setTimeout(() => setPythonAlert(false), 3000);
                  } else {
                    setLanguage(e.target.value);
                  }
                }}
                className="bg-transparent text-xs font-semibold text-text outline-none cursor-pointer border border-transparent hover:border-border rounded px-1.5 py-0.5"
              >
                <option value="javascript" className="bg-[#0b0b0d] text-text">JavaScript</option>
                <option value="python" className="bg-[#0b0b0d] text-text">Python (Soon)</option>
              </select>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-text-muted hover:text-text hover:bg-bg-elevated transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={handleReset}
                className="p-1 rounded-md text-text-muted hover:text-text hover:bg-bg-elevated transition-colors cursor-pointer"
                title="Reset starter code"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Python Warning toast inside editor */}
          {pythonAlert && (
            <div className="bg-amber-950/20 border-b border-amber-900/30 px-4 py-2 flex items-center gap-2 text-xs text-amber-500 font-medium">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Python support is under development. Architecture is pre-configured.</span>
            </div>
          )}

          {/* Code Textarea Body */}
          <div className="flex-1 flex font-mono text-sm leading-6 relative">
            <div className="w-10 select-none text-right pr-3.5 text-text-muted/40 bg-[#070709] border-r border-border/30 pt-4 font-normal text-xs leading-6">
              {code.split('\n').map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent px-4 py-4 text-text placeholder:text-text-muted border-none outline-none resize-none font-mono text-[13px] leading-6 focus:ring-0 min-h-[300px]"
              spellCheck="false"
            />
          </div>

          {/* Run Action Bar */}
          <div className="bg-[#08080a] p-3 border-t border-border/60 flex justify-end">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-2 rounded-lg bg-accent text-white px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all hover:bg-accent-deep active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-accent/10"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Terminal output console Right */}
        <div className="flex flex-col rounded-xl border border-border bg-[#060608] overflow-hidden shadow-card">
          <div className="flex items-center justify-between bg-[#08080a] px-4 py-2 border-b border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
              <Terminal className="h-4 w-4 text-emerald-400" />
              Terminal Console
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              Clear Console
            </button>
          </div>

          {/* Logs scroll screen */}
          <div className="h-[300px] max-h-[300px] p-5 font-mono text-xs overflow-y-auto space-y-2 select-text">
            {logs.length > 0 ? (
              logs.map((log, i) => {
                const colorMap = {
                  info: 'text-text-muted font-light',
                  error: 'text-red-400 font-medium',
                  warn: 'text-amber-400 font-medium',
                  log: 'text-emerald-400 font-medium'
                };
                return (
                  <div key={i} className={`flex items-start gap-2.5 ${colorMap[log.type]}`}>
                    <span className="text-text-muted/40 font-normal">[{i + 1}]</span>
                    {log.type === 'info' ? (
                      <span className="italic">{log.text}</span>
                    ) : (
                      <span className="whitespace-pre-wrap">{log.text}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-text-muted/40 italic flex flex-col items-center justify-center h-full gap-2 select-none py-16">
                <Terminal className="h-6 w-6 stroke-[1.5]" />
                <span>Console stdout is empty. Click "Run Code" above to execute.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Execution Visualizer under sandbox split */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          <h3 className="font-heading text-lg font-semibold text-text tracking-tight">Interactive Execution Simulator</h3>
        </div>
        <p className="text-xs text-text-muted">
          Study the step-by-step execution path of the current lesson's core code below. Watch variables bind dynamically in the stack scope.
        </p>
        <ExecutionVisualizer lessonId={lessonId} />
      </div>
    </div>
  );
}
