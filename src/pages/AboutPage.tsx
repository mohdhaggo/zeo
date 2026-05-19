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

  // Force responsive styles on all elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Force all elements to be responsive */
        .about-force-responsive * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Force all images to be responsive */
        .about-force-responsive img {
          max-width: 100% !important;
          height: auto !important;
          object-fit: cover !important;
        }
        
        /* Force all headings to be responsive */
        .about-force-responsive h1 {
          font-size: clamp(1.8rem, 6vw, 3rem) !important;
          word-break: break-word !important;
        }
        
        .about-force-responsive h2 {
          font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
          word-break: break-word !important;
        }
        
        .about-force-responsive h3 {
          font-size: clamp(1.2rem, 4vw, 1.8rem) !important;
          word-break: break-word !important;
        }
        
        /* Force all paragraphs */
        .about-force-responsive p {
          font-size: clamp(0.85rem, 3.5vw, 1rem) !important;
          line-height: 1.5 !important;
        }
        
        /* Force grid layouts to be responsive */
        .about-force-responsive [style*="display: grid"],
        .about-force-responsive [class*="grid"] {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          gap: 20px !important;
        }
        
        /* Force flex layouts to wrap */
        .about-force-responsive [style*="display: flex"],
        .about-force-responsive [class*="flex"] {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        
        /* Mobile specific */
        @media (max-width: 768px) {
          .about-force-responsive [style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
          
          .about-force-responsive [style*="display: flex"] {
            flex-direction: column !important;
          }
          
          .about-force-responsive button,
          .about-force-responsive .btn {
            width: 100% !important;
            min-height: 44px !important;
          }
        }
        
        /* Container padding */
        .about-force-responsive > div {
          padding-left: clamp(15px, 4vw, 30px) !important;
          padding-right: clamp(15px, 4vw, 30px) !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="about-force-responsive" style={{ 
      width: '100%', 
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <div style={{ 
        maxWidth: '1300px', 
        margin: '0 auto', 
        padding: '0 20px',
        width: '100%'
      }}>
        <AboutHero />
        <AboutContent />
        <MissionVision />
        <GoalsSection />
        <WhyDifferent />
        <CommitmentSection />
        <WhyChooseUs />
        <CTASection />
      </div>

      <style>{`
        .fade-section { 
          opacity: 0; 
          transform: translateY(30px); 
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }
        
        .fade-section.visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
        
        @media (max-width: 768px) {
          body, html {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
};