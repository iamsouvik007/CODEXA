import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Clock, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { useProgress } from '../../../lib/ProgressContext';

const mockTestQuestions = [
  {
    type: 'mcq',
    question: "What is the output of typeof null in JavaScript?",
    options: ["'undefined'", "'null'", "'object'", "'array'"],
    correct: 2,
    explanation: "Q1: Due to a legacy bug in JavaScript, typeof null returns 'object'. It has existed since JS 1.0."
  },
  {
    type: 'mcq',
    question: "Which of the following values is inherently Falsy?",
    options: ["'false'", "[] (empty array)", "0 (zero)", "{} (empty object)"],
    correct: 2,
    explanation: "Q2: Zero (0) is one of the 6 falsy values. Empty arrays and objects are truthy."
  },
  {
    type: 'mcq',
    question: "What is the key difference between let and var variables?",
    options: [
      "let is block-scoped, var is function-scoped",
      "let can be reassigned, var cannot",
      "let is hoisted, var is not",
      "let is global only"
    ],
    correct: 0,
    explanation: "Q3: Variables declared with let are scoped to their immediate enclosing block {}, whereas var variables are scoped to the containing function."
  },
  {
    type: 'mcq',
    question: "What will console.log(5 + '5') output in the console?",
    options: ["10", "'55'", "NaN", "Error"],
    correct: 1,
    explanation: "Q4: Due to type coercion, the number 5 is cast to a string and concatenated with '5', producing '55'."
  },
  {
    type: 'mcq',
    question: "What is the correct way to check for strict equality in value AND type?",
    options: ["x = y", "x == y", "x === y", "x &== y"],
    correct: 2,
    explanation: "Q5: The === operator checks strict equality without doing implicit type coercion."
  },
  {
    type: 'mcq',
    question: "What is a Closure in JavaScript?",
    options: [
      "A method to close browser tabs",
      "A function that retains access to its lexical outer scope even after the outer function returned",
      "A secure way to write private methods",
      "An asynchronous event loop callback"
    ],
    correct: 1,
    explanation: "Q6: Closures allow an inner function to remember its outer scope environment like a backpack."
  },
  {
    type: 'mcq',
    question: "What does the Temporal Dead Zone (TDZ) refer to?",
    options: [
      "The time it takes to parse an iframe",
      "The window between block entry and let/const variable declaration",
      "The phase where JavaScript garbage collection occurs",
      "The delay in asynchronous network callbacks"
    ],
    correct: 1,
    explanation: "Q7: Accessing let/const variables before their declaration line in a block throws a ReferenceError due to the TDZ."
  },
  {
    type: 'mcq',
    question: "What is the remainder result of the operation: 10 % 3?",
    options: ["0", "1", "3", "10"],
    correct: 1,
    explanation: "Q8: 10 divided by 3 is 3 with a remainder of 1. Hence, 10 % 3 evaluates to 1."
  },
  {
    type: 'mcq',
    question: "Which loop statement immediately terminates the entire loop body?",
    options: ["continue", "break", "return", "exit"],
    correct: 1,
    explanation: "Q9: The break statement immediately exits the loop block and passes execution to the next line."
  },
  {
    type: 'mcq',
    question: "Is an empty array [] truthy or falsy in conditions?",
    options: ["Truthy", "Falsy", "Undefined", "Null"],
    correct: 0,
    explanation: "Q10: In JavaScript, all objects and arrays (including empty ones) are truthy."
  }
];

