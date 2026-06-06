import { Outlet } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AITutorProvider } from '../../lib/AITutorContext';
import { ProgressProvider } from '../../lib/ProgressContext';
import CursorSpotlight from '../CursorSpotlight';
import AITutor from '../AITutor';
import ComingSoonModal from '../ComingSoonModal';
import AboutModal from '../AboutModal';

export default function RootLayout() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = useCallback((modalType) => {
    setActiveModal(modalType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

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
