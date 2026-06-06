import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';

export default function MobileBottomNav({ lesson, prevLesson, nextLesson, onPrev, onNext }) {
  const { isLessonComplete } = useProgress();
  const isComplete = isLessonComplete(lesson.id);

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

        {/* Status indicator */}
        {isComplete ? (
          <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            <span>Done</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 rounded-full border border-border bg-[#0b0c10] px-4 py-2 text-sm font-medium text-text-muted"
            title="Complete both the Lesson Quiz and the Mock Test to mark this lesson as completed."
          >
            <Circle className="h-4 w-4" />
            <span>In Progress</span>
          </div>
        )}

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
