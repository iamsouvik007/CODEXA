import { useMemo } from 'react';
import { marked } from 'marked';
import SyntaxHighlighter from './SyntaxHighlighter';
import ZoomableImage from './ZoomableImage';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, AlertTriangle, XCircle, Code, Briefcase, CheckSquare, Info } from 'lucide-react';

// Strips markdown bold/italic markers from heading text
const stripMarkdownMarkers = (text) => {
  if (!text) return '';
  // Remove leading/trailing ***, **, or * used for bold/italic
  return text.replace(/^\*{1,3}\s*/, '').replace(/\s*\*{1,3}$/, '').trim();
};

// Maps heading keywords to specific visual styles
const getCardStyle = (heading) => {
  const h = (heading || '').toLowerCase();
  if (/concept/i.test(h)) return { border: 'border-[#f97316]/40', bg: 'bg-[#f97316]/[0.03]', text: 'text-[#f97316]', Icon: Lightbulb };
  if (/definition|what is/i.test(h)) return { border: 'border-blue-500/40', bg: 'bg-blue-500/[0.03]', text: 'text-blue-500', Icon: BookOpen };
  if (/important/i.test(h)) return { border: 'border-purple-500/40', bg: 'bg-purple-500/[0.03]', text: 'text-purple-500', Icon: Info };
  if (/warning|gotcha|danger|caution/i.test(h)) return { border: 'border-yellow-500/40', bg: 'bg-yellow-500/[0.03]', text: 'text-yellow-500', Icon: AlertTriangle };
  if (/mistake|don't|avoid/i.test(h)) return { border: 'border-red-500/40', bg: 'bg-red-500/[0.03]', text: 'text-red-500', Icon: XCircle };
  if (/example|code|snippet/i.test(h)) return { border: 'border-pink-500/40', bg: 'bg-pink-500/[0.03]', text: 'text-pink-500', Icon: Code };
  if (/interview/i.test(h)) return { border: 'border-cyan-500/40', bg: 'bg-cyan-500/[0.03]', text: 'text-cyan-500', Icon: Briefcase };
  if (/takeaway|summary|revision|cheatsheet/i.test(h)) return { border: 'border-green-500/40', bg: 'bg-green-500/[0.03]', text: 'text-green-500', Icon: CheckSquare };
  
  // Default generic section
  return { border: 'border-border/60', bg: 'bg-[#0b0b0d]', text: 'text-text', Icon: null };
};

export default function MarkdownRenderer({ tokens }) {
  // Group tokens by sections defined by H2/H3
  const groups = useMemo(() => {
    if (!tokens) return [];
    
    const parsedGroups = [];
    let currentGroup = { headingToken: null, tokens: [] };

    tokens.forEach((token) => {
      // Ignore H1 heading tokens to prevent redundant lesson titles in card content
      if (token.type === 'heading' && token.depth === 1) return;

      // Ignore internal markdown comments meant for other components
      if (token.type === 'html' && token.raw.includes('<!-- QUIZ_START')) return;
      if (token.type === 'html' && token.raw.includes('<!-- REVISION_START')) return;
      if (token.type === 'html' && token.raw.includes('QUIZ_END -->')) return;
      if (token.type === 'html' && token.raw.includes('REVISION_END -->')) return;

      if (token.type === 'heading' && (token.depth === 2 || token.depth === 3)) {
        const hasContent = currentGroup.headingToken || currentGroup.tokens.some(t => t.raw && t.raw.trim() !== '');
        if (hasContent) {
          parsedGroups.push(currentGroup);
        }
        currentGroup = { headingToken: token, tokens: [] };
      } else {
        currentGroup.tokens.push(token);
      }
    });

    const hasContent = currentGroup.headingToken || currentGroup.tokens.some(t => t.raw && t.raw.trim() !== '');
    if (hasContent) {
      parsedGroups.push(currentGroup);
    }
    
    return parsedGroups;
  }, [tokens]);

  const renderToken = (token, idx) => {
    if (token.type === 'code') {
      return <SyntaxHighlighter key={idx} code={token.text} language={token.lang} />;
    }

    // Intercept Images for custom ZoomableImage component
    if (token.type === 'paragraph' && token.tokens) {
      const hasImage = token.tokens.some(t => t.type === 'image');
      if (hasImage) {
        return (
          <div key={idx} className="my-4">
            {token.tokens.map((t, i) => {
              if (t.type === 'image') {
                return <ZoomableImage key={i} src={t.href} alt={t.text} />;
              }
              // Render surrounding text normally
              return <span key={i} dangerouslySetInnerHTML={{ __html: marked.parseInline(t.raw) }} />;
            })}
          </div>
        );
      }
    }

    // Default HTML render for everything else (tables, blockquotes, lists, paragraphs)
    const html = marked.parse(token.raw);
    return (
      <div 
        key={idx} 
        className="prose prose-codexa prose-detail-doc max-w-none" 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {groups.map((group, gIdx) => {
        const hasHeading = !!group.headingToken;
        const style = getCardStyle(hasHeading ? stripMarkdownMarkers(group.headingToken.text) : '');
        const { Icon } = style;

        return (
          <motion.div
            key={gIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.05 }}
            className={`rounded-xl border ${style.border} ${style.bg} p-6 sm:p-8 shadow-card`}
          >
            {hasHeading && (
              <div className="mb-6 flex items-center gap-3">
                {Icon && (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${style.border} bg-bg-elevated/50 shadow-sm`}>
                    <Icon className={`h-5 w-5 ${style.text}`} />
                  </div>
                )}
                <h2 className="m-0 font-heading text-xl font-bold tracking-tight text-[#f97316]">
                  {stripMarkdownMarkers(group.headingToken.text)}
                </h2>
              </div>
            )}
            
            <div className="space-y-4">
              {group.tokens.map((token, tIdx) => renderToken(token, tIdx))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
