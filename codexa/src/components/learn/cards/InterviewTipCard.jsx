import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { scaleUp } from '../../../lib/animations';

export default function InterviewTipCard({ section, index }) {
  const [revealed, setRevealed] = useState(false);

  // Generate a realistic difficulty tag based on index
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficulty = difficulties[index % 3];
  
  const difficultyColors = {
    'Easy': 'border-success/30 bg-success/10 text-success',
    'Medium': 'border-warning/30 bg-warning/10 text-warning',
    'Hard': 'border-red-500/30 bg-red-500/10 text-red-400'
  };

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-purple-500/25 bg-[#0a080d] p-6 shadow-[0_0_20px_rgba(168,85,247,0.02)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20">
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Interview Question</span>
        </div>

        {/* Difficulty Tag */}
        <span className={`text-[9px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 select-none ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      {section.heading && (
        <h3 className="mb-4 font-heading text-base font-bold text-text tracking-tight" style={{ letterSpacing: '-0.4px' }}>
          Q: {section.heading}
        </h3>
      )}

      {/* Reveal Answer Toggle */}
      <div className="space-y-4">
        <button
          onClick={() => setRevealed(prev => !prev)}
          className="flex items-center gap-2 rounded-lg bg-bg-elevated hover:bg-border border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:text-text transition-all cursor-pointer"
        >
          {revealed ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-purple-400" />
              Hide Answer
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-purple-400" />
              Reveal Answer
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/40 pt-4"
            >
              <div
                className="prose-codexa text-xs leading-relaxed text-text-secondary whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
