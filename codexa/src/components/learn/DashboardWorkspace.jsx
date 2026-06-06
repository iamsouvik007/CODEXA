import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Award, BookOpen, Clock, Activity, Calendar, Compass, ShieldAlert, Sparkles, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../lib/ProgressContext';
import { getLessonById } from '../../lib/lessonData';
import ContributionCalendar from './ContributionCalendar';

export default function DashboardWorkspace({ onLessonSelect }) {
  const { progress, startStreakJourney, completeDailyChallenge, toggleBookmark } = useProgress();

  const level = Math.floor(progress.xp / 100) + 1;
  const nextLevelXp = level * 100;
  const prevLevelXp = (level - 1) * 100;
  const xpInCurrentLevel = progress.xp - prevLevelXp;
  const xpProgressPct = Math.round((xpInCurrentLevel / 100) * 100);

  const getRank = (lvl) => {
    if (lvl >= 10) return 'Legendary Coder';
    if (lvl >= 8) return 'Grandmaster';
    if (lvl >= 6) return 'Lead Architect';
    if (lvl >= 5) return 'Senior Engineer';
    if (lvl >= 4) return 'Software Engineer';
    if (lvl >= 3) return 'Junior Developer';
    if (lvl >= 2) return 'Apprentice';
    return 'Beginner Coder';
  };

  const lastLessonId = progress.currentLesson || '1';
  const lastLesson = getLessonById(lastLessonId);
  const lessonProg = progress.lessonProgress?.[lastLessonId]?.scrollPercent || 0;

  const stats = [
    { label: 'Current Streak', value: `${progress.learningStreak?.currentStreak || 0} days`, icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { label: 'Longest Streak', value: `${progress.learningStreak?.longestStreak || 0} days`, icon: Flame, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { label: 'Experience Points', value: `${progress.xp} XP`, icon: Trophy, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Study Duration', value: `${progress.totalStudyTimeMinutes || 0} min`, icon: Clock, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Quiz Accuracy', value: `${progress.mastery?.quiz || 0}%`, icon: Activity, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Lessons Completed', value: `${progress.completedLessons?.length || 0} / 4`, icon: BookOpen, color: 'text-accent bg-accent/10 border-accent/20' }
  ];

  // Dynamically check unlocked achievements
  const dynamicAchievements = useMemo(() => {
    const list = [];
    
    // 1. First Steps: Completed Lesson 2 (Variables & Data Types)
    if (progress.completedLessons?.includes('2')) {
      list.push({
        id: 'first_steps',
        name: 'First Steps',
        desc: 'Complete Lesson 02 on Variables & Data Types.',
        icon: Award,
        color: 'text-amber-400'
      });
    }

    // 2. Consistent Creator: longestStreak >= 2
    if ((progress.learningStreak?.longestStreak || 0) >= 2) {
      list.push({
        id: 'consistent_creator',
        name: 'Consistent Creator',
        desc: 'Maintain a 2+ day learning streak.',
        icon: Sparkles,
        color: 'text-purple-400'
      });
    }

    // 3. Debugger Master: executed a script in sandbox
    if (progress.hasRunCode) {
      list.push({
        id: 'debugger_master',
        name: 'Debugger Master',
        desc: 'Execute a script in the sandbox editor.',
        icon: Trophy,
        color: 'text-cyan-400'
      });
    }

    // 4. Trivia Champ: perfect score on any lesson quiz
    const hasPerfectQuiz = Object.values(progress.quizScores || {}).some(q => q.score === q.total && q.total > 0);
    if (hasPerfectQuiz) {
      list.push({
        id: 'trivia_champ',
        name: 'Trivia Champ',
        desc: 'Get a perfect score on any Lesson Quiz.',
        icon: Award,
        color: 'text-rose-400'
      });
    }

    // 5. Dedicated Scholar: study duration >= 10 minutes
    if ((progress.totalStudyTimeMinutes || 0) >= 10) {
      list.push({
        id: 'dedicated_scholar',
        name: 'Dedicated Scholar',
        desc: 'Spend 10+ minutes actively learning.',
        icon: Clock,
        color: 'text-emerald-400'
      });
    }

    // 6. Fast Learner: completed all 4 lessons
    if (progress.completedLessons?.length >= 4) {
      list.push({
        id: 'fast_learner',
        name: 'Fast Learner',
        desc: 'Successfully complete all 4 lessons.',
        icon: BookOpen,
        color: 'text-indigo-400'
      });
    }

    return list;
  }, [progress]);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto py-4 select-none">
      
      {/* Top Profile Summary & Level Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/25 select-none">
              <span className="font-heading text-2xl font-black text-accent font-mono">L{level}</span>
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-text">Developer Journey</h3>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider">{getRank(level)}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">{progress.xp} XP total</p>
            </div>
          </div>

          {/* Level Progress bar */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-text-muted">
              <span>Lvl {level}</span>
              <span className="text-accent">{progress.xp} / {nextLevelXp} XP ({xpProgressPct}%)</span>
              <span>Lvl {level + 1}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-bg-elevated overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: `${xpProgressPct}%` }} />
            </div>
            <div className="text-[10px] text-text-muted text-center pt-1">
              Next Rank: <span className="font-bold text-text-secondary">{getRank(level + 1)}</span>
            </div>
          </div>
        </div>

        {/* Continue Learning card */}
        <div className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card flex flex-col justify-between min-h-[200px] relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Continue Learning</span>
            <h4 className="font-heading text-sm font-bold text-text mt-3 mb-1 line-clamp-1">{lastLesson?.title || 'Lesson 01 - Intro'}</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
              {lastLesson ? `Resume where you left off. You read ${lessonProg}% of this lesson.` : 'Start your coding journey with Lesson 01.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span>Lesson Progress</span>
                <span>{lessonProg}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-bg-elevated overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${lessonProg}%` }} />
              </div>
            </div>

            <button
              onClick={() => onLessonSelect(lastLessonId)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-accent-deep transition-all cursor-pointer shadow-md shadow-accent/10"
            >
              Resume Lesson
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Daily Challenge card */}
        <div className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Daily Challenge</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/25 px-1 py-0.2 rounded">Medium</span>
            </div>
            <h4 className="font-heading text-sm font-bold text-text mb-2">Complete a Timed Mock Test</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Submit a full 10-question JavaScript mock test within the 5-minute limit to claim today's streak reward!
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
            {progress.dailyChallengeCompleted ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Claimed (+30 XP)</span>
              </div>
            ) : (
              <button
                onClick={() => completeDailyChallenge('medium')}
                className="flex items-center gap-1.5 rounded-lg bg-accent text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-accent-deep transition-all cursor-pointer"
              >
                Claim Challenge
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Activity Calendar & Journey Activation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="font-heading text-lg font-semibold text-text tracking-tight">Activity Heatmap</h3>
          </div>
        </div>

        {progress.streakJourneyStarted ? (
          <ContributionCalendar dailyActivity={progress.dailyActivity} />
        ) : (
          <div className="rounded-xl border border-dashed border-accent/30 bg-accent/[0.01] p-10 text-center shadow-card relative overflow-hidden flex flex-col items-center">
            <Flame className="h-12 w-12 text-accent/40 animate-pulse mb-4" />
            <h4 className="font-heading text-base font-bold text-text">Activate Streak Tracking</h4>
            <p className="mt-2 text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
              Start your dynamic developer learning streak today! Complete daily challenges and timed tests to build your active calendar.
            </p>
            <button
              onClick={startStreakJourney}
              className="mt-6 rounded-lg bg-accent text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent-deep cursor-pointer"
            >
              🚀 Start Learning Journey
            </button>
          </div>
        )}
      </div>

      {/* Streak Rules & Analytics Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Rules & Roadmap */}
        <div className="space-y-6">
          {/* Streak Rules card */}
          <div className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text">How Streaks Work</h4>
            </div>
            <ul className="space-y-3 text-[11px] leading-relaxed text-text-secondary">
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                <span>Complete the <b>Daily Challenge</b>, a <b>Quiz</b>, OR a <b>Mock Test</b> to earn +1 Streak.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-400 font-bold">✗</span>
                <span>Simply reading lesson notes or opening the page does NOT increment your streak.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">!</span>
                <span>You must submit before midnight local time, or your active streak resets to 0.</span>
              </li>
            </ul>
          </div>

          {/* Personalized Learning Roadmap (Coming Soon) */}
          <div className="rounded-xl border border-dashed border-accent/30 bg-accent/[0.01] p-6 shadow-card flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                  <span>🚀</span> Personalized Learning Roadmap
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-accent border border-accent/25 px-1.5 py-0.2 rounded">Coming Soon</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-4 mt-2">
                Based on your quiz performance and learning speed, our AI will generate a custom learning path. It will prioritize topics where you need reinforcement and fast-track concepts you master quickly.
              </p>
            </div>
            <div className="border-t border-border/40 pt-3 flex items-center gap-2 text-[10px] text-text-muted">
              <span>✨ Custom lessons</span>
              <span>•</span>
              <span>📈 Real-time adjustments</span>
            </div>
          </div>
        </div>

        {/* Right Side: Analytics Counters */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 h-fit">
          {stats.map((stat, i) => (
            <div key={i} className={`rounded-xl border p-4 shadow-card flex flex-col justify-between ${stat.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{stat.label}</span>
                <stat.icon className="h-4 w-4 opacity-65" />
              </div>
              <span className="mt-3 block font-heading text-xl font-black text-text tracking-tight">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked lessons list */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-accent" />
          <h3 className="font-heading text-lg font-semibold text-text tracking-tight">Bookmarked Lessons</h3>
        </div>

        {progress.bookmarkedLessons?.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {progress.bookmarkedLessons.map((id) => {
              const lesson = getLessonById(id);
              if (!lesson) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-[#0b0b0d] hover:border-accent/30 hover:bg-accent/[0.01] transition-all cursor-pointer group"
                  onClick={() => onLessonSelect(id)}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4.5 w-4.5 text-accent shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-text group-hover:text-accent transition-colors leading-tight">
                        {lesson.title}
                      </span>
                      <span className="text-[9px] text-text-muted mt-0.5 block">Module {lesson.moduleId} • {lesson.metadata?.estimatedReadingTime}m read</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(id);
                    }}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-elevated hover:text-accent transition-colors shrink-0"
                    aria-label="Remove bookmark"
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-accent text-accent" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-[#0b0c10]/40 p-8 text-center text-xs text-text-muted italic flex flex-col items-center justify-center py-12 gap-2 select-none">
            <Bookmark className="h-8 w-8 text-text-muted/40 mb-1" />
            <div className="font-semibold text-text-secondary not-italic">No Bookmarked Lessons</div>
            <div className="text-[11px] max-w-sm">Click the bookmark icon next to lessons in the sidebar to save them here for later.</div>
          </div>
        )}
      </div>

      {/* Achievements Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          <h3 className="font-heading text-lg font-semibold text-text tracking-tight">Badges & Achievements</h3>
        </div>

        {dynamicAchievements.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {dynamicAchievements.map((badge, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-[#0b0b0d] shadow-card animate-fadeIn">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-bg-card border border-border/40">
                  <badge.icon className={`h-6 w-6 ${badge.color || 'text-accent'}`} />
                </div>
                <div>
                  <span className="block text-xs font-bold text-text">{badge.name}</span>
                  <span className="text-[10px] text-text-muted leading-relaxed mt-0.5 block">{badge.desc}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-[#0b0c10]/40 p-8 text-center text-xs text-text-muted italic flex flex-col items-center justify-center py-12 gap-2 select-none">
            <Award className="h-8 w-8 text-text-muted/40 mb-1" />
            <div className="font-semibold text-text-secondary not-italic">No Achievements Unlocked Yet</div>
            <div className="text-[11px] max-w-sm">Complete lessons, quizzes, and maintain streaks to unlock special developer badges.</div>
          </div>
        )}
      </div>

    </div>
  );
}
