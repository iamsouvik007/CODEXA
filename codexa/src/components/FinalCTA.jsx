import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal, fadeUp, staggerContainer } from '../lib/animations';

export default function FinalCTA() {
  const { ref, controls } = useScrollReveal(0.1);

  return (
    <section ref={ref} id="cta" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />

      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
            </div>
          </div>

          <h2 className="text-balance font-heading mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl lg:text-5xl">
            Your next chapter starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Join developers who stopped reading about code and started experiencing it.
            Start your first lesson today — completely free.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-pill bg-accent px-10 py-4 text-base font-medium text-white shadow-card transition-all hover:bg-accent-deep hover:shadow-elevated"
            >
              Start Learning — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 text-sm text-text-muted">
            No credit card required · Free forever plan · Cancel anytime
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
