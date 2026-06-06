import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart3, BookOpen, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { useAITutor } from '../../lib/AITutorContext';
import { getNextLesson, getPrevLesson } from '../../lib/lessonData';
import QuizEngine from './quiz/QuizEngine';
import RevisionMode from './RevisionMode';
import MarkdownRenderer from './MarkdownRenderer';



export default function LessonView({ lesson, onOpenModal }) {
  const navigate = useNavigate();
  const { isLessonComplete, updateLessonProgress, incrementStudyTime } = useProgress();
  const { setLessonContext } = useAITutor();
  const [activeTab, setActiveTab] = useState('lesson');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  const isComplete = isLessonComplete(lesson.id);
  const nextLesson = getNextLesson(lesson.id);
  const prevLesson = getPrevLesson(lesson.id);

  // Active study timer effect
  useEffect(() => {
    let activeSeconds = 0;
    let timer = null;

    const startTimer = () => {
      if (!timer) {
        timer = setInterval(() => {
          activeSeconds += 1;
          if (activeSeconds >= 10) {
            incrementStudyTime(activeSeconds);
            activeSeconds = 0;
          }
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (activeSeconds > 0) {
        incrementStudyTime(activeSeconds);
        activeSeconds = 0;
      }
    };

    if (document.visibilityState === 'visible') {
      startTimer();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimer();
      } else {
        stopTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lesson.id, incrementStudyTime]);

  // Sync active lesson context with AI Tutor
  useEffect(() => {
    if (lesson) {
      setLessonContext({
        title: lesson.title,
        moduleId: lesson.moduleId,
        metadata: lesson.metadata,
        sections: lesson.sections,
        quiz: lesson.quiz,
        activeTab: activeTab
      });
    }
    return () => {
      setLessonContext(null);
    };
  }, [lesson.id, activeTab, setLessonContext]);

  // Scroll to top when lesson or tab changes
  useEffect(() => {
    const el = document.getElementById('lesson-scroll-container') || document.documentElement;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id, activeTab]);

  // Scroll progress tracking
  useEffect(() => {
    const el = document.getElementById('lesson-scroll-container') || document.documentElement;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setScrollProgress(pct);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [lesson.id]);

  // Debounced progress save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollProgress > 0) {
        updateLessonProgress(lesson.id, scrollProgress);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [scrollProgress, lesson.id, updateLessonProgress]);



  const difficultyColors = {
    beginner: 'bg-success/10 text-success',
    intermediate: 'bg-warning/10 text-warning',
    advanced: 'bg-accent/10 text-accent',
  };

  const tabs = [
    { id: 'lesson', label: 'Lesson' },
    { id: 'quiz', label: `Quiz (${lesson.quiz?.length || 0})` },
    { id: 'revision', label: 'Revision' },
  ];

  return (
    <div className="pb-24 lg:pb-8">
      {/* Scroll progress bar */}
      <div className="fixed top-0 right-0 left-0 z-20 h-0.5 lg:left-[var(--sidebar-width,280px)]">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Lesson header */}
      <header className="border-b border-border bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
            <button onClick={() => navigate('/learn')} className="hover:text-text transition-colors">Learn</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-text-secondary">Web Development</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-text-secondary">Module {lesson.moduleId}</span>
          </div>

          {/* Title + Meta */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-text sm:text-3xl" style={{ letterSpacing: '-1.28px' }}>
                {lesson.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${difficultyColors[lesson.metadata.difficulty]}`}>
                  {lesson.metadata.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {lesson.metadata.conceptCount} concepts
                </span>
              </div>
            </div>

            {/* Status indicator (desktop) */}
            {isComplete ? (
              <div className="hidden items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success sm:flex">
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed</span>
              </div>
            ) : (
              <div
                className="hidden items-center gap-2 rounded-full border border-border bg-[#0b0c10] px-4 py-2 text-sm font-medium text-text-muted sm:flex"
                title="Complete the Lesson Quiz and the Mock Test to mark this lesson as completed."
              >
                <Circle className="h-4 w-4" />
                <span>In Progress</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 border-t border-border pt-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:bg-bg-card hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div ref={contentRef} className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {activeTab === 'lesson' && (
          <div className="space-y-6">
            <MarkdownRenderer tokens={lesson.tokens} />

            {/* Next lesson CTA */}
            {nextLesson && (
              <div className="mt-12 rounded-xl border border-border bg-bg-card p-6 shadow-card">
                <p className="text-sm text-text-muted">Next Lesson</p>
                <h3 className="mt-1 font-heading text-lg font-semibold text-text">{nextLesson.title}</h3>
                <button
                  onClick={() => navigate(`/learn/web-development/${nextLesson.id}`)}
                  className="mt-3 rounded-pill bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  Continue Learning →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <QuizEngine lesson={lesson} />
        )}

        {activeTab === 'revision' && (
          <RevisionMode lesson={lesson} />
        )}
      </div>
    </div>
  );
}
