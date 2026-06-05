import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Lock, Globe, Smartphone, Award, Users } from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer, scaleUp } from '../lib/animations';

const roadmapItems = [
  {
    title: 'JavaScript Fundamentals',
    status: 'live',
    desc: 'Variables, functions, closures, arrays, objects, async/await, error handling, and more.',
    topics: 24,
    lessons: 120,
  },
  {
    title: 'React',
    status: 'coming',
    desc: 'Components, hooks, state management, routing, performance optimization.',
    topics: 18,
    lessons: 90,
  },
  {
    title: 'System Design',
    status: 'coming',
    desc: 'Architecture patterns, scalability, databases, caching, load balancing.',
    topics: 15,
    lessons: 75,
  },
  {
    title: 'DevOps',
    status: 'planned',
    desc: 'CI/CD, Docker, Kubernetes, monitoring, cloud infrastructure.',
    topics: 12,
    lessons: 60,
  },
  {
    title: 'GenAI for Developers',
    status: 'planned',
    desc: 'Prompt engineering, RAG, fine-tuning, AI-assisted development.',
    topics: 10,
    lessons: 50,
  },
];

const visionItems = [
  { icon: Globe, title: 'Multi-Language Support', desc: 'Python, TypeScript, Go — every language gets the Codexa treatment.' },
  { icon: Users, title: 'Collaborative Learning', desc: 'Pair programming, group sessions, shared workspaces.' },
  { icon: Smartphone, title: 'Mobile App', desc: 'Learn on the go with native mobile + offline support.' },
  { icon: Award, title: 'Verified Certifications', desc: 'Industry-recognized certificates that prove real understanding.' },
];

function StatusBadge({ status }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        Live
      </span>
    );
  }
  if (status === 'coming') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
        <Clock className="h-3 w-3" aria-hidden="true" />
        Coming Soon
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-elevated px-2.5 py-1 text-[11px] font-medium text-text-muted">
      <Lock className="h-3 w-3" aria-hidden="true" />
      Planned
    </span>
  );
}

export default function Roadmap() {
  const { ref, controls } = useScrollReveal(0.1);

  return (
    <section ref={ref} id="roadmap" className="relative overflow-hidden bg-bg py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionLabel>Roadmap</SectionLabel>
          <SectionHeading>A growing library of knowledge.</SectionHeading>
          <SectionDescription className="mx-auto">
            Starting with JavaScript fundamentals, expanding to the entire developer toolkit.
            Every topic gets the full Codexa treatment.
          </SectionDescription>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 sm:mt-16">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-5 hidden w-px bg-border sm:left-8 md:block" aria-hidden="true" />

            <div className="space-y-4">
              {roadmapItems.map((item) => (
                <motion.div
                  key={item.title}
                  variants={scaleUp}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute top-6 left-5 hidden -translate-x-1/2 md:block sm:left-8" aria-hidden="true">
                    {item.status === 'live' ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success">
                        <div className="h-1.5 w-1.5 rounded-full bg-bg" />
                      </div>
                    ) : item.status === 'coming' ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                        <div className="h-1.5 w-1.5 rounded-full bg-bg" />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-border">
                        <div className="h-1.5 w-1.5 rounded-full bg-bg" />
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div className={`rounded-xl border bg-bg-card p-5 sm:p-6 md:ml-14 ${
                    item.status === 'live' ? 'border-success/20' : 'border-border'
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-base font-semibold text-text sm:text-lg">{item.title}</h3>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="mt-1.5 text-sm text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                      <span>{item.topics} topics</span>
                      <span>·</span>
                      <span>{item.lessons} lessons</span>
                      {item.status === 'live' && (
                        <>
                          <span>·</span>
                          <span className="text-success">Available now</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Coming Next — merged from FutureVision */}
        <motion.div variants={fadeUp} className="mt-16 sm:mt-20">
          <h3 className="font-heading mb-6 text-center text-xl font-semibold tracking-tight text-text sm:text-2xl">
            Coming next.
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visionItems.map((item) => (
              <motion.div
                key={item.title}
                variants={scaleUp}
                className="group rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-border-strong"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-bg-elevated transition-colors group-hover:bg-accent/10">
                  <item.icon className="h-4.5 w-4.5 text-text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                </div>
                <h4 className="font-heading mb-1 text-sm font-semibold text-text">{item.title}</h4>
                <p className="text-xs leading-relaxed text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
