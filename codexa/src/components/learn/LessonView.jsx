import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart3, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { getNextLesson, getPrevLesson } from '../../lib/lessonData';
import ConceptCard from './cards/ConceptCard';
import CodeBlock from './cards/CodeBlock';
import AnalogyCard from './cards/AnalogyCard';
import WarningCard from './cards/WarningCard';
import MisconceptionCard from './cards/MisconceptionCard';
import InterviewTipCard from './cards/InterviewTipCard';
import SummaryCard from './cards/SummaryCard';
import DataTable from './cards/DataTable';
import InsightCard from './cards/InsightCard';
import QuizEngine from './quiz/QuizEngine';
import RevisionMode from './RevisionMode';

const cardComponents = {
  concept: ConceptCard,
  'code-example': CodeBlock,
  analogy: AnalogyCard,
  warning: WarningCard,
  misconception: MisconceptionCard,
  'interview-tip': InterviewTipCard,
  summary: SummaryCard,
  insight: InsightCard,
};

export default function LessonView({ lesson, onOpenModal }) {
  const navigate = useNavigate();
  const { isLessonComplete, markLessonComplete, updateLessonProgress } = useProgress();
  const [activeTab, setActiveTab] = useState('lesson');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  const isComplete = isLessonComplete(lesson.id);
  const nextLesson = getNextLesson(lesson.id);
  const prevLesson = getPrevLesson(lesson.id);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setScrollProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced progress save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollProgress > 0) {
        updateLessonProgress(lesson.id, scrollProgress);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [scrollProgress, lesson.id, updateLessonProgress]);

  const handleMarkComplete = useCallback(() => {
    markLessonComplete(lesson.id);
  }, [lesson.id, markLessonComplete]);

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
      <div className="fixed top-0 right-0 left-0 z-20 h-0.5 lg:left-[280px]">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Lesson header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-xl">
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
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {lesson.metadata.estimatedReadingTime} min read
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${difficultyColors[lesson.metadata.difficulty]}`}>
                  {lesson.metadata.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {lesson.metadata.conceptCount} concepts
                </span>
              </div>
            </div>

            {/* Mark complete button (desktop) */}
            <button
              onClick={handleMarkComplete}
              disabled={isComplete}
              className={`hidden items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-all sm:flex ${
                isComplete
                  ? 'border border-success/30 bg-success/10 text-success'
                  : 'bg-accent text-white hover:bg-accent-deep'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isComplete ? 'Completed' : 'Mark Complete'}
            </button>
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
            {lesson.sections.map((section, idx) => {
              // If section has tables, render them
              if (section.tables && section.tables.length > 0) {
                return (
                  <div key={idx} className="space-y-6">
                    {section.heading && (
                      <ConceptCard section={{ ...section, content: section.content.replace(/<table[\s\S]*?<\/table>/gi, '') }} index={idx} />
                    )}
                    {section.tables.map((table, ti) => (
                      <DataTable key={`${idx}-t-${ti}`} html={table} />
                    ))}
                  </div>
                );
              }

              // If section has code blocks and is a concept type, render both
              if (section.codeBlocks && section.codeBlocks.length > 0 && section.type === 'concept') {
                return (
                  <div key={idx} className="space-y-4">
                    <ConceptCard section={section} index={idx} />
                    {section.codeBlocks.map((block, ci) => (
                      <CodeBlock key={`${idx}-c-${ci}`} code={block.code} language={block.language} />
                    ))}
                  </div>
                );
              }

              const Card = cardComponents[section.type] || ConceptCard;
              return <Card key={idx} section={section} index={idx} />;
            })}

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
