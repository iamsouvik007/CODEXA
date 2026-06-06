import { useEffect, useRef, useState } from 'react';

/**
 * CursorSpotlight — a soft orange radial glow that follows the mouse cursor.
 * Purely decorative, no pointer events, respects prefers-reduced-motion.
 */
export default function CursorSpotlight() {
  const spotRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    // Only show on devices with fine pointer (not touch)
    const pointerMq = window.matchMedia('(pointer: fine)');
    if (!pointerMq.matches) return;

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        // Snap to the cursor immediately on the first move to avoid it flying in from the corner
        currentRef.current = { x: e.clientX, y: e.clientY };
        if (spotRef.current) {
          spotRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
        }
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // Smooth lerp for natural feel
      const lerp = 0.12;
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * lerp;

      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${currentRef.current.x - 300}px, ${currentRef.current.y - 300}px)`;
      }
      
      // Export coordinates for mask reveals in other components
      document.documentElement.style.setProperty('--mouse-x', `${currentRef.current.x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${currentRef.current.y}px`);
      
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed top-0 left-0 z-[1] h-[600px] w-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, rgba(249, 115, 22, 0.02) 40%, transparent 70%)',
        opacity: isVisible ? 1 : 0,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
