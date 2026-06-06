import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { getLessonById, getAllLessons, getNextLesson, getPrevLesson, curriculum } from '../lib/lessonData';
import { useProgress } from '../lib/ProgressContext';
import LessonSidebar from '../components/learn/LessonSidebar';
import LessonView from '../components/learn/LessonView';
import MobileBottomNav from '../components/learn/MobileBottomNav';

export default function WebDevTrack() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { onOpenModal } = useOutletContext();
  const { setCurrentLesson } = useProgress();
  const allLessons = getAllLessons();

  // Default to first lesson or last accessed
  const activeId = lessonId || allLessons[0]?.id || '1';
  const lesson = getLessonById(activeId);
  const nextLesson = getNextLesson(activeId);
  const prevLesson = getPrevLesson(activeId);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setCurrentLesson(activeId);
  }, [activeId, setCurrentLesson]);

  const handleLessonSelect = (id) => {
    navigate(`/learn/web-development/${id}`);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (nextLesson) handleLessonSelect(nextLesson.id);
  };

  const handlePrev = () => {
    if (prevLesson) handleLessonSelect(prevLesson.id);
  };

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-semibold text-text">Lesson not found</h2>
          <p className="mt-2 text-text-secondary">This lesson doesn't exist yet.</p>
          <button
            onClick={() => navigate('/learn')}
            className="mt-4 rounded-pill bg-accent px-6 py-2 text-sm font-medium text-white"
          >
            Back to Learning Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <LessonSidebar
          lessons={allLessons}
          activeLessonId={activeId}
          curriculum={curriculum}
          onLessonSelect={handleLessonSelect}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] lg:hidden"
            >
              <LessonSidebar
                lessons={allLessons}
                activeLessonId={activeId}
                curriculum={curriculum}
                onLessonSelect={handleLessonSelect}
                onClose={() => setSidebarOpen(false)}
                isMobile
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main className="flex-1 lg:ml-[280px]">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-bg-card hover:text-text"
            aria-label="Open lesson menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{lesson.title}</p>
            <p className="text-xs text-text-muted">Module {lesson.moduleId}</p>
          </div>
        </div>

        {/* Lesson content */}
        <LessonView
          lesson={lesson}
          onOpenModal={onOpenModal}
        />

        {/* Mobile bottom nav */}
        <MobileBottomNav
          lesson={lesson}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
