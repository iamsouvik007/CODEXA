import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'codexa-progress';

const defaultProgress = {
  completedLessons: [], // Fresh start — no lessons pre-completed for new users
  bookmarkedLessons: [],
  currentLesson: '1',
  currentModule: 'fundamentals',
  quizScores: {},
  learningStreak: {
    currentStreak: 0,
    lastStudyDate: null,
    longestStreak: 0,
  },
  xp: 0,
  achievements: [],
  mastery: {
    concept: 0,
    visualization: 0,
    practice: 0,
    quiz: 0,
    revision: 0,
  },
  activityCalendar: {},
  dailyChallengeCompleted: false,
  mockTestHistory: [],
  streakJourneyStarted: false,
  lessonProgress: {},
  totalStudyTimeMinutes: 0,
  completedChallenges: [],
  completedMockTests: {},
  dailyActivity: {},
  totalStudyTimeSeconds: 0,
  totalCorrectAnswers: 0,
  totalQuestionsAttempted: 0,
  hasRunCode: false,
};

// Version bump — increment this when the default data schema changes to wipe stale cache
const DATA_VERSION = 3;
const DATA_VERSION_KEY = 'codexa-progress-version';

function loadProgress() {
  try {
    const storedVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
    if (storedVersion < DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
      return { ...defaultProgress };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultProgress,
        ...parsed,
        learningStreak: { ...defaultProgress.learningStreak, ...(parsed.learningStreak || {}) },
        mastery: { ...defaultProgress.mastery, ...(parsed.mastery || {}) },
        activityCalendar: { ...defaultProgress.activityCalendar, ...(parsed.activityCalendar || {}) },
        completedChallenges: parsed.completedChallenges || [],
        completedMockTests: parsed.completedMockTests || {},
        dailyActivity: parsed.dailyActivity || {},
      };
    }
  } catch {
    // Ignore parse errors
  }
  localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
  return { ...defaultProgress };
}

