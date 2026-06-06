import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'codexa-progress';

const defaultProgress = {
  completedLessons: ['1', '2'], // Preset lessons 1 and 2 completed to show 29% progress as in the mockup
  bookmarkedLessons: [],
  currentLesson: '3',
  currentModule: 'fundamentals',
  quizScores: {},
  learningStreak: {
    currentStreak: 2,
    lastStudyDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
    longestStreak: 3,
  },
  xp: 140, // Starter XP (2 completed lessons * 50 XP + quiz/vis XP)
  achievements: ['Hello World', 'Code Runner'],
  mastery: {
    concept: 65,
    visualization: 50,
    practice: 30,
    quiz: 55,
    revision: 70,
  },
  activityCalendar: (() => {
    const calendar = {};
    const today = new Date();
    // Pre-populate some history for the contributions grid
    for (let i = 1; i <= 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (i === 1 || i === 2) {
        calendar[dateStr] = 2; // Heavy activity (streak days)
      } else if (i % 4 === 0) {
        calendar[dateStr] = 1; // Light activity
      } else {
        calendar[dateStr] = 0;
      }
    }
    return calendar;
  })(),
  dailyChallengeCompleted: false,
  mockTestHistory: [],
  streakJourneyStarted: false,
  lessonProgress: {},
  totalStudyTimeMinutes: 42,
};

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure complex objects exist
      return {
        ...defaultProgress,
        ...parsed,
        learningStreak: { ...defaultProgress.learningStreak, ...(parsed.learningStreak || {}) },
        mastery: { ...defaultProgress.mastery, ...(parsed.mastery || {}) },
        activityCalendar: { ...defaultProgress.activityCalendar, ...(parsed.activityCalendar || {}) },
      };
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

      // Update contribution calendar
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      // Note: Completion alone doesn't increment daily streak unless streak journey started
      if (prev.streakJourneyStarted && streak.lastStudyDate !== today) {
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
        activityCalendar: updatedCalendar,
        xp: prev.xp + 50, // +50 XP for lesson completion
      };
    });
  }, []);

  const toggleBookmark = useCallback((lessonId) => {
    setProgress(prev => {
      const bookmarked = prev.bookmarkedLessons.includes(lessonId)
        ? prev.bookmarkedLessons.filter(id => id !== lessonId)
        : [...prev.bookmarkedLessons, lessonId];
      return { ...prev, bookmarkedLessons: bookmarked };
    });
  }, []);

  const isLessonBookmarked = useCallback((lessonId) => {
    return progress.bookmarkedLessons.includes(lessonId);
  }, [progress.bookmarkedLessons]);

  const addXP = useCallback((amount) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const startStreakJourney = useCallback(() => {
    setProgress(prev => ({ ...prev, streakJourneyStarted: true }));
  }, []);

  const completeDailyChallenge = useCallback((difficulty = 'medium') => {
    const xpReward = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 50;
    setProgress(prev => {
      if (prev.dailyChallengeCompleted) return prev;
      const today = new Date().toISOString().split('T')[0];
      const streak = { ...prev.learningStreak };
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      if (streak.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (streak.lastStudyDate === yesterday || !streak.lastStudyDate) {
          streak.currentStreak = (streak.currentStreak || 0) + 1;
        } else {
          streak.currentStreak = 1;
        }
        streak.lastStudyDate = today;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      }

      return {
        ...prev,
        dailyChallengeCompleted: true,
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        xp: prev.xp + xpReward,
      };
    });
  }, []);

  const submitMockTest = useCallback((score, total, track = 'JavaScript') => {
    const xpReward = Math.round((score / total) * 40);
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const streak = { ...prev.learningStreak };
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      if (streak.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (streak.lastStudyDate === yesterday || !streak.lastStudyDate) {
          streak.currentStreak = (streak.currentStreak || 0) + 1;
        } else {
          streak.currentStreak = 1;
        }
        streak.lastStudyDate = today;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      }

      const newTest = {
        date: today,
        score,
        total,
        track,
        percentage: Math.round((score / total) * 100),
      };

      return {
        ...prev,
        mockTestHistory: [...prev.mockTestHistory, newTest],
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        xp: prev.xp + xpReward,
      };
    });
  }, []);

  const setCurrentLesson = useCallback((lessonId) => {
    setProgress(prev => ({ ...prev, currentLesson: lessonId }));
  }, []);

  const saveQuizScore = useCallback((lessonId, score, total) => {
    setProgress(prev => {
      const updatedScores = {
        ...prev.quizScores,
        [lessonId]: {
          score,
          total,
          lastAttempt: new Date().toISOString(),
          bestScore: Math.max(score, prev.quizScores[lessonId]?.bestScore || 0),
        },
      };

      // Recalculate quiz accuracy
      const quizAttempts = Object.values(updatedScores);
      const totalCorrect = quizAttempts.reduce((sum, s) => sum + s.bestScore, 0);
      const totalQuestions = quizAttempts.reduce((sum, s) => sum + s.total, 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      return {
        ...prev,
        quizScores: updatedScores,
        mastery: {
          ...prev.mastery,
          quiz: Math.min(100, Math.round(accuracy)),
        },
        xp: prev.xp + 30, // +30 XP for taking quiz
      };
    });
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
    toggleBookmark,
    isLessonBookmarked,
    addXP,
    startStreakJourney,
    completeDailyChallenge,
    submitMockTest,
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
