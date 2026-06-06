import { useOutletContext } from 'react-router-dom';
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
