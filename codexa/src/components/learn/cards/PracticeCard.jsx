import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Code, HelpCircle } from 'lucide-react';
import { scaleUp } from '../../../lib/animations';
import { useProgress } from '../../../lib/ProgressContext';

export default function PracticeCard({ section, index }) {
  const { addXP } = useProgress();
  const [userInput, setUserInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shake, setShake] = useState(false);

  // Generate difficulty tags
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficulty = difficulties[index % 3];

  const difficultyColors = {
    'Easy': 'border-success/30 bg-success/10 text-success',
    'Medium': 'border-warning/30 bg-warning/10 text-warning',
    'Hard': 'border-red-500/30 bg-red-500/10 text-red-400'
  };

  // Try to parse out the expected answer and description
  // Format in md: Expected answer can be defined at the end of content
  // E.g. "Expected: 42"
  const getExpectedAnswer = (html) => {
    const match = html.match(/<strong>expected:<\/strong>\s*<code>([\s\S]*?)<\/code>/i) ||
                  html.match(/expected:\s*<code>([\s\S]*?)<\/code>/i) ||
                  html.match(/expected:\s*(\w+)/i);
    return match ? match[1].trim() : 'javascript';
  };

  const expected = getExpectedAnswer(section.content);

  const cleanContent = section.content
    .replace(/expected:[\s\S]*?$/i, '')
    .trim();

  const handleCheck = () => {
    if (!userInput.trim()) return;

    const correct = userInput.trim().toLowerCase() === expected.toLowerCase();
    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      addXP(20); // +20 XP for correct practice submissions
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={shake ? { duration: 0.4 } : { duration: 0.3 }}
      className="rounded-xl border border-success/20 bg-[#080d0a] p-6 shadow-[0_0_20px_rgba(34,197,94,0.02)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/15 border border-success/20">
            <Code className="h-4 w-4 text-success" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-success">Practice Question</span>
        </div>

        {/* Difficulty Tag */}
        <span className={`text-[9px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      {section.heading && (
        <h3 className="mb-4 font-heading text-base font-bold text-text tracking-tight" style={{ letterSpacing: '-0.4px' }}>
          {section.heading}
        </h3>
      )}

      {/* Description */}
      <div
        className="prose-codexa text-xs leading-relaxed text-text-secondary mb-4"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />

      {/* Checking Input Area */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={checked && isCorrect}
            placeholder="Type your answer code/output..."
            className="flex-1 rounded-lg border border-border bg-bg-input px-3.5 py-2 text-xs text-text placeholder:text-text-muted focus:border-success outline-none"
            onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
          />
          <button
            onClick={handleCheck}
            disabled={checked && isCorrect}
            className="rounded-lg bg-success text-black px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-success/80 disabled:opacity-50 cursor-pointer"
          >
            Check
          </button>
        </div>

        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-4 flex gap-3 text-xs leading-relaxed ${
                isCorrect ? 'border-success/30 bg-success/10 text-success' : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">{isCorrect ? 'Correct! (+20 XP)' : 'Incorrect. Try again!'}</p>
                <p className="text-text-muted">
                  {isCorrect ? 'Excellent job solving this practice problem.' : 'Double check your syntax and spelling. Make sure your values match variables correctly.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
