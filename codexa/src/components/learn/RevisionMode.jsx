import { motion } from 'framer-motion';
import { BookOpen, Star, AlertTriangle, Briefcase } from 'lucide-react';

export default function RevisionMode({ lesson }) {
  const cards = lesson.revisionCards || [];

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-card py-16 text-center">
        <BookOpen className="mb-4 h-10 w-10 text-text-muted" />
        <h3 className="font-heading text-lg font-semibold text-text">No revision cards yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Revision cards are generated from lesson content.</p>
      </div>
    );
  }

  const iconMap = {
    concept: Star,
    warning: AlertTriangle,
    'interview-tip': Briefcase,
    summary: BookOpen,
  };

  const colorMap = {
    concept: 'text-accent bg-accent/10',
    warning: 'text-warning bg-warning/10',
    'interview-tip': 'text-info bg-info/10',
    summary: 'text-success bg-success/10',
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold text-text" style={{ letterSpacing: '-0.6px' }}>
          Quick Revision
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Key takeaways from this lesson — perfect for a quick refresher.
        </p>
      </div>

      {cards.map((card, i) => {
        const Icon = iconMap[card.type] || Star;
        const colors = colorMap[card.type] || colorMap.concept;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-bg-card p-5 shadow-card"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-md ${colors}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <h3 className="text-sm font-semibold text-text">{card.heading}</h3>
            </div>
            <ul className="space-y-1.5">
              {card.keyPoints.map((point, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
