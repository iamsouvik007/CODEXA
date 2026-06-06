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

export default function ExecutionVisualizer({ lessonId = '3' }) {
  const activeTrace = tracesByLesson[lessonId] || tracesByLesson['3'];
  const { code, steps } = activeTrace;
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playInterval = useRef(null);

  const stepDetails = steps[currentStep] || steps[0];
  const codeLines = code.split('\n');

  useEffect(() => {
    if (isPlaying) {
      playInterval.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
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
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
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
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-[#0b0c10] overflow-hidden shadow-card max-w-4xl mx-auto">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-[#090a0d] px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-cyan-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Execution Visualizer
        </div>
        <span>Step {currentStep + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border/50">
        {/* Code View Left */}
        <div className="p-4 border-r border-border/50 bg-[#0d0e14] relative">
          <div className="absolute top-2 right-2 text-[10px] text-text-muted select-none font-mono">
            source.js
          </div>
          <pre className="font-mono text-[13px] leading-6 select-none">
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
              {Object.keys(stepDetails.memory).length > 0 ? (
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
              {stepDetails.console.length > 0 ? (
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
      <div className="flex gap-3 bg-[#08080b] p-4 border-b border-border/50 text-xs leading-relaxed text-text-secondary">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>{stepDetails.explanation}</p>
      </div>

      {/* Playback Controls Footer */}
      <div className="bg-[#050608] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated disabled:opacity-30 transition-all cursor-pointer"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-black" /> : <Play className="h-4 w-4 fill-black" />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated disabled:opacity-30 transition-all cursor-pointer"
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-bg-elevated transition-all ml-1.5 cursor-pointer"
            aria-label="Reset simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Progress Slider */}
        <div className="flex-1 max-w-xs mx-4 flex items-center gap-2">
          <div className="h-1 flex-1 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {Math.round((currentStep / (steps.length - 1)) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
