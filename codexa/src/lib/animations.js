import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView, useAnimation, useReducedMotion } from 'framer-motion';

/**
 * Custom hook: triggers framer-motion animation when element scrolls into view.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView, shouldReduce };
}

/**
 * Standard fade-up variant for section reveals.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Stagger container variant — children animate in sequence.
 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

/**
 * Fade-in variant (no Y movement).
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * Scale-up variant for cards.
 */
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Slide-in from left.
 */
export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Slide-in from right.
 */
export const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Brand reveal animation — for the large CODEXA background text.
 */
export const brandReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Typing effect hook — types out text character by character.
 */
export function useTypingEffect(text, speed = 30, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      return;
    }

    let timeout;
    let charIndex = 0;
    setDisplayed('');

    const startTyping = () => {
      const type = () => {
        if (charIndex < text.length) {
          setDisplayed(text.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(type, speed);
        }
      };
      type();
    };

    timeout = setTimeout(startTyping, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, enabled]);

  return displayed;
}

/**
 * Word cycling hook — cycles through an array of words with typing/erasing effect.
 */
export function useWordCycler(words, typingSpeed = 80, erasingSpeed = 40, displayDuration = 2500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing' | 'waiting' | 'erasing'

  useEffect(() => {
    let timeout;
    const currentWord = words[currentIndex];

    if (status === 'typing') {
      if (displayed.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        setStatus('waiting');
      }
    } else if (status === 'waiting') {
      timeout = setTimeout(() => {
        setStatus('erasing');
      }, displayDuration);
    } else if (status === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, erasingSpeed);
      } else {
        setStatus('typing');
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, status, currentIndex, words, typingSpeed, erasingSpeed, displayDuration]);

  return { displayed, currentIndex, isTyping: status === 'typing', status };
}

/**
 * Auto-cycling hook — cycles through indices with a pause on interaction.
 */
export function useAutoCycle(length, intervalMs = 3000, pauseMs = 8000) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeout = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs, isPaused]);

  const setManual = useCallback((index) => {
    setActiveIndex(index);
    setIsPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setIsPaused(false), pauseMs);
  }, [pauseMs]);

  useEffect(() => {
    return () => {
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, []);

  return { activeIndex, setManual };
}
