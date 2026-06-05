import { motion } from 'framer-motion';
import { ExternalLink, Zap, BookOpen, Code2, Clock } from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer, scaleUp } from '../lib/animations';

const programs = [
  {
    title: 'Strike',
    desc: 'An in-depth, project-based learning program that complements Codexa\'s interactive approach. Build real-world applications while reinforcing the concepts you master here.',
    icon: Zap,
    href: 'https://strikes.in/',
    status: 'Available',
    statusColor: 'text-success',
    statusBg: 'bg-success/10',
    features: ['Project-based learning', 'Real-world applications', 'Mentorship included'],
  },
  {
    title: 'Advanced Patterns',
    desc: 'Deep-dive into advanced JavaScript and React patterns. Architecture, performance optimization, and production-grade code practices for senior developers.',
    icon: Code2,
    href: null,
    status: 'Coming Soon',
    statusColor: 'text-accent',
    statusBg: 'bg-accent/10',
    features: ['Design patterns', 'Performance tuning', 'Architecture decisions'],
  },
  {
    title: 'System Design Lab',
    desc: 'Interactive system design exercises with visual architecture diagrams. Learn to design scalable systems from database choices to API gateways.',
    icon: BookOpen,
    href: null,
    status: 'Coming Soon',
    statusColor: 'text-accent',
    statusBg: 'bg-accent/10',
    features: ['Visual diagrams', 'Scalability patterns', 'Interview prep'],
  },
];

export default function PremiumPrograms() {
  const { ref, controls } = useScrollReveal(0.1);

  return (
    <section ref={ref} id="premium" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionLabel>Premium</SectionLabel>
          <SectionHeading>Premium learning programs.</SectionHeading>
          <SectionDescription className="mx-auto">
            Hand-picked, curated programs that extend your Codexa learning journey.
            Vetted by our team, recommended with confidence.
          </SectionDescription>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 sm:mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((program) => (
              <motion.div
                key={program.title}
                variants={scaleUp}
                className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 transition-all hover:border-border-strong"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />

                <div className="relative">
                  {/* Icon + Status */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
                      <program.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    </div>
                    <span className={`rounded-full ${program.statusBg} px-2.5 py-1 text-[11px] font-medium ${program.statusColor}`}>
                      {program.status}
                    </span>
                  </div>

                  {/* Title + Desc */}
                  <h3 className="font-heading mb-2 text-base font-semibold text-text sm:text-lg">
                    {program.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {program.desc}
                  </p>

                  {/* Features */}
                  <ul className="mb-5 space-y-1.5">
                    {program.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-text-muted">
                        <span className="text-accent" aria-hidden="true">✦</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {program.href ? (
                    <a
                      href={program.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-pill border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text"
                    >
                      Learn More
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-pill border border-border-soft px-4 py-2 text-sm text-text-muted">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
