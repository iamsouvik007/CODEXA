import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Construction, Bell, Check, Sparkles } from 'lucide-react';

export default function ComingSoonView({ name = 'HTML Track' }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex min-h-[calc(100vh-120px)] items-center justify-center p-8 bg-[#09090b] relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/[0.05] blur-[80px] pointer-events-none" />

      {/* Futuristic grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-lg w-full text-center z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 text-xs font-medium text-accent shadow-sm"
        >
          <Sparkles className="h-3 w-3 animate-pulse text-accent" />
          <span>COMING SOON</span>
        </motion.div>

        {/* Lock Shield Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-bg-card shadow-elevated"
        >
          <Lock className="h-8 w-8 text-accent-soft" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-dashed border-accent/20"
          />
        </motion.div>

        {/* Text Details */}
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl"
          style={{ letterSpacing: '-1px' }}
        >
          🚀 {name} Coming Soon
        </motion.h2>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-base leading-relaxed text-text-secondary max-w-md mx-auto"
        >
          We are building a world-class interactive learning experience for this track, featuring step-by-step visualizations, sandbox execution modules, and custom flashcards. Stay tuned.
        </motion.p>

        {/* Subscription box */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-6 rounded-xl border border-border bg-bg-card/50 backdrop-blur-md shadow-card max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                key="sub-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 rounded-lg border border-border bg-bg-input px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-accent text-white px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent-deep active:scale-95"
                >
                  <Bell className="h-4 w-4" />
                  Notify Me
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="sub-success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-2 py-2 text-success"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 border border-success/35">
                  <Check className="h-4.5 w-4.5 text-success" />
                </div>
                <p className="text-sm font-medium">Notification saved!</p>
                <p className="text-xs text-text-muted">We will email you when {name} goes live.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
