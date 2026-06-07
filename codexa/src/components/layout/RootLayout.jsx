import { Outlet, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { AITutorProvider } from '../../lib/AITutorContext';
import { ProgressProvider } from '../../lib/ProgressContext';
import CursorSpotlight from '../CursorSpotlight';
import AITutor from '../AITutor';
import ComingSoonModal from '../ComingSoonModal';
import AboutModal from '../AboutModal';
import Lenis from 'lenis';

export default function RootLayout() {
  const [activeModal, setActiveModal] = useState(null);
  const location = useLocation();

  const handleOpenModal = useCallback((modalType) => {
    setActiveModal(modalType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Initialize Lenis for smooth momentum scrolling globally
  useEffect(() => {
    if (window.lenis) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      if (window.lenis) {
        window.lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }
    rafId = requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
    };
  }, [location.pathname]);

  // Reset scroll position to top on path change, unless navigating to a hash
  useEffect(() => {
    if (location.state?.scrollToHash) return;

    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state]);

  return (
    <AITutorProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-bg text-text">
          <CursorSpotlight />

          <Outlet context={{ onOpenModal: handleOpenModal }} />

          {/* Persistent AI Tutor — floats above everything */}
          <AITutor />

          {/* Modals */}
          <ComingSoonModal
            isOpen={['playground', 'interview', 'premium'].includes(activeModal)}
            modalType={activeModal}
            onClose={handleCloseModal}
          />
          <AboutModal
            isOpen={activeModal === 'about'}
            onClose={handleCloseModal}
          />
        </div>
      </ProgressProvider>
    </AITutorProvider>
  );
}
