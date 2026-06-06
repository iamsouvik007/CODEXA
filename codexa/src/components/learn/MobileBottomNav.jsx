import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';

export default function MobileBottomNav({ lesson, prevLesson, nextLesson, onPrev, onNext }) {
  const { isLessonComplete, markLessonComplete } = useProgress();
  const isComplete = isLessonComplete(lesson.id);

  const handleMarkComplete = useCallback(() => {
    markLessonComplete(lesson.id);
  }, [lesson.id, markLessonComplete]);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-border bg-bg/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={!prevLesson}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            prevLesson ? 'text-text-secondary hover:bg-bg-card hover:text-text' : 'text-text-muted/40'
          }`}
          aria-label="Previous lesson"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Mark complete */}
        <button
          onClick={handleMarkComplete}
          disabled={isComplete}
          className={`flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium transition-all ${
            isComplete
              ? 'border border-success/30 bg-success/10 text-success'
              : 'bg-accent text-white active:scale-95'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isComplete ? 'Done' : 'Complete'}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!nextLesson}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            nextLesson ? 'text-text-secondary hover:bg-bg-card hover:text-text' : 'text-text-muted/40'
          }`}
          aria-label="Next lesson"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
