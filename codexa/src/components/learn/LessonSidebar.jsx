import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, Lock, BookOpen, Bookmark, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';

export default function LessonSidebar({ activeLessonId, onSelect, activeSelection }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded states for folders
  const [expanded, setExpanded] = useState({
    html: false,
    css: false,
    javascript: true,
    fundamentals: true
  });

  const { progress, isLessonComplete, toggleBookmark, isLessonBookmarked } = useProgress();

  const toggleFolder = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Static curriculum declaration
  const curriculumTree = [
    {
      id: 'html',
      title: 'HTML',
      type: 'track',
      status: 'coming-soon',
      modules: []
    },
    {
      id: 'css',
      title: 'CSS',
      type: 'track',
      status: 'coming-soon',
      modules: []
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      type: 'track',
      status: 'active',
      modules: [
        {
          id: 'fundamentals',
          title: 'Fundamentals',
          status: 'active',
          lessons: [
            { id: '1', title: 'Lecture 01 - Introduction to JavaScript', duration: '12m', difficulty: 'beginner' },
            { id: '2', title: 'Lecture 02 - Variables & Data Types', duration: '15m', difficulty: 'beginner' },
            { id: '3', title: 'Lecture 03 - Operators & Expressions', duration: '20m', difficulty: 'intermediate' },
            { id: '4', title: 'Lecture 04 - Control Flow & Loops', duration: '25m', difficulty: 'intermediate' }
          ]
        },
        { id: 'functions', title: 'Functions', status: 'coming-soon', lessons: [] },
        { id: 'arrays', title: 'Arrays', status: 'coming-soon', lessons: [] },
        { id: 'objects', title: 'Objects', status: 'coming-soon', lessons: [] },
        { id: 'dom', title: 'DOM', status: 'coming-soon', lessons: [] },
        { id: 'async', title: 'Async JavaScript', status: 'coming-soon', lessons: [] },
        { id: 'es6', title: 'ES6+', status: 'coming-soon', lessons: [] },
        { id: 'projects', title: 'Projects', status: 'coming-soon', lessons: [] }
      ]
    }
  ];

  // Total lessons in active Fundamentals track
  const totalLessons = 4;
  const completedCount = curriculumTree
    .find(t => t.id === 'javascript')
    .modules.find(m => m.id === 'fundamentals')
    .lessons.filter(l => isLessonComplete(l.id)).length;

  const progressPct = Math.round((completedCount / totalLessons) * 100);

  // Filter lessons based on search
  const filteredFundamentalsLessons = useMemo(() => {
    const lessons = curriculumTree
      .find(t => t.id === 'javascript')
      .modules.find(m => m.id === 'fundamentals').lessons;
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(l => l.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const renderLessonStateIcon = (lessonId) => {
    const complete = isLessonComplete(lessonId);
    const lessonProgress = progress.lessonProgress?.[lessonId]?.scrollPercent || 0;

    if (complete) {
      return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />;
    } else if (lessonProgress > 0) {
      return <CircleDot className="h-3.5 w-3.5 shrink-0 text-accent" />; // ◐ in progress
    } else {
      return <Circle className="h-3.5 w-3.5 shrink-0 text-text-muted" />; // ○ not started
    }
  };

  return (
    <div className="flex h-screen flex-col border-r border-border bg-[#0a0a0c] w-[280px]">
      
      {/* Dynamic Progress Header */}
      <div className="border-b border-border p-4 bg-bg-soft/40">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">JavaScript Foundations</span>
          <span className="text-xs font-bold text-accent">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated relative">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-amber-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-muted">
          <span>{completedCount} / {totalLessons} Lessons Completed</span>
          {progress.learningStreak?.currentStreak > 0 && (
            <span className="text-amber-500 font-medium font-mono">🔥 {progress.learningStreak.currentStreak}d Streak</span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full bg-transparent text-xs text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* File Explorer Tree */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin select-none" aria-label="Course explorer">
        {curriculumTree.map((track) => {
          const isTrackExpanded = expanded[track.id];
          const isComingSoon = track.status === 'coming-soon';

          return (
            <div key={track.id} className="space-y-0.5">
              {/* Track Root Row */}
              <button
                onClick={() => {
                  if (isComingSoon) {
                    onSelect({ type: 'locked', name: `${track.title} Track` });
                  } else {
                    toggleFolder(track.id);
                  }
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-bg-card ${
                  activeSelection.type === 'locked' && activeSelection.name.startsWith(track.title)
                    ? 'bg-accent/10 text-accent border-l-2 border-accent rounded-l-none'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {isComingSoon ? (
                  <Lock className="h-3.5 w-3.5 text-text-muted shrink-0" />
                ) : isTrackExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                )}
                <span className="flex-1 truncate">{track.title}</span>
                {isComingSoon && (
                  <span className="text-[8px] font-bold tracking-wider text-accent border border-accent/25 rounded px-1 py-0.2 select-none uppercase">
                    Soon
                  </span>
                )}
              </button>

              {/* Track Content */}
              <AnimatePresence initial={false}>
                {!isComingSoon && isTrackExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="overflow-hidden pl-3 space-y-0.5 border-l border-border/40 ml-3.5"
                  >
                    {track.modules.map((mod) => {
                      const isModExpanded = expanded[mod.id];
                      const isModComingSoon = mod.status === 'coming-soon';

                      return (
                        <div key={mod.id} className="space-y-0.5">
                          {/* Module Header Row */}
                          <button
                            onClick={() => {
                              if (isModComingSoon) {
                                onSelect({ type: 'locked', name: `JavaScript - ${mod.title}` });
                              } else {
                                toggleFolder(mod.id);
                              }
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] font-medium transition-colors hover:bg-bg-card ${
                              activeSelection.type === 'locked' && activeSelection.name.includes(mod.title)
                                ? 'bg-accent/10 text-accent'
                                : 'text-text-secondary hover:text-text'
                            }`}
                          >
                            {isModComingSoon ? (
                              <Lock className="h-3 w-3 text-text-muted shrink-0" />
                            ) : isModExpanded ? (
                              <ChevronDown className="h-3 w-3 text-text-muted shrink-0" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-text-muted shrink-0" />
                            )}
                            <span className="flex-1 truncate">{mod.title}</span>
                            {isModComingSoon && (
                              <span className="text-[7px] font-bold text-text-muted border border-border rounded px-0.8 py-0.1 uppercase scale-90">
                                Soon
                              </span>
                            )}
                          </button>

                          {/* Module Lessons list */}
                          {!isModComingSoon && isModExpanded && (
                            <div className="pl-3 py-0.5 space-y-0.5 border-l border-border/30 ml-2.5">
                              {filteredFundamentalsLessons.map((lesson) => {
                                const isActive = activeSelection.type === 'lesson' && activeSelection.id === lesson.id;
                                const isBookmarked = isLessonBookmarked(lesson.id);

                                return (
                                  <div
                                    key={lesson.id}
                                    className={`group flex items-center justify-between rounded-lg pr-1.5 transition-all ${
                                      isActive
                                        ? 'bg-accent/15 text-accent font-medium border-l-2 border-accent rounded-l-none'
                                        : 'text-text-muted hover:bg-bg-card hover:text-text'
                                    }`}
                                  >
                                    {/* Lesson Info Button */}
                                    <button
                                      onClick={() => onSelect({ type: 'lesson', id: lesson.id })}
                                      className="flex-1 flex items-center gap-2.5 px-2.5 py-1.8 text-left text-[11px] truncate"
                                    >
                                      {renderLessonStateIcon(lesson.id)}
                                      <span className="truncate flex-1">{lesson.title}</span>
                                      <span className="text-[9px] text-text-muted/60 scale-90 font-mono">{lesson.duration}</span>
                                    </button>

                                    {/* Bookmark Action */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(lesson.id);
                                      }}
                                      className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-accent opacity-60 group-hover:opacity-100"
                                      aria-label="Bookmark lesson"
                                    >
                                      <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-accent text-accent' : ''}`} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
