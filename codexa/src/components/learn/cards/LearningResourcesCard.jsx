import { motion } from 'framer-motion';
import { BookOpen, Bot, ExternalLink, HelpCircle } from 'lucide-react';
import { useAITutor } from '../../../lib/AITutorContext';
import { scaleUp } from '../../../lib/animations';

export default function LearningResourcesCard({ section, index }) {
  const { open } = useAITutor();

  // Try to parse out anchor links dynamically
  const parseLinks = (htmlContent) => {
    const links = [];
    const linkRegex = /<a href="([\s\S]*?)">([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
      links.push({ url: match[1], text: match[2] });
    }
    return links;
  };

  const links = parseLinks(section?.content || '');

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-border bg-[#0b0b0d] p-6 shadow-card"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
            <BookOpen className="h-4.5 w-4.5 text-accent" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Learning Resources</span>
        </div>
      </div>

      {section?.heading && (
        <h3 className="mb-4 font-heading text-lg font-semibold text-text tracking-tight" style={{ letterSpacing: '-0.4px' }}>
          {section.heading}
        </h3>
      )}

      {/* Resource links */}
      {links.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-lg border border-border/50 bg-bg-card/50 hover:border-accent/40 hover:bg-accent/5 transition-all text-xs font-semibold text-text-secondary hover:text-text group"
            >
              <span>{link.text}</span>
              <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-accent transition-colors" />
            </a>
          ))}
        </div>
      ) : (
        <div
          className="prose-codexa text-sm text-text-secondary mb-6"
          dangerouslySetInnerHTML={{ __html: section?.content || 'Reference sheets and external MDN guides.' }}
        />
      )}

      {/* AI Doubt Solver Circular Logo Launcher */}
      <div className="relative mt-6 border-t border-border/50 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-5 rounded-xl border border-accent/20 bg-accent/[0.02] shadow-[0_0_20px_rgba(249,115,22,0.02)]">
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-heading text-sm font-semibold text-text">Got doubts? Ask the AI Tutor</h4>
            <p className="mt-1 text-xs text-text-muted">
              Get instant line-by-line code breakdowns, conceptual analogies, or practice questions.
            </p>
          </div>

          {/* Glowing robot logo launcher */}
          <div className="flex shrink-0 items-center justify-center">
            <button
              onClick={open}
              id="doubt-solver-logo"
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-[#0e0a08] cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 group"
              aria-label="Open AI doubt solver"
            >
              <Bot className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
              {/* Pulsing ring */}
              <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-30 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
