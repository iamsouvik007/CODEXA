import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

export default function SummaryCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-pink-500/15 bg-[#0e080b] p-6 shadow-[0_0_25px_rgba(236,72,153,0.02)] hover:border-pink-500/25 transition-all"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/15 border border-pink-500/20">
          <CheckSquare className="h-4 w-4 text-pink-400" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">Key Takeaway</span>
      </div>
      {section.heading && (
        <h3 className="mb-3 font-heading text-lg font-bold text-pink-400" style={{ letterSpacing: '-0.4px' }}>
          {section.heading}
        </h3>
      )}
      <div
        className="prose-codexa text-[15px] leading-relaxed text-text-secondary"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </motion.div>
  );
}