function updateStreak(prevProgress, today) {
  const streak = { ...prevProgress.learningStreak };
  let bonusXp = 0;
  if (streak.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streak.lastStudyDate === yesterday || !streak.lastStudyDate) {
      streak.currentStreak = (streak.currentStreak || 0) + 1;
      if (streak.currentStreak % 7 === 0 && streak.currentStreak > 0) {
        bonusXp = 100;
      }
    } else {
      streak.currentStreak = 1;
    }
    streak.lastStudyDate = today;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  }
  return { streak, bonusXp };
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
      const { streak, bonusXp } = updateStreak(prev, today);

      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].activities += 1;
      updatedDailyActivity[today].xp += 20 + bonusXp;

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        dailyActivity: updatedDailyActivity,
        xp: prev.xp + 20 + bonusXp, // +20 XP for lesson completion
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
      const { streak, bonusXp } = updateStreak(prev, today);
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].activities += 1;
      updatedDailyActivity[today].xp += xpReward + bonusXp;

      return {
        ...prev,
        dailyChallengeCompleted: true,
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        dailyActivity: updatedDailyActivity,
        xp: prev.xp + xpReward + bonusXp,
      };
    });
  }, []);

  const submitMockTest = useCallback((score, total, track = 'JavaScript', lessonId = null) => {
    setProgress(prev => {
      const xpEarned = 50; // Mock Test Completed → +50 XP
      const today = new Date().toISOString().split('T')[0];
      const { streak, bonusXp } = updateStreak(prev, today);
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      const newTest = {
        date: today,
        score,
        total,
        track,
        lessonId,
        percentage: Math.round((score / total) * 100),
      };

      const completedMockTests = { ...(prev.completedMockTests || {}) };
      if (lessonId) {
        completedMockTests[lessonId] = true;
      }

      let completedLessons = [...prev.completedLessons];
      let finalXpEarned = xpEarned + bonusXp;

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].activities += 1;
      updatedDailyActivity[today].xp += xpEarned + bonusXp;

      if (lessonId && !completedLessons.includes(lessonId)) {
        const isQuizDone = prev.quizScores[lessonId] !== undefined;
        if (isQuizDone) {
          completedLessons.push(lessonId);
          finalXpEarned += 20; // +20 XP for Lesson Completed
          updatedDailyActivity[today].xp += 20;
        }
      }

      return {
        ...prev,
        mockTestHistory: [...prev.mockTestHistory, newTest],
        completedMockTests,
        completedLessons,
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        dailyActivity: updatedDailyActivity,
        xp: prev.xp + finalXpEarned,
      };
    });
  }, []);

  const setCurrentLesson = useCallback((lessonId) => {
    setProgress(prev => ({ ...prev, currentLesson: lessonId }));
  }, []);

  const saveQuizScore = useCallback((lessonId, score, total) => {
    setProgress(prev => {
      const isPassed = (score / total) >= 0.7;
      const isPerfect = score === total;
      
      let xpEarned = 0;
      if (isPassed) xpEarned += 30; // +30 XP for passing
      if (isPerfect) xpEarned += 10; // +10 XP perfect quiz bonus

      const updatedScores = {
        ...prev.quizScores,
        [lessonId]: {
          score,
          total,
          lastAttempt: new Date().toISOString(),
          bestScore: Math.max(score, prev.quizScores[lessonId]?.bestScore || 0),
        },
      };

      const updatedTotalCorrect = (prev.totalCorrectAnswers || 0) + score;
      const updatedTotalAttempted = (prev.totalQuestionsAttempted || 0) + total;
      const accuracy = updatedTotalAttempted > 0 ? Math.round((updatedTotalCorrect / updatedTotalAttempted) * 100) : 0;

      const today = new Date().toISOString().split('T')[0];
      const { streak, bonusXp } = updateStreak(prev, today);

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].activities += 1;
      updatedDailyActivity[today].xp += xpEarned + bonusXp;

      const completedMockTests = prev.completedMockTests || {};
      const isMockTestDone = !!completedMockTests[lessonId];
      let completedLessons = [...prev.completedLessons];
      if (isMockTestDone && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        xpEarned += 20; // +20 XP for Lesson Completed
        updatedDailyActivity[today].xp += 20;
      }

      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      return {
        ...prev,
        quizScores: updatedScores,
        totalCorrectAnswers: updatedTotalCorrect,
        totalQuestionsAttempted: updatedTotalAttempted,
        dailyActivity: updatedDailyActivity,
        learningStreak: streak,
        completedLessons,
        activityCalendar: updatedCalendar,
        xp: prev.xp + xpEarned + bonusXp,
        mastery: {
          ...prev.mastery,
          quiz: Math.min(100, Math.round(accuracy)),
        },
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

  const completeCodingChallenge = useCallback((lessonId, index) => {
    const challengeId = `${lessonId}_${index}`;
    setProgress(prev => {
      const completedChallenges = prev.completedChallenges || [];
      if (completedChallenges.includes(challengeId)) return prev;

      const xpEarned = 40; // Coding Challenge Completed → +40 XP
      const today = new Date().toISOString().split('T')[0];
      const { streak, bonusXp } = updateStreak(prev, today);
      const updatedCalendar = { ...prev.activityCalendar, [today]: 2 };

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].activities += 1;
      updatedDailyActivity[today].xp += xpEarned + bonusXp;

      return {
        ...prev,
        completedChallenges: [...completedChallenges, challengeId],
        learningStreak: streak,
        activityCalendar: updatedCalendar,
        dailyActivity: updatedDailyActivity,
        xp: prev.xp + xpEarned + bonusXp,
      };
    });
  }, []);

  const incrementStudyTime = useCallback((seconds) => {
    setProgress(prev => {
      const updatedSeconds = (prev.totalStudyTimeSeconds || 0) + seconds;
      const today = new Date().toISOString().split('T')[0];

      const updatedDailyActivity = { ...(prev.dailyActivity || {}) };
      if (!updatedDailyActivity[today]) {
        updatedDailyActivity[today] = { activities: 0, xp: 0, studyTime: 0 };
      }
      updatedDailyActivity[today].studyTime += seconds;

      return {
        ...prev,
        totalStudyTimeSeconds: updatedSeconds,
        totalStudyTimeMinutes: Math.floor(updatedSeconds / 60),
        dailyActivity: updatedDailyActivity
      };
    });
  }, []);

  const triggerSandboxRun = useCallback(() => {
    setProgress(prev => {
      if (prev.hasRunCode) return prev;
      return { ...prev, hasRunCode: true };
    });
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
    completeCodingChallenge,
    incrementStudyTime,
    triggerSandboxRun,
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
