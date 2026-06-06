import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, Lock, BookOpen, Bookmark, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';

export default function LessonSidebar({ activeLessonId, onSelect, activeSelection, isCollapsed = false, onToggleCollapse }) {
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
            { id: '1', title: 'Lecture 01 - Introduction to JavaScript', difficulty: 'beginner' },
            { id: '2', title: 'Lecture 02 - Variables & Data Types', difficulty: 'beginner' },
            { id: '3', title: 'Lecture 03 - Operators & Expressions', difficulty: 'intermediate' },
            { id: '4', title: 'Lecture 04 - Control Flow & Loops', difficulty: 'intermediate' }
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

  if (isCollapsed) {
    return (
      <div className="flex h-screen flex-col bg-[#0a0a0c] w-[60px] items-center py-4 select-none">
        
        {/* Compact Progress Section */}
        <div className="group relative flex flex-col items-center justify-center pb-4 border-b border-border/30 bg-bg-soft/40 w-full mb-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="20" cy="20" r="14" className="stroke-bg-elevated fill-none" strokeWidth="2.5" />
              <circle
                cx="20"
                cy="20"
                r="14"
                className="stroke-accent fill-none"
                strokeWidth="2.5"
                strokeDasharray={2 * Math.PI * 14}
                strokeDashoffset={2 * Math.PI * 14 - (progressPct / 100) * (2 * Math.PI * 14)}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm">🔥</span>
          </div>
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 rounded bg-[#0c0c0e] border border-border px-3 py-2 text-xs text-text opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap shadow-elevated">
            <div className="font-bold text-accent">{progressPct}% Complete</div>
            <div className="text-[10px] text-text-muted mt-0.5">{completedCount} / {totalLessons} Lessons</div>
            {progress.learningStreak?.currentStreak > 0 && (
              <div className="text-[10px] text-amber-500 mt-0.5 font-mono font-medium">🔥 {progress.learningStreak.currentStreak} Day Streak</div>
            )}
          </span>
        </div>

        {/* Search Icon (expands sidebar) */}
        <button
          onClick={onToggleCollapse}
          className="group relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-bg-card hover:text-text transition-colors mb-4 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 rounded bg-[#0c0c0e] border border-border px-2.5 py-1.5 text-xs text-text opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap shadow-elevated">
            Search Lessons (Ctrl + B)
          </span>
        </button>

        {/* Vertical Icon Navigation List */}
        <nav className="flex-1 w-full flex flex-col items-center gap-2 px-2 overflow-y-auto scrollbar-none" aria-label="Course explorer collapsed" data-lenis-prevent>
          {curriculumTree.map((track) => {
            const isComingSoon = track.status === 'coming-soon';
            
            if (isComingSoon) {
              return (
                <button
                  key={track.id}
                  onClick={() => onSelect({ type: 'locked', name: `${track.title} Track` })}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-bg-card hover:text-text transition-colors cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 rounded bg-[#0c0c0e] border border-border px-3 py-2 text-xs text-text opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap shadow-elevated flex flex-col gap-0.5">
                    <div className="font-semibold text-text">{track.title} Track</div>
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider">Coming Soon</div>
                  </span>
                </button>
              );
            }

            // For active track (JavaScript), let's render the list of lessons under its active module
            const jsModule = track.modules.find(m => m.status === 'active');
            if (!jsModule) return null;

            return (
              <div key={track.id} className="flex flex-col items-center gap-2 w-full border-t border-border/30 pt-3 mt-1">
                {filteredFundamentalsLessons.map((lesson, idx) => {
                  const isActive = activeSelection.type === 'lesson' && activeSelection.id === lesson.id;
                  const isBookmarked = isLessonBookmarked(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelect({ type: 'lesson', id: lesson.id })}
                      className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-accent/15 text-accent border border-accent/20'
                          : 'text-text-muted hover:bg-bg-card hover:text-text'
                      }`}
                    >
                      {renderLessonStateIcon(lesson.id)}
                      
                      {/* Hover Tooltip */}
                      <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 z-50 rounded bg-[#0c0c0e] border border-border px-3 py-2 text-xs text-text opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap shadow-elevated flex flex-col gap-1">
                        <div className="font-semibold text-text flex items-center gap-1.5">
                          <span>Lecture 0{idx + 1}</span>
                          {isBookmarked && <Bookmark className="h-3 w-3 fill-accent text-accent" />}
                        </div>
                        <div className="text-text-secondary">{lesson.title}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-2">
                          <span className="capitalize">{lesson.difficulty}</span>
                        </div>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col border-r border-border bg-[#0a0a0c] w-full">
      
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
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin select-none" aria-label="Course explorer" data-lenis-prevent>
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
