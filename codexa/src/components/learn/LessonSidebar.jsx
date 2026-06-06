import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown, BookOpen, Flame, Trophy } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';
import SidebarModule from './SidebarModule';

export default function LessonSidebar({ lessons, activeLessonId, curriculum, onLessonSelect, onClose, isMobile }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState({ '1': true });
  const { progress, getCompletionPercentage } = useProgress();
  const completionPct = getCompletionPercentage(lessons.length);

  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.sections?.some(s => s.heading?.toLowerCase().includes(q))
    );
  }, [lessons, searchQuery]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className={`flex h-screen flex-col border-r border-border bg-bg-soft ${isMobile ? 'w-[300px]' : 'fixed top-0 left-0 w-[280px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="font-heading text-sm font-semibold text-text">Curriculum</span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-bg-card hover:text-text" aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-text-muted hover:text-text">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Module tree */}
      <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Lesson navigation">
        {curriculum.modules.map((mod) => {
          const moduleLessons = filteredLessons.filter(l => mod.lessons.includes(l.id));
          if (moduleLessons.length === 0 && searchQuery) return null;

          return (
            <SidebarModule
              key={mod.id}
              module={mod}
              lessons={moduleLessons.length > 0 ? moduleLessons : lessons.filter(l => mod.lessons.includes(l.id))}
              activeLessonId={activeLessonId}
              isExpanded={expandedModules[mod.id] ?? false}
              onToggle={() => toggleModule(mod.id)}
              onLessonSelect={onLessonSelect}
            />
          );
        })}
      </nav>

      {/* Progress footer */}
      <div className="border-t border-border px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">Overall Progress</span>
          <span className="text-xs font-medium text-accent">{completionPct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {progress.learningStreak.currentStreak > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <Flame className="h-3 w-3 text-warning" />
            <span>{progress.learningStreak.currentStreak} day streak</span>
          </div>
        )}
      </div>
    </div>
  );
}
