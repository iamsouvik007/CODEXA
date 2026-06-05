import { motion } from 'framer-motion';
import { useScrollReveal, fadeUp } from '../lib/animations';

/**
 * Reusable section wrapper with scroll-reveal animation.
 */
export default function Section({ children, className = '', id, dark = false }) {
  const { ref, controls } = useScrollReveal(0.08);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${dark ? 'bg-bg-soft' : 'bg-bg'} ${className}`}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeUp}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}

/**
 * Section eyebrow label — monospace technical voice.
 */
export function SectionLabel({ children }) {
  return (
    <span className="mb-4 inline-block rounded-pill border border-border bg-accent-bg px-3 py-1 font-mono text-xs tracking-wide text-accent uppercase">
      {children}
    </span>
  );
}

/**
 * Section heading with balanced text wrapping — uses Space Grotesk.
 */
export function SectionHeading({ children, className = '' }) {
  return (
    <h2 className={`text-balance font-heading text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl lg:text-5xl ${className}`}>
      {children}
    </h2>
  );
}

/**
 * Section description paragraph.
 */
export function SectionDescription({ children, className = '' }) {
  return (
    <p className={`mt-4 max-w-2xl text-balance text-base leading-relaxed text-text-secondary sm:text-lg ${className}`}>
      {children}
    </p>
  );
}
