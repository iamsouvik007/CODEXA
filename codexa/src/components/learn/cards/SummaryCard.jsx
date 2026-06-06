import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

export default function SummaryCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-success/20 bg-gradient-to-br from-success/5 via-bg-card to-bg-card p-6 shadow-card"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/15">
          <CheckSquare className="h-4 w-4 text-success" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-success">Key Takeaway</span>
      </div>
      {section.heading && (
        <h3 className="mb-3 font-heading text-lg font-semibold text-text" style={{ letterSpacing: '-0.6px' }}>
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
