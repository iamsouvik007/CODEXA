import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Binary, Network, Container, Sparkles, BrainCircuit, ArrowRight, Lock, BookOpen, Trophy, Flame } from 'lucide-react';
import { tracks, getAllLessons } from '../lib/lessonData';
import { useProgress } from '../lib/ProgressContext';
import { useScrollReveal, fadeUp, staggerContainer } from '../lib/animations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const iconMap = {
  Globe, Binary, Network, Container, Sparkles, BrainCircuit,
};

export default function LearningHub() {
  const navigate = useNavigate();
  const { onOpenModal } = useOutletContext();
  const { progress, getCompletionPercentage, getMasteryPercentage } = useProgress();
  const { ref, controls } = useScrollReveal(0.1);
  const allLessons = getAllLessons();
  const completionPct = getCompletionPercentage(allLessons.length);
  const masteryPct = getMasteryPercentage();

  const handleTrackClick = (track) => {
    if (track.status === 'active') {
      navigate('/learn/web-development');
    } else {
      onOpenModal?.('playground');
    }
  };

  return (
    <>
      <Navbar onOpenModal={onOpenModal} />
      <main className="min-h-screen pt-20 pb-16">
        {/* Hero section */}
        <section className="mx-auto max-w-[1200px] px-5 pt-12 pb-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-3 py-1">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-xs text-text-muted">LEARNING HUB</span>
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-text sm:text-5xl" style={{ letterSpacing: '-2.4px' }}>
              Choose your path.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              Master the technologies that power the modern web. Each track is designed to take you from concept to confidence.
            </p>
          </motion.div>

          {/* Stats row */}
          {(completionPct > 0 || masteryPct > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { label: 'Completed', value: `${progress.completedLessons.length}/${allLessons.length}`, icon: Trophy, accent: 'text-success' },
                { label: 'Completion', value: `${completionPct}%`, icon: BookOpen, accent: 'text-accent' },
                { label: 'Mastery', value: `${masteryPct}%`, icon: Sparkles, accent: 'text-info' },
                { label: 'Streak', value: `${progress.learningStreak.currentStreak}d`, icon: Flame, accent: 'text-warning' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-bg-card p-4 shadow-card">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                    <span className="text-xs text-text-muted">{stat.label}</span>
                  </div>
                  <span className="mt-1 block font-heading text-2xl font-semibold text-text">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Track grid */}
        <section className="mx-auto max-w-[1200px] px-5 sm:px-8" ref={ref}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {tracks.map((track, i) => {
              const Icon = iconMap[track.icon] || Globe;
              const isActive = track.status === 'active';

              return (
                <motion.button
                  key={track.id}
                  variants={fadeUp}
                  onClick={() => handleTrackClick(track)}
                  className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'border-accent/30 bg-bg-card shadow-elevated hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]'
                      : 'cursor-default border-border bg-bg-card/50 opacity-70'
                  }`}
                >
                  {/* Active track gradient glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
                  )}

                  <div className="relative p-6">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isActive ? 'bg-accent/15 text-accent' : 'bg-bg-elevated text-text-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {isActive ? (
                        <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-muted">
                          <Lock className="h-3 w-3" />
                          Coming Soon
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-heading text-lg font-semibold text-text">
                      {track.title}
                    </h3>

                    {isActive && (
                      <>
                        <p className="mb-4 text-sm text-text-secondary">
                          {track.lessonCount} lessons • JavaScript fundamentals to advanced concepts
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-3">
                          Start Learning
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
