import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Terminal, Layers, Info } from 'lucide-react';

const tracesByLesson = {
  '1': {
    code: `// Run a simple greeting program\nconsole.log("Hello, World!");`,
    steps: [
      { line: 1, explanation: "Line 1 is a comment. The JavaScript engine skips this line and does not execute anything.", memory: {}, console: [] },
      { line: 2, explanation: "The JS engine executes the console.log() method, passing the string 'Hello, World!' as a parameter. It writes it to stdout.", memory: {}, console: ["Hello, World!"] }
    ]
  },
  '2': {
    code: `let name = "Alice";\nlet age = 25;\nlet isStudent = true;`,
    steps: [
      { line: 1, explanation: "Line 1 declares a variable 'name' in the local scope and initializes it to the string value 'Alice'.", memory: { name: '"Alice"' }, console: [] },
      { line: 2, explanation: "Line 2 declares a variable 'age' in scope and stores the primitive number 25 in memory.", memory: { name: '"Alice"', age: 25 }, console: [] },
      { line: 3, explanation: "Line 3 declares a variable 'isStudent' in scope and binds it to the boolean true.", memory: { name: '"Alice"', age: 25, isStudent: 'true' }, console: [] }
    ]
  },
  '3': {
    code: `let x = 10;\nlet y = 3;\nlet result = x + y;`,
    steps: [
      { line: 1, explanation: "Variable 'x' is allocated in memory and bound to the number value 10.", memory: { x: 10 }, console: [] },
      { line: 2, explanation: "Variable 'y' is allocated in memory and bound to the number value 3.", memory: { x: 10, y: 3 }, console: [] },
      { line: 3, explanation: "The engine evaluates the expression 'x + y' by looking up variables in memory (10 + 3 = 13), then stores it in 'result'.", memory: { x: 10, y: 3, result: 13 }, console: [] }
    ]
  },
  '4': {
    code: `let count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}`,
    steps: [
      { line: 1, explanation: "Initialize loop counter variable 'count' to 0 in memory.", memory: { count: 0 }, console: [] },
      { line: 2, explanation: "Check loop condition: 'count < 3' -> '0 < 3' is true. Proceed into the loop block.", memory: { count: 0 }, console: [] },
      { line: 3, explanation: "Execute console.log(count). The current value of 'count' (0) is printed to the output stream.", memory: { count: 0 }, console: ["0"] },
      { line: 4, explanation: "Increment 'count' by 1. In memory, count changes from 0 to 1.", memory: { count: 1 }, console: ["0"] },
      { line: 2, explanation: "Back to condition. Check 'count < 3' -> '1 < 3' is true. Loop continues.", memory: { count: 1 }, console: ["0"] },
      { line: 3, explanation: "Print current count (1) to the console output.", memory: { count: 1 }, console: ["0", "1"] },
      { line: 4, explanation: "Increment 'count' by 1. In memory, count changes from 1 to 2.", memory: { count: 2 }, console: ["0", "1"] },
      { line: 2, explanation: "Check condition: 'count < 3' -> '2 < 3' is true. Loop continues.", memory: { count: 2 }, console: ["0", "1"] },
      { line: 3, explanation: "Print current count (2) to the console output.", memory: { count: 2 }, console: ["0", "1", "2"] },
      { line: 4, explanation: "Increment 'count' by 1. In memory, count changes from 2 to 3.", memory: { count: 3 }, console: ["0", "1", "2"] },
      { line: 2, explanation: "Check condition: 'count < 3' -> '3 < 3' is false. The condition is violated, loop exits.", memory: { count: 3 }, console: ["0", "1", "2"] },
      { line: 5, explanation: "Program reaches the end. Execution successfully completed.", memory: { count: 3 }, console: ["0", "1", "2"] }
    ]
  }
};

