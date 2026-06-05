import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { SectionLabel, SectionHeading, SectionDescription } from './Section';
import { useScrollReveal, fadeUp, staggerContainer } from '../lib/animations';

const faqItems = [
  {
    question: 'What makes Codexa different?',
    answer: 'Codexa doesn\'t just explain concepts — it makes you experience them. Every lesson follows an 8-step learning pipeline: concept, analogy, visual explanation, interactive demo, practice challenge, quiz, AI mentoring, and mastery verification. You don\'t move forward until you truly understand.',
  },
  {
    question: 'Is Codexa free?',
    answer: 'Yes! Codexa offers a free forever plan that includes access to core JavaScript lessons, the interactive code editor, and limited AI mentor interactions. Premium plans unlock advanced topics, unlimited AI tutoring, certifications, and priority access to new content.',
  },
  {
    question: 'When will React lessons be available?',
    answer: 'React is our next major curriculum release, currently in development. We\'re applying the same interactive treatment to every React concept — from components and hooks to state management and performance optimization. Expected launch is Q3 2026.',
  },
  {
    question: 'How does the AI Tutor work?',
    answer: 'The AI Tutor is a context-aware assistant that knows exactly which lesson you\'re on, what you\'ve learned so far, and where you might be struggling. It can explain code, debug your work, simplify complex concepts, and generate personalized practice questions. Powered by NVIDIA NIM.',
  },
  {
    question: 'Will there be certifications?',
    answer: 'Yes. We\'re building a certification system that verifies real understanding, not just course completion. Certifications will be based on demonstrated mastery through practice challenges, quizzes, and real coding assessments — making them meaningful to employers.',
  },
  {
    question: 'Can I use Codexa on mobile?',
    answer: 'The Codexa platform is fully responsive and works on mobile browsers today. A dedicated mobile app with offline support is on our roadmap, designed for learning on the go with touch-optimized interactions.',
  },
];

function FAQItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className={`text-base font-medium transition-colors sm:text-lg ${isOpen ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-elevated transition-colors group-hover:bg-bg-card"
        >
          <ChevronDown className={`h-4 w-4 transition-colors ${isOpen ? 'text-accent' : 'text-text-muted'}`} aria-hidden="true" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { ref, controls } = useScrollReveal(0.08);
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section ref={ref} id="faq" className="relative overflow-hidden bg-bg py-24 sm:py-32">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={staggerContainer}
        className="mx-auto max-w-[1200px] px-5 sm:px-8"
      >
        <motion.div variants={fadeUp} className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>Frequently asked questions.</SectionHeading>
          <SectionDescription className="mx-auto">
            Everything you need to know about Codexa. Can&apos;t find what you&apos;re looking for?
            Ask our AI Tutor.
          </SectionDescription>
        </motion.div>

        <motion.div variants={fadeUp} className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <div className="rounded-xl border border-border bg-bg-card px-6 sm:px-8">
            {faqItems.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