const shuffleQuestion = (q) => {
  if (!q.options || typeof q.correct !== 'number' || !Array.isArray(q.options)) return q;
  const correctAnswer = q.options[q.correct];
  const shuffled = [...q.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const newCorrectIdx = shuffled.indexOf(correctAnswer);
  return {
    ...q,
    options: shuffled,
    correct: newCorrectIdx === -1 ? q.correct : newCorrectIdx
  };
};

export default function QuizEngine({ lesson }) {
  const { saveQuizScore, submitMockTest, addXP } = useProgress();
  
  // Modes: 'select' | 'quiz' | 'mock-test'
  const [mode, setMode] = useState('select');

  // Quiz state
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // the index the user picked
  const [answeredCorrectly, setAnsweredCorrectly] = useState(null); // true/false/null
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shake, setShake] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuiz = quizzes[currentIndex];

  // Active Timer Effect
  useEffect(() => {
    if (mode === 'select' || finished || showFeedback) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired
          if (mode === 'quiz') {
            setSelectedAnswer(-1);
            setAnsweredCorrectly(false);
            setShowFeedback(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
          } else if (mode === 'mock-test') {
            setFinished(true);
            submitMockTest(score, quizzes.length, 'JavaScript', lesson.id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, finished, showFeedback, score, quizzes.length, submitMockTest, lesson.id]);

  // Initialize Lesson Quiz
  const startLessonQuiz = () => {
    const shuffled = (lesson.quiz || []).map(shuffleQuestion);
    setQuizzes(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setMode('quiz');
    setTimeLeft(30);
  };

  // Initialize Timed Mock Test
  const startMockTest = () => {
    const shuffled = mockTestQuestions.map(shuffleQuestion);
    setQuizzes(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setMode('mock-test');
    setTimeLeft(300); // 5 minutes total
  };

  const handleAnswer = useCallback((answer) => {
    if (showFeedback || selectedAnswer !== null) return; // prevent double-click

    const isCorrect = currentQuiz.type === 'fill-blank'
      ? String(answer).toLowerCase().trim() === String(currentQuiz.correct).toLowerCase().trim()
      : answer === currentQuiz.correct;

    setSelectedAnswer(answer);
    setAnsweredCorrectly(isCorrect);

    let nextScore = score;
    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      addXP(10); // +10 XP per correct question
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    if (mode === 'quiz') {
      setShowFeedback(true);
    } else {
      // mock-test: no per-question feedback, just advance after a brief pause
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < quizzes.length) {
          setCurrentIndex(nextIdx);
          setSelectedAnswer(null);
          setAnsweredCorrectly(null);
        } else {
          setFinished(true);
          submitMockTest(nextScore, quizzes.length, 'JavaScript', lesson.id);
        }
      }, 800);
    }
  }, [showFeedback, selectedAnswer, currentQuiz, mode, score, addXP, currentIndex, quizzes.length, submitMockTest]);

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < quizzes.length) {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setAnsweredCorrectly(null);
      setShowFeedback(false);
      setTimeLeft(30); // reset timer for next question
    } else {
      setFinished(true);
      saveQuizScore(lesson.id, score, quizzes.length);
    }
  }, [currentIndex, quizzes.length, lesson.id, score, saveQuizScore]);

  const handleRestart = useCallback(() => {
    setMode('select');
    setFinished(false);
    setScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnsweredCorrectly(null);
    setShowFeedback(false);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // SELECT MODE VIEW
  if (mode === 'select') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto py-8">
        {/* Lesson Quiz Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 border border-accent/20">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text mb-2">Active Lesson Quiz</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Test your knowledge of the active lesson material. Consists of {lesson.quiz?.length || 0} questions with a 30-second timer per question.
            </p>
          </div>
          <button
            onClick={startLessonQuiz}
            disabled={!lesson.quiz || lesson.quiz.length === 0}
            className="mt-6 w-full rounded-lg bg-accent text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent-deep transition-all cursor-pointer disabled:opacity-50"
          >
            Start Quiz (+30 XP)
          </button>
        </motion.div>

        {/* Timed Mock Test Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-text mb-2">Timed Mock Test</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Take a full 10-question test on JavaScript. You have 5 minutes total to submit. **Completing this mock test awards +1 Streak day!**
            </p>
          </div>
          <button
            onClick={startMockTest}
            className="mt-6 w-full rounded-lg bg-purple-600 text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all cursor-pointer shadow-md shadow-purple-900/10"
          >
            Start Test (+1 Streak)
          </button>
        </motion.div>
      </div>
    );
  }

  // FINISHED / RESULTS VIEW
  if (finished) {
    const percentage = Math.round((score / quizzes.length) * 100);
    const xpEarned = mode === 'mock-test' ? Math.round((score / quizzes.length) * 40) : 30 + score * 10;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto rounded-xl border border-border bg-[#0b0b0d] p-8 text-center shadow-card"
      >
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${percentage >= 70 ? 'bg-success/15 border border-success/30' : 'bg-warning/15 border border-warning/30'}`}>
          <Trophy className={`h-8 w-8 ${percentage >= 70 ? 'text-success' : 'text-warning'}`} />
        </div>
        <h3 className="font-heading text-2xl font-semibold text-text tracking-tight">
          {percentage >= 90 ? 'Excellent Mastery!' : percentage >= 70 ? 'Great Progress!' : 'Keep Practicing!'}
        </h3>
        
        <div className="my-6">
          <p className="text-5xl font-black text-accent tracking-tighter">{score} / {quizzes.length}</p>
          <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider font-mono">{percentage}% Correct</p>
        </div>

        {/* Rewards Alert */}
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-success">
            <Sparkles className="h-4 w-4 text-success animate-pulse" />
            <span>REWARDS EARNED</span>
          </div>
          <div className="flex justify-around text-xs font-semibold text-text-secondary">
            <span>+{xpEarned} XP</span>
            {mode === 'mock-test' && <span className="text-amber-500">🔥 +1 Streak Day</span>}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-bg-elevated text-text hover:bg-border py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Back to Selection
        </button>
      </motion.div>
    );
  }

  // ACTIVE QUIZ RUNNING VIEW
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Progress header & Timer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
          {mode === 'quiz' ? 'Lesson Quiz' : 'Timed Mock Test'} ({currentIndex + 1}/{quizzes.length})
        </span>

        {/* Timer Badge */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold font-mono ${
          timeLeft <= 10 ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-bg-elevated border-border text-text-secondary'
        }`}>
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Question Card (supporting Shake on wrong answer) */}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-[#0b0c10] p-6 shadow-card"
      >
        <span className="mb-3 inline-block rounded bg-[#161720] border border-border/50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
          {currentQuiz?.type?.replace('-', ' ')}
        </span>

        <h3 className="mb-5 font-heading text-base font-bold text-text leading-snug">{currentQuiz?.question}</h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuiz?.options?.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === currentQuiz.correct;

            let cardStyle = 'border-border bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text';
            let dotStyle = 'border-border text-text-muted';

            // Only show correct/incorrect styling after an answer has been submitted
            if (selectedAnswer !== null) {
              if (isCorrect) {
                cardStyle = 'border-success/40 bg-success/10 text-success';
                dotStyle = 'border-success bg-success text-white';
              } else if (isSelected) {
                cardStyle = 'border-red-500/40 bg-red-500/10 text-red-400';
                dotStyle = 'border-red-500 bg-red-500 text-white';
              } else {
                cardStyle = 'border-border/40 bg-bg-card/40 text-text-muted opacity-50';
                dotStyle = 'border-border text-text-muted opacity-50';
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`flex w-full items-center gap-3.5 rounded-lg border p-3.5 text-left text-xs font-medium transition-all cursor-pointer disabled:cursor-default ${cardStyle}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${dotStyle}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Correct/Incorrect feedback — uses answeredCorrectly (not stale selectedAnswer) */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-border bg-[#0e0f14] p-4 flex gap-3 text-xs leading-relaxed text-text-secondary"
            >
              {answeredCorrectly ? (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-bold mb-1 ${answeredCorrectly ? 'text-success' : 'text-red-400'}`}>
                  {answeredCorrectly ? 'Correct Answer!' : selectedAnswer === -1 ? "Time's Up!" : 'Incorrect Answer'}
                </p>
                <p>{currentQuiz?.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Question Trigger */}
        {showFeedback && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="mt-5 flex items-center gap-2 rounded-lg bg-accent text-white px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-accent-deep transition-all cursor-pointer"
          >
            {currentIndex < quizzes.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
