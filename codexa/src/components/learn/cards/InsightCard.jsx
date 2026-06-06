import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function InsightCard({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl border-l-4 border-accent bg-bg-card p-6 shadow-card"
    >
      <Quote className="absolute top-4 right-4 h-6 w-6 text-accent/20" />
      {section.heading && (
        <h3 className="mb-3 font-heading text-lg font-semibold text-text" style={{ letterSpacing: '-0.6px' }}>
          {section.heading}
        </h3>
      )}
      <div
        className="prose-codexa text-[15px] leading-relaxed text-text-secondary italic"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </motion.div>
  );
}