// A simple JS parser and evaluator for traces
function generateTraces(codeText) {
  // Try compiling the code first to verify basic syntax
  try {
    new Function(codeText);
  } catch (e) {
    return [{
      line: 1,
      explanation: `Syntax Error: ${e.message}`,
      memory: {},
      console: [],
      error: true
    }];
  }

  const lines = codeText.split('\n');
  const instructions = [];
  const loopStack = [];
  
  // Strip trailing comment helper
  const stripTrailingComment = (line) => {
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplateLiteral = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "'" && !inDoubleQuote && !inTemplateLiteral) inSingleQuote = !inSingleQuote;
      else if (char === '"' && !inSingleQuote && !inTemplateLiteral) inDoubleQuote = !inDoubleQuote;
      else if (char === '`' && !inSingleQuote && !inDoubleQuote) inTemplateLiteral = !inTemplateLiteral;
      else if (char === '/' && line[i+1] === '/' && !inSingleQuote && !inDoubleQuote && !inTemplateLiteral) {
        return line.slice(0, i).trim();
      }
    }
    return line.trim();
  };

  // 1. Build instruction list
  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    const trimmedText = stripTrailingComment(lineText);
    
    let inst = {
      lineNum: i + 1,
      text: lineText,
      trimmedText: trimmedText,
      type: 'normal',
      jumpTarget: null
    };
    
    if (trimmedText === '' || trimmedText.startsWith('//')) {
      inst.type = 'comment';
    } else if (trimmedText.match(/^\s*while\s*\((.+?)\)\s*\{\s*$/)) {
      inst.type = 'while';
      inst.condition = trimmedText.match(/^\s*while\s*\((.+?)\)\s*\{\s*$/)[1];
      loopStack.push(instructions.length);
    } else if (trimmedText === '}') {
      if (loopStack.length > 0) {
        inst.type = 'endwhile';
        const whileIdx = loopStack.pop();
        inst.jumpTarget = whileIdx;
        instructions[whileIdx].jumpTarget = instructions.length + 1; // PC after this '}'
      } else {
        inst.type = 'endblock';
      }
    }
    instructions.push(inst);
  }

  // Helper to format values for memory preview
  const formatValue = (v) => {
    if (typeof v === 'string') return `"${v}"`;
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  };

  // Helper to evaluate expression safely with custom scope
  const safeEval = (expression, memory) => {
    const keys = Object.keys(memory);
    const values = Object.values(memory);
    try {
      const fn = new Function(...keys, `return (${expression});`);
      return fn(...values);
    } catch (e) {
      throw new Error(`Failed to evaluate "${expression}": ${e.message}`);
    }
  };

  // 2. Execute program counter simulation
  const steps = [];
  let memory = {};
  let consoleLogs = [];
  let pc = 0;
  let limit = 200; // Loop limit to prevent infinite run freeze
  
  while (pc < instructions.length && limit > 0) {
    limit--;
    const inst = instructions[pc];
    let nextPc = pc + 1;
    let explanation = '';
    let isError = false;
    
    try {
      if (inst.type === 'comment') {
        explanation = "Comment or empty line. The JavaScript engine skips this line.";
      } 
      else if (inst.type === 'while') {
        const condVal = safeEval(inst.condition, memory);
        explanation = `Check loop condition: "${inst.condition}" is ${condVal ? 'true' : 'false'}.`;
        if (condVal) {
          nextPc = pc + 1;
        } else {
          nextPc = inst.jumpTarget !== null ? inst.jumpTarget : instructions.length;
        }
      } 
      else if (inst.type === 'endwhile') {
        explanation = "Reached end of loop block. Loop back to evaluate condition.";
        nextPc = inst.jumpTarget;
      } 
      else if (inst.type === 'endblock') {
        explanation = "End of block.";
      } 
      else {
        const trimmed = inst.trimmedText;
        
        // Patterns
        const declMatch = trimmed.match(/^\s*(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+?);?\s*$/);
        const emptyDeclMatch = trimmed.match(/^\s*(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*);?\s*$/);
        const assignMatch = trimmed.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=|\+=|-=)\s*(.+?);?\s*$/);
        const incDecMatch = trimmed.match(/^\s*(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(\+\+|--)|(\+\+|--)\s*([a-zA-Z_$][a-zA-Z0-9_$]*))\s*;?\s*$/);
        const logMatch = trimmed.match(/^\s*console\.log\s*\((.*?)\);?\s*$/);
        
        if (declMatch) {
          const varName = declMatch[2];
          const expr = declMatch[3];
          const val = safeEval(expr, memory);
          memory[varName] = val;
          explanation = `Declare variable "${varName}" and initialize it to ${formatValue(val)}.`;
        } 
        else if (emptyDeclMatch) {
          const varName = emptyDeclMatch[2];
          memory[varName] = undefined;
          explanation = `Declare variable "${varName}" (initialized to undefined).`;
        }
        else if (assignMatch) {
          const varName = assignMatch[1];
          const op = assignMatch[2];
          const expr = assignMatch[3];
          
          let val;
          if (op === '=') {
            val = safeEval(expr, memory);
          } else if (op === '+=') {
            val = safeEval(varName, memory) + safeEval(expr, memory);
          } else if (op === '-=') {
            val = safeEval(varName, memory) - safeEval(expr, memory);
          }
          memory[varName] = val;
          explanation = `Assign ${formatValue(val)} to variable "${varName}".`;
        } 
        else if (incDecMatch) {
          let varName, op;
          if (incDecMatch[1]) {
            varName = incDecMatch[1];
            op = incDecMatch[2];
          } else {
            varName = incDecMatch[4];
            op = incDecMatch[3];
          }
          const oldVal = safeEval(varName, memory);
          const newVal = op === '++' ? oldVal + 1 : oldVal - 1;
          memory[varName] = newVal;
          explanation = `Increment variable "${varName}" from ${oldVal} to ${newVal}.`;
        } 
        else if (logMatch) {
          const argsStr = logMatch[1].trim();
          if (argsStr === '') {
            consoleLogs.push('');
            explanation = 'Execute console.log() to print an empty line.';
          } else {
            const vals = safeEval(`[${argsStr}]`, memory);
            const logLine = vals.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ');
            consoleLogs.push(logLine);
            explanation = `Execute console.log() to print: "${logLine}"`;
          }
        } 
        else {
          if (trimmed.trim() !== '') {
            safeEval(trimmed, memory);
            explanation = `Evaluate expression: "${trimmed}"`;
          } else {
            explanation = "Empty line.";
          }
        }
      }
    } catch (e) {
      explanation = `Error at line ${inst.lineNum}: ${e.message}`;
      isError = true;
    }
    
    steps.push({
      line: inst.lineNum,
      explanation: explanation,
      memory: { ...memory },
      console: [...consoleLogs],
      error: isError
    });
    
    if (isError) break;
    pc = nextPc;
  }
  
  if (limit === 0) {
    steps.push({
      line: instructions[instructions.length - 1]?.lineNum || 1,
      explanation: "Error: Execution limit exceeded (possible infinite loop).",
      memory: { ...memory },
      console: [...consoleLogs],
      error: true
    });
  }

  // Fallback for empty/whitespace code
  if (steps.length === 0) {
    steps.push({
      line: 1,
      explanation: "No executable code found.",
      memory: {},
      console: []
    });
  }
  
  return steps;
}

