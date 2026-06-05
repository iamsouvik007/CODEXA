import { motion } from 'framer-motion';
import { ExternalLink, Zap, Star } from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer, scaleUp } from '../lib/animations';

const providers = [
  {
    title: 'Strike',
    badge: 'Featured Partner',
    desc: 'Project-based software engineering learning program.',
    icon: Zap,
    href: 'https://strikes.in/',
    buttonText: 'Learn More',
    featured: true,
  },
  {
    title: 'Coming Soon Provider',
    badge: 'Coming Soon',
    desc: 'New trusted learning partner coming soon.',
    icon: Star,
    href: null,
    buttonText: 'Coming Soon',
    featured: false,
  },
  {
    title: 'Coming Soon Provider',
    badge: 'Coming Soon',
    desc: 'New trusted learning partner coming soon.',
    icon: Star,
    href: null,
    buttonText: 'Coming Soon',
    featured: false,
  },
];

export default function TrustedProviders() {
  const { ref, controls } = useScrollReveal(0.1);

  return (
    <section ref={ref} id="trusted-providers" className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionLabel>Ecosystem</SectionLabel>
          <SectionHeading>Trusted Course Providers</SectionHeading>
          <SectionDescription className="mx-auto">
            Hand-picked learning programs recommended by Codexa.
          </SectionDescription>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 sm:mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {providers.map((provider, i) => (
              <motion.div
                key={i}
                variants={scaleUp}
                className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
              >
                {/* Subtle inner glow on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

                <div className="relative flex h-full flex-col">
                  {/* Icon + Badge */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${provider.featured ? 'bg-[#ff5f57]/10 group-hover:bg-[#ff5f57]/20' : 'bg-bg-elevated group-hover:bg-accent/10'}`}>
                      <provider.icon className={`h-6 w-6 ${provider.featured ? 'text-[#ff5f57]' : 'text-text-muted group-hover:text-accent'}`} aria-hidden="true" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${provider.featured ? 'bg-[#ff5f57]/10 text-[#ff5f57]' : 'bg-bg-elevated text-text-muted'}`}>
                      {provider.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-heading mb-2 text-xl font-semibold tracking-tight text-text">
                    {provider.title}
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-text-secondary">
                    {provider.desc}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {provider.href ? (
                      <a
                        href={provider.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors duration-300 hover:bg-[#ff5f57]/10 hover:text-[#ff5f57]"
                      >
                        {provider.buttonText}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-transparent px-4 py-2.5 text-sm font-medium text-text-muted"
                      >
                        {provider.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
