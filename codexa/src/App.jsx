import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductPreview from './components/ProductPreview';
import LearningMethod from './components/LearningMethod';
import Roadmap from './components/Roadmap';
import TrustedProviders from './components/TrustedProviders';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  const { onOpenModal } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to hash on page redirect
  useEffect(() => {
    if (location.state?.scrollToHash) {
      const hash = location.state.scrollToHash;
      // Clear location state to avoid scrolling again on subsequent re-renders
      navigate(location.pathname, { replace: true, state: {} });
      
      // Short timeout to allow page layout to settle
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          const offset = 80; // Navbar height offset
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -offset, duration: 1.2 });
          } else {
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 150);
    }
  }, [location, navigate]);

  return (
    <>
      <Navbar onOpenModal={onOpenModal} />
      <main>
        <Hero />
        <ProductPreview />
        <LearningMethod />
        <Roadmap />
        <TrustedProviders />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
