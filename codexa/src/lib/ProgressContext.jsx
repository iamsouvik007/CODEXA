import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'codexa-progress';

const defaultProgress = {
  completedLessons: [],
  currentLesson: '1',
  currentModule: '1',
  quizScores: {},
  learningStreak: {
    currentStreak: 0,
    lastStudyDate: null,
    longestStreak: 0,
  },
  lessonProgress: {},
  totalStudyTimeMinutes: 0,
};

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return { ...defaultProgress };
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);
  const saveTimeout = useRef(null);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch {
        // Ignore storage errors
      }
    }, 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [progress]);

  const markLessonComplete = useCallback((lessonId) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const today = new Date().toISOString().split('T')[0];
      const streak = { ...prev.learningStreak };

      if (streak.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (streak.lastStudyDate === yesterday) {
          streak.currentStreak += 1;
        } else {
          streak.currentStreak = 1;
        }
        streak.lastStudyDate = today;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      }

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        learningStreak: streak,
      };
    });
  }, []);

  const setCurrentLesson = useCallback((lessonId) => {
    setProgress(prev => ({ ...prev, currentLesson: lessonId }));
  }, []);

  const saveQuizScore = useCallback((lessonId, score, total) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [lessonId]: {
          score,
          total,
          lastAttempt: new Date().toISOString(),
          bestScore: Math.max(score, prev.quizScores[lessonId]?.bestScore || 0),
        },
      },
    }));
  }, []);

  const updateLessonProgress = useCallback((lessonId, scrollPercent) => {
    setProgress(prev => ({
      ...prev,
      lessonProgress: {
        ...prev.lessonProgress,
        [lessonId]: {
          ...prev.lessonProgress[lessonId],
          scrollPercent,
          lastAccessed: new Date().toISOString(),
        },
      },
    }));
  }, []);

  const isLessonComplete = useCallback((lessonId) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const getCompletionPercentage = useCallback((totalLessons) => {
    return totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;
  }, [progress.completedLessons]);

  const getMasteryPercentage = useCallback(() => {
    const scores = Object.values(progress.quizScores);
    if (scores.length === 0) return 0;
    const avg = scores.reduce((sum, s) => sum + (s.bestScore / s.total) * 100, 0) / scores.length;
    return Math.round(avg);
  }, [progress.quizScores]);

  const value = {
    progress,
    markLessonComplete,
    setCurrentLesson,
    saveQuizScore,
    updateLessonProgress,
    isLessonComplete,
    getCompletionPercentage,
    getMasteryPercentage,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
