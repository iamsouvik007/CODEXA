import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function AnalogyCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 via-bg-card to-bg-card p-6 shadow-card"
    >
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
        <Lightbulb className="h-4 w-4 text-accent" />
      </div>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
        Analogy
      </div>
      {section.heading && (
        <h3 className="mb-3 pr-10 font-heading text-lg font-semibold text-text" style={{ letterSpacing: '-0.6px' }}>
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
