import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Bot, Terminal, Award, BookOpen, Flame, Compass, Home } from 'lucide-react';
import { getLessonById, getAllLessons, getNextLesson, getPrevLesson } from '../lib/lessonData';
import { useProgress } from '../lib/ProgressContext';
import { useAITutor } from '../lib/AITutorContext';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonView from '../components/learn/LessonView';
import ComingSoonView from '../components/learn/ComingSoonView';
import PracticeWorkspace from '../components/learn/PracticeWorkspace';
import QuizEngine from '../components/learn/quiz/QuizEngine';
import DashboardWorkspace from '../components/learn/DashboardWorkspace';

const rightPanelQuestions = {
  '1': [
    "Why was JavaScript created in 10 days?",
    "What is the difference between Java and JavaScript?",
    "Why can't we put C++ in the browser?",
    "How did JavaScript defeat Java applets?",
    "Explain the concept of JavaScript as 'glue'."
  ],
  '2': [
    "What is the difference between let and const?",
    "What is the Temporal Dead Zone (TDZ)?",
    "What are the primitive data types in JS?",
    "How are values vs references stored?",
    "Show me variable scope examples."
  ],
  '3': [
    "Why is typeof null an object?",
    "What is the difference between == and ===?",
    "What is logical short-circuiting in JS?",
    "Can you explain remainder operator use cases?",
    "Explain the prefix vs postfix increment Gotcha."
  ],
  '4': [
    "What is the difference between break and continue?",
    "How do we prevent infinite loops?",
    "When should I use switch vs if-else?",
    "What is the structure of a for loop?",
    "Explain standard truthy and falsy values."
  ]
};

export default function WebDevTrack() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { onOpenModal } = useOutletContext();
  const { progress, setCurrentLesson, saveQuizScore } = useProgress();
  const { open } = useAITutor();
  const allLessons = getAllLessons();

  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'practice' | 'quiz' | 'dashboard'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState({ type: 'lesson', id: lessonId || '3' });

  // Sync route param
  useEffect(() => {
    if (lessonId) {
      setActiveSelection({ type: 'lesson', id: lessonId });
      setCurrentLesson(lessonId);
    }
  }, [lessonId, setCurrentLesson]);

  const activeLesson = getLessonById(activeSelection.id);
  const nextLesson = getNextLesson(activeSelection.id);
  const prevLesson = getPrevLesson(activeSelection.id);

  const handleSidebarSelect = (selection) => {
    setActiveSelection(selection);
    if (selection.type === 'lesson') {
      navigate(`/learn/web-development/${selection.id}`);
      // If we were on dashboard/locked, switch back to lesson content view
      if (activeTab === 'dashboard') setActiveTab('lesson');
    }
    setSidebarOpen(false);
  };

  const handleLessonChange = (id) => {
    navigate(`/learn/web-development/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestions = rightPanelQuestions[activeSelection.id] || rightPanelQuestions['3'];

  return (
    <div className="flex h-screen bg-[#08080a] overflow-hidden">
      
      {/* 1. Sidebar Explorer (Desktop) */}
      <aside className="hidden lg:block shrink-0">
        <LessonSidebar
          activeLessonId={activeSelection.id}
          onSelect={handleSidebarSelect}
          activeSelection={activeSelection}
        />
      </aside>

      {/* 1b. Sidebar Explorer (Mobile drawer overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              <LessonSidebar
                activeLessonId={activeSelection.id}
                onSelect={handleSidebarSelect}
                activeSelection={activeSelection}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. Middle Content Panel (Mac shell wrapper) */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#08080a]">
        
        {/* Mac OS Simulated Title Bar Header */}
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between border-b border-border/50 bg-[#0a0a0d] px-4 py-2.5 backdrop-blur-md">
          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text cursor-pointer"
              aria-label="Go to landing page"
            >
              <Home className="h-3.5 w-3.5 text-accent" />
              <span className="hidden xs:inline">Home</span>
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text lg:hidden shrink-0"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 select-none">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            
            <span className="hidden md:inline font-mono text-[10px] uppercase font-bold tracking-wider text-text-muted/65 ml-2">
              Codexa — JavaScript Fundamentals
            </span>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-1 bg-[#141419] border border-border/40 rounded-lg p-0.5 select-none">
            {[
              { id: 'lesson', label: 'Lesson', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: Terminal },
              { id: 'quiz', label: 'Quiz', icon: Award },
              { id: 'dashboard', label: 'Dashboard', icon: Flame }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isTabActive
                      ? 'bg-accent/15 text-accent shadow-sm'
                      : 'text-text-muted hover:text-text hover:bg-bg-elevated/40'
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Inner views */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          <AnimatePresence mode="wait">
            {activeSelection.type === 'locked' ? (
              <ComingSoonView key="locked" name={activeSelection.name} />
            ) : (
              <motion.div
                key={activeTab + '-' + activeSelection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'lesson' && activeLesson && (
                  <LessonView
                    lesson={activeLesson}
                    onOpenModal={onOpenModal}
                  />
                )}
                {activeTab === 'practice' && (
                  <PracticeWorkspace lessonId={activeSelection.id} />
                )}
                {activeTab === 'quiz' && activeLesson && (
                  <QuizEngine lesson={activeLesson} />
                )}
                {activeTab === 'dashboard' && (
                  <DashboardWorkspace onLessonSelect={handleLessonChange} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
