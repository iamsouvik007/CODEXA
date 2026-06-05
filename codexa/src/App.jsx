import { useState, useCallback } from 'react';
import { AITutorProvider } from './lib/AITutorContext';
import CursorSpotlight from './components/CursorSpotlight';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductPreview from './components/ProductPreview';
import LearningMethod from './components/LearningMethod';
import Roadmap from './components/Roadmap';
import PremiumPrograms from './components/PremiumPrograms';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AITutor from './components/AITutor';
import ComingSoonModal from './components/ComingSoonModal';
import AboutModal from './components/AboutModal';

export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = useCallback((modalType) => {
    setActiveModal(modalType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <AITutorProvider>
      <div className="min-h-screen bg-bg text-text">
        {/* Cursor spotlight effect — global */}
        <CursorSpotlight />

        <Navbar onOpenModal={handleOpenModal} />
        <main>
          <Hero />
          <ProductPreview />
          <LearningMethod />
          <Roadmap />
          <PremiumPrograms />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />

        {/* Persistent AI Tutor — floats above everything */}
        <AITutor />

        {/* Modals */}
        <ComingSoonModal
          isOpen={activeModal === 'playground'}
          onClose={handleCloseModal}
        />
        <AboutModal
          isOpen={activeModal === 'about'}
          onClose={handleCloseModal}
        />
      </div>
    </AITutorProvider>
  );
}
