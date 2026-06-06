import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, Zap, Download } from 'lucide-react';
import { marked } from 'marked';

export default function RevisionMode({ lesson }) {
  const [activeFlashcard, setActiveFlashcard] = useState(null);

  const revisionContent = useMemo(() => {
    if (!lesson.tokens) return null;
    let inRevisionSection = false;
    const revTokens = [];
    
    const flashcards = [];
    let currentFlashcardTitle = null;
    let currentFlashcardContent = [];

    for (const token of lesson.tokens) {
      if (token.type === 'heading' && token.depth === 2) {
        const text = token.text.toLowerCase();
        
        // Check for Quick Revision/Cheatsheet block
        if (text.includes('revision') || text.includes('summary') || text.includes('cheatsheet')) {
          inRevisionSection = true;
          // Stop current flashcard if any
          if (currentFlashcardTitle) {
            flashcards.push({ title: currentFlashcardTitle, content: currentFlashcardContent.join('\n') });
            currentFlashcardTitle = null;
          }
          continue; 
        } else {
          if (inRevisionSection) inRevisionSection = false;
        }

        // Check for Flashcard-worthy sections
        if (text.includes('mistake') || text.includes('interview') || text.includes('concept') || text.includes('analogy')) {
          if (currentFlashcardTitle) {
            flashcards.push({ title: currentFlashcardTitle, content: currentFlashcardContent.join('\n') });
          }
          currentFlashcardTitle = token.text;
          currentFlashcardContent = [];
          continue;
        } else {
          if (currentFlashcardTitle) {
            flashcards.push({ title: currentFlashcardTitle, content: currentFlashcardContent.join('\n') });
            currentFlashcardTitle = null;
          }
        }
      } else {
        if (inRevisionSection) {
          revTokens.push(token.raw);
        } else if (currentFlashcardTitle) {
          currentFlashcardContent.push(token.raw);
        }
      }
    }
    
    if (currentFlashcardTitle) {
      flashcards.push({ title: currentFlashcardTitle, content: currentFlashcardContent.join('\n') });
    }

    const revRaw = revTokens.join('\n');
    const imgMatch = revRaw.match(/!\[.*?\]\((.*?)\)/);
    const cheatsheetUrl = imgMatch ? imgMatch[1] : null;

    return { 
      revHTML: revTokens.length > 0 ? marked.parse(revRaw) : '', 
      cheatsheetUrl,
      flashcards 
    };
  }, [lesson.tokens]);

  if (!revisionContent || (!revisionContent.revHTML && revisionContent.flashcards.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-card py-16 text-center">
        <BookOpen className="mb-4 h-10 w-10 text-text-muted" />
        <h3 className="font-heading text-lg font-semibold text-text">No revision content found</h3>
        <p className="mt-1 text-sm text-text-secondary">Revision notes and flashcards will appear here if the lesson has them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Quick Reference Blocks */}
      {revisionContent.revHTML && (
        <div className="rounded-xl border border-border/60 bg-bg-card shadow-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/40 bg-bg-elevated/30 p-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-lg font-bold text-text">Quick Reference</h2>
            </div>
            {revisionContent.cheatsheetUrl && (
              <a 
                href={revisionContent.cheatsheetUrl} 
                download 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download Cheatsheet</span>
                <span className="sm:hidden">Download</span>
              </a>
            )}
          </div>
          <div className="prose prose-sm sm:prose-base prose-codexa max-w-none p-5 sm:p-6" 
            dangerouslySetInnerHTML={{ __html: revisionContent.revHTML }} 
          />
        </div>
      )}

      {/* Flashcards */}
      {revisionContent.flashcards.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="font-heading text-lg font-bold text-text">Topic Flashcards</h2>
            <p className="text-sm text-text-muted">Click to reveal details for each critical topic.</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {revisionContent.flashcards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveFlashcard(activeFlashcard === i ? null : i)}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-sm transition-all ${
                  activeFlashcard === i
                    ? 'border-accent bg-accent/[0.03]'
                    : 'border-border/60 bg-bg-card hover:border-accent/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text pr-4">{card.title}</h3>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${activeFlashcard === i ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted group-hover:bg-accent/10 group-hover:text-accent'}`}>
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeFlashcard === i ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeFlashcard === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-border/40 pt-4">
                        <div 
                          className="prose prose-sm prose-codexa max-w-none" 
                          dangerouslySetInnerHTML={{ __html: marked.parse(card.content) }} 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
