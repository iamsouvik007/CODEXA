import { motion } from 'framer-motion';
import { fadeUp } from '../../../lib/animations';

export default function ConceptCard({ section, index }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-orange-500/15 bg-[#0c0a09] p-6 shadow-[0_0_25px_rgba(249,115,22,0.03)] hover:border-orange-500/25 transition-all"
    >
      {section.heading && (
        <h2
          className="mb-4 font-heading text-lg font-bold tracking-tight text-orange-400"
          style={{ letterSpacing: '-0.5px' }}
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
