import { motion } from 'framer-motion';
import { fadeUp } from '../../../lib/animations';

export default function ConceptCard({ section, index }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-border bg-bg-card p-6 shadow-card"
    >
      {section.heading && (
        <h2
          className="mb-4 font-heading text-xl font-semibold tracking-tight text-text"
          style={{ letterSpacing: '-0.6px' }}
        >
          {section.heading}
        </h2>
      )}
      <div
        className="prose-codexa text-[15px] leading-relaxed text-text-secondary"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </motion.div>
  );
}
