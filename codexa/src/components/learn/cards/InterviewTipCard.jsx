import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function InterviewTipCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-info/20 bg-info/5 p-6 shadow-card"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/15">
          <Briefcase className="h-4 w-4 text-info" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-info">Interview Tip</span>
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
