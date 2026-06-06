import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, Circle, Clock, BookOpen } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';

export default function SidebarModule({ module, lessons, activeLessonId, isExpanded, onToggle, onLessonSelect }) {
  const { isLessonComplete } = useProgress();
  const completedCount = lessons.filter(l => isLessonComplete(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="mb-1">
      {/* Module header */}
      <button
        onClick={onToggle}
        className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-bg-card"
        aria-expanded={isExpanded}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
        />
        <div className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-text">{module.title}</span>
          <span className="text-[10px] text-text-muted">{completedCount}/{lessons.length} lessons</span>
        </div>
        {progressPct > 0 && (
          <div className="flex h-5 w-5 items-center justify-center">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
              <circle
                cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"
                strokeDasharray={`${progressPct * 0.502} 50.2`}
                className="text-accent"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Lesson list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-3 border-l border-border pl-2 py-0.5">
              {lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const isComplete = isLessonComplete(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson.id)}
                    className={`group flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-bg-card hover:text-text'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Completion icon */}
                    {isComplete ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    ) : isActive ? (
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    ) : (
                      <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                    )}

                    <div className="min-w-0 flex-1">
                      <span className={`block truncate text-xs font-medium ${isActive ? 'text-accent' : ''}`}>
                        {lesson.title}
                      </span>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-text-muted">
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {lesson.metadata.estimatedReadingTime}m
                        </span>
                        <span className="capitalize">{lesson.metadata.difficulty}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
