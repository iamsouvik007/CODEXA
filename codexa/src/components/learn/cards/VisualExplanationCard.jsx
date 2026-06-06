import { motion } from 'framer-motion';
import { Eye, HelpCircle } from 'lucide-react';
import { scaleUp } from '../../../lib/animations';

export default function VisualExplanationCard({ section, index }) {
  // Parse HTML list items dynamically
  const parseSteps = (htmlContent) => {
    const listItems = [];
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let match;
    while ((match = liRegex.exec(htmlContent)) !== null) {
      const content = match[1];
      // Try to split into description and code snippet
      const codeRegex = /<code>([\s\S]*?)<\/code>/i;
      const codeMatch = content.match(codeRegex);
      
      let description = content;
      let code = '';
      
      if (codeMatch) {
        description = content.replace(codeRegex, '').replace(/[:\-\s]+$/, '').trim();
        code = codeMatch[1];
      }

      // Strip any extra HTML tags from description
      description = description.replace(/<[^>]+>/g, '').trim();

      listItems.push({ description, code });
    }
    return listItems;
  };

  const steps = parseSteps(section.content);

  return (
    <motion.div
      variants={scaleUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="rounded-xl border border-cyan-500/25 bg-[#0b0c10] p-6 shadow-[0_0_25px_rgba(6,182,212,0.03)]"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Eye className="h-4.5 w-4.5 text-cyan-400" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Visual Explanation</span>
      </div>

      {section.heading && (
        <h3 className="mb-6 font-heading text-lg font-semibold text-text tracking-tight" style={{ letterSpacing: '-0.4px' }}>
          {section.heading}
        </h3>
      )}

      {steps.length > 0 ? (
        <div className="relative pl-4 space-y-6 border-l-2 border-cyan-500/20 ml-5 py-2">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-bg-card/75 backdrop-blur-md shadow-card hover:border-cyan-500/35 transition-all group"
            >
              {/* Step indicator node */}
              <div className="absolute -left-[37px] top-[18px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0c10] bg-cyan-950 text-xs font-bold text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500 group-hover:text-black transition-colors select-none">
                {idx + 1}
              </div>

              {/* Description */}
              <div className="flex-1">
                <span className="text-sm font-semibold text-text tracking-tight group-hover:text-cyan-400 transition-colors">
                  {step.description}
                </span>
              </div>

              {/* Code value */}
              {step.code && (
                <div className="rounded-lg bg-[#0e0f14] border border-border/30 px-3 py-1.5 font-mono text-xs text-cyan-400 font-medium">
                  {step.code}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div
          className="prose-codexa text-[15px] leading-relaxed text-text-secondary"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </motion.div>
  );
}
