import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Code2 } from 'lucide-react';
import { useProgress } from '../../../lib/ProgressContext';

export default function QuizEngine({ lesson }) {
  const { saveQuizScore } = useProgress();
  const quizzes = lesson.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  const currentQuiz = quizzes[currentIndex];

  const handleAnswer = useCallback((answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = currentQuiz.type === 'fill-blank'
      ? answer.toLowerCase().trim() === currentQuiz.correct.toLowerCase()
      : answer === currentQuiz.correct;

    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { questionIndex: currentIndex, answer, isCorrect }]);
  }, [showFeedback, currentQuiz, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      saveQuizScore(lesson.id, score + (selectedAnswer === currentQuiz?.correct ? 1 : 0), quizzes.length);
    }
  }, [currentIndex, quizzes.length, lesson.id, score, selectedAnswer, currentQuiz, saveQuizScore]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }, []);

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-card py-16 text-center">
        <Code2 className="mb-4 h-10 w-10 text-text-muted" />
        <h3 className="font-heading text-lg font-semibold text-text">No quiz available</h3>
        <p className="mt-1 text-sm text-text-secondary">Quiz questions will be generated from lesson content.</p>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / quizzes.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-border bg-bg-card p-8 text-center shadow-card"
      >
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${percentage >= 70 ? 'bg-success/15' : 'bg-warning/15'}`}>
          <Trophy className={`h-8 w-8 ${percentage >= 70 ? 'text-success' : 'text-warning'}`} />
        </div>
        <h3 className="font-heading text-2xl font-semibold text-text">
          {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
        </h3>
        <p className="mt-2 text-4xl font-bold text-accent">{score}/{quizzes.length}</p>
        <p className="mt-1 text-sm text-text-secondary">{percentage}% correct</p>
        <button
          onClick={handleRestart}
          className="mt-6 flex items-center gap-2 mx-auto rounded-pill bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-muted">
          {currentIndex + 1}/{quizzes.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-accent">{score} pts</span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-xl border border-border bg-bg-card p-6 shadow-card"
        >
          {/* Question type badge */}
          <span className="mb-3 inline-block rounded-full bg-bg-elevated px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {currentQuiz.type.replace('-', ' ')}
          </span>

          <h3 className="mb-4 font-heading text-lg font-semibold text-text">{currentQuiz.question}</h3>

          {/* Code snippet if present */}
          {currentQuiz.code && (
            <pre className="mb-4 overflow-x-auto rounded-lg bg-[#0d0d11] p-4 font-mono text-[13px] leading-6 text-emerald-400">
              <code>{currentQuiz.code}</code>
            </pre>
          )}

          {/* Options */}
          {currentQuiz.type === 'fill-blank' ? (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your answer..."
                onKeyDown={(e) => { if (e.key === 'Enter') handleAnswer(e.target.value); }}
                disabled={showFeedback}
                className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
              />
              {!showFeedback && (
                <button
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector('input');
                    if (input.value) handleAnswer(input.value);
                  }}
                  className="mt-3 rounded-pill bg-accent px-5 py-2 text-sm font-medium text-white"
                >
                  Submit
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {currentQuiz.options?.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === currentQuiz.correct;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showFeedback}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3.5 text-left text-sm transition-all ${
                      showFeedback
                        ? isCorrect
                          ? 'border-success/50 bg-success/10 text-success'
                          : isSelected
                            ? 'border-red-500/50 bg-red-500/10 text-red-400'
                            : 'border-border bg-bg-elevated text-text-muted'
                        : isSelected
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                      showFeedback && isCorrect ? 'border-success bg-success text-white' :
                      showFeedback && isSelected ? 'border-red-500 bg-red-500 text-white' :
                      'border-border'
                    }`}>
                      {showFeedback && isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                       showFeedback && isSelected ? <XCircle className="h-3.5 w-3.5" /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg border border-border bg-bg-elevated p-4"
              >
                <p className="text-sm text-text-secondary">{currentQuiz.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {showFeedback && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="mt-4 flex items-center gap-2 rounded-pill bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              {currentIndex < quizzes.length - 1 ? 'Next Question' : 'See Results'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
