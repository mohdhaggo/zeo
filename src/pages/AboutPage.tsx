import { useEffect } from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutContent } from '../components/about/AboutContent';
import { MissionVision } from '../components/about/MissionVision';
import { GoalsSection } from '../components/about/GoalsSection';
import { WhyDifferent } from '../components/about/WhyDifferent';
import { CommitmentSection } from '../components/about/CommitmentSection';
import { WhyChooseUs } from '../components/about/WhyChooseUs';
import { CTASection } from '../components/common/CTASection';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const fadeElements = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
      <AboutHero />
      <AboutContent />
      <MissionVision />
      <GoalsSection />
      <WhyDifferent />
      <CommitmentSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
};