export default function ExecutionVisualizer({ lessonId = '1' }) {
  const activeTrace = tracesByLesson[lessonId] || tracesByLesson['1'];
  
  const [customCode, setCustomCode] = useState(activeTrace.code);
  const [customSteps, setCustomSteps] = useState(activeTrace.steps);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(activeTrace.code);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playInterval = useRef(null);

  const stepDetails = customSteps[currentStep] || customSteps[0] || { line: 1, explanation: '', memory: {}, console: [] };
  const codeLines = customCode.split('\n');

  useEffect(() => {
    const trace = tracesByLesson[lessonId] || tracesByLesson['1'];
    setCustomCode(trace.code);
    setCustomSteps(trace.steps);
    setEditableCode(trace.code);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsEditing(false);
  }, [lessonId]);

  useEffect(() => {
    if (isPlaying) {
      playInterval.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < customSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2000);
    } else {
      if (playInterval.current) clearInterval(playInterval.current);
    }

    return () => {
      if (playInterval.current) clearInterval(playInterval.current);
    };
  }, [isPlaying, customSteps.length]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < customSteps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const togglePlay = () => {
    if (currentStep === customSteps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleApplyCode = () => {
    const generated = generateTraces(editableCode);
    setCustomCode(editableCode);
    setCustomSteps(generated);
    setCurrentStep(0);
    setIsEditing(false);
  };

  const progressPercent = customSteps.length > 1 
    ? Math.round((currentStep / (customSteps.length - 1)) * 100) 
    : 100;

  return (
    <div className="rounded-xl border border-border bg-[#0b0c10] overflow-hidden shadow-card max-w-4xl mx-auto">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-[#090a0d] px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Execution Visualizer
        </div>
        <span>{isEditing ? 'Editor Active' : `Step ${currentStep + 1} of ${customSteps.length}`}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border/50">
        {/* Code View Left */}
        <div className="p-4 border-r border-border/50 bg-[#0d0e14] flex flex-col relative min-h-[300px]">
          <div className="absolute top-2 right-2 flex items-center gap-2 select-none z-10 font-mono text-[10px]">
            <span className="text-text-muted">source.js</span>
            <button
              onClick={() => {
                if (isEditing) {
                  handleApplyCode();
                } else {
                  setIsEditing(true);
                  setIsPlaying(false);
                }
              }}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {isEditing ? 'Run Simulator' : 'Edit Code'}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setEditableCode(customCode);
                  setIsEditing(false);
                }}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-bg-card text-text-secondary hover:text-text cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex-1 flex font-mono text-[13px] leading-6 relative mt-6 min-h-[200px]">
              <div className="w-8 select-none text-right pr-2 text-text-muted/40 bg-[#070709] border-r border-border/30 pt-2 font-normal text-xs leading-6">
                {editableCode.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                className="flex-1 bg-transparent px-3 py-1.5 text-text placeholder:text-text-muted border-none outline-none resize-none font-mono text-[13px] leading-6 focus:ring-0 min-h-[200px]"
                spellCheck="false"
                placeholder="// Enter JavaScript code here..."
              />
            </div>
          ) : (
            <pre className="font-mono text-[13px] leading-6 select-none mt-6">
              <code>
                {codeLines.map((line, i) => {
                  const lineNum = i + 1;
                  const isActive = stepDetails.line === lineNum;
                  return (
                    <div
                      key={i}
                      className={`flex items-center w-full px-2 rounded transition-colors ${
                        isActive ? 'bg-cyan-500/10 text-cyan-400 font-semibold shadow-[inset_3px_0_0_#22d3ee]' : 'text-text-secondary'
                      }`}
                    >
                      <span className="w-6 shrink-0 text-[10px] text-text-muted font-normal">{lineNum}</span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </div>

        {/* Memory & Console Right */}
        <div className="flex flex-col bg-[#08090d]">
          {/* Memory Heap */}
          <div className="flex-1 p-4 border-b border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-text-muted mb-3">
              <Layers className="h-3 w-3 text-purple-400" />
              Memory Stack (Heap)
            </div>
            <div className="space-y-1.5">
              {isEditing ? (
                <div className="text-xs text-text-muted italic text-center py-4">
                  Run simulator to view memory heap
                </div>
              ) : Object.keys(stepDetails.memory).length > 0 ? (
                Object.entries(stepDetails.memory).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs p-2 rounded bg-bg-card border border-border/40 font-mono"
                  >
                    <span className="text-purple-400">{key}</span>
                    <span className="text-text font-medium">{String(val)}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-muted italic text-center py-4">
                  Heap is empty (No variables declared yet)
                </div>
              )}
            </div>
          </div>

          {/* Console Output */}
          <div className="h-32 p-4 flex flex-col justify-end">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-text-muted mb-2">
              <Terminal className="h-3 w-3 text-emerald-400" />
              stdout (Terminal)
            </div>
            <div className="flex-1 bg-[#050608] rounded p-2.5 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1">
              {isEditing ? (
                <div className="text-text-muted italic">Console output will update during simulation</div>
              ) : stepDetails.console.length > 0 ? (
                stepDetails.console.map((line, i) => (
                  <div key={i} className="flex gap-1.5">
                    <span className="text-text-muted">{'>'}</span>
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div className="text-text-muted italic">Console output is empty</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Box */}
      <div className={`flex gap-3 p-4 border-b border-border/50 text-xs leading-relaxed transition-colors duration-200 ${!isEditing && stepDetails.error ? 'bg-red-950/20 text-red-400 border-red-500/20' : 'bg-[#08080b] text-text-secondary'}`}>
        <Info className={`h-4 w-4 shrink-0 mt-0.5 ${!isEditing && stepDetails.error ? 'text-red-400' : 'text-cyan-400'}`} />
        <p>
          {isEditing 
            ? 'Editing code... Click "Run Simulator" in the top right of the code panel to trace the execution step-by-step.' 
            : stepDetails.explanation}
        </p>
      </div>

      {/* Playback Controls Footer */}
      <div className="bg-[#050608] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || isEditing}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated disabled:opacity-30 transition-all cursor-pointer"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            disabled={isEditing}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 transition-all cursor-pointer disabled:opacity-30"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-black" /> : <Play className="h-4 w-4 fill-black" />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === customSteps.length - 1 || isEditing}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated disabled:opacity-30 transition-all cursor-pointer"
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            disabled={isEditing}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated transition-all ml-1.5 cursor-pointer disabled:opacity-30"
            aria-label="Reset simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Progress Slider */}
        <div className="flex-1 max-w-xs mx-4 flex items-center gap-2">
          <div className="h-1 flex-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${isEditing ? 0 : progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {isEditing ? '0%' : `${progressPercent}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
