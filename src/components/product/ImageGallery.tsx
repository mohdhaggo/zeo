import React, { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateGap = (width: number) => {
    const minWidth = 1024, maxWidth = 1456, minGap = 60, maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return maxGap;
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
  };

  const getImageStyle = (index: number, containerW: number) => {
    const gap = calculateGap(containerW);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + images.length) % images.length === index;
    const isRight = (activeIndex + 1) % images.length === index;

    if (isActive) {
      return { zIndex: 3, opacity: 1, pointerEvents: 'auto' as const, transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)' };
    }
    if (isLeft) {
      return { zIndex: 2, opacity: 1, pointerEvents: 'auto' as const, transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)` };
    }
    if (isRight) {
      return { zIndex: 2, opacity: 1, pointerEvents: 'auto' as const, transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)` };
    }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none' as const, transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    resetAutoplay();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    resetAutoplay();
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (!isHovering) startAutoplay();
  };

  const startAutoplay = () => {
    autoplayRef.current = setInterval(() => {
      if (!isHovering) {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
    }, 5000);
  };

  const openFullscreen = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    startAutoplay();

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isModalOpen && e.key === 'Escape') closeFullscreen();
      if (!isModalOpen && e.key === 'ArrowLeft') prevSlide();
      if (!isModalOpen && e.key === 'ArrowRight') nextSlide();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isModalOpen, activeIndex]);

  return (
    <>
      <div className="product-gallery" style={{ position: 'relative', width: '100%', perspective: '1000px' }}>
        <div 
          className="carousel-container"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            ref={containerRef}
            className="image-container" 
            style={{ position: 'relative', width: '100%', height: '26rem', perspective: '1000px', cursor: 'pointer' }}
          >
            {images.map((image, idx) => (
              <img
                key={idx}
                src={image.src}
                alt={image.alt}
                className="carousel-image"
                onClick={() => openFullscreen(image)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(229,9,20,0.4)',
                  willChange: 'transform, opacity',
                  transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
                  ...getImageStyle(idx, containerWidth)
                }}
              />
            ))}
          </div>
          
          <div className="carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            {images.map((_, idx) => (
              <div
                key={idx}
                onClick={() => goToSlide(idx)}
                style={{
                  width: idx === activeIndex ? '3rem' : '2rem',
                  height: '0.25rem',
                  background: idx === activeIndex ? '#E50914' : '#333',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
          
          <div className="carousel-arrows" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button onClick={prevSlide} style={{
              width: '2.7rem',
              height: '2.7rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              background: '#141414',
              color: '#f1f1f7'
            }}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={nextSlide} style={{
              width: '2.7rem',
              height: '2.7rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              background: '#141414',
              color: '#f1f1f7'
            }}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && selectedImage && (
        <div 
          className="fullscreen-modal active"
          onClick={closeFullscreen}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.96)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        >
          <div 
            className="close-modal-btn" 
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '28px',
              right: '32px',
              background: 'rgba(20,20,20,0.9)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#E50914',
              cursor: 'pointer',
              border: '1px solid rgba(229,9,20,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 2001
            }}
          >
            <i className="fas fa-times"></i>
          </div>
          <img 
            src={selectedImage.src} 
            alt={selectedImage.alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '1rem',
              border: '2px solid rgba(229,9,20,0.5)'
            }}
          />
          <div className="modal-caption" style={{
            position: 'absolute',
            bottom: '30px',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#eee',
            fontFamily: "'Orbitron', monospace",
            background: 'rgba(0,0,0,0.7)',
            padding: '12px 20px',
            width: 'fit-content',
            margin: '0 auto',
            borderRadius: '60px',
            fontSize: '0.9rem',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none'
          }}>
            {selectedImage.alt}
          </div>
        </div>
      )}
    </>
  );
};