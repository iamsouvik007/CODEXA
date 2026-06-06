import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function MisconceptionCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-red-500/15 bg-[#0e0809] shadow-card hover:border-red-500/25 transition-all"
    >
      <div className="flex items-center gap-2 border-b border-border/50 px-6 py-3 bg-red-950/10">
        <XCircle className="h-4 w-4 text-red-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Common Misconception</span>
      </div>
      <div className="p-6">
        {section.heading && (
          <h3 className="mb-3 font-heading text-lg font-semibold text-text" style={{ letterSpacing: '-0.6px' }}>
            {section.heading}
          </h3>
        )}
        <div
          className="prose-codexa text-[15px] leading-relaxed text-text-secondary"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </motion.div>
  );
}
