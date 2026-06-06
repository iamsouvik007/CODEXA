import { motion } from 'framer-motion';

export default function DataTable({ html }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-card"
    >
      <div
        className="data-table overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  );
}
