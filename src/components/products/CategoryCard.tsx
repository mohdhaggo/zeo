import React from 'react';

interface CategoryCardProps {
  category: 'ppf' | 'tint' | 'windshield';
  title: string;
  color: string;
  imageUrl: string;
  description: string;
  navUrl: string;
  isComingSoon?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  title, 
  color, 
  imageUrl, 
  description, 
  navUrl,
  isComingSoon = false 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isComingSoon || !navUrl || navUrl === '#') {
      e.preventDefault();
    }
  };

  return (
    <a
      href={navUrl}
      onClick={handleClick}
      className="cat-card"
      data-category={category}
      role="button"
      aria-disabled={isComingSoon}
      style={{
        background: '#0C0C12',
        borderRadius: '40px',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        border: '1px solid rgba(229,9,20,0.2)',
        cursor: isComingSoon ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        display: 'block',
        opacity: isComingSoon ? 0.7 : 1,
        color: 'inherit'
      }}
    >
      <div 
        className="card-img" 
        style={{
          height: '220px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('${imageUrl}')`
        }}
      />
      <div className="card-content" style={{ padding: '28px 24px' }}>
        <div 
          className="card-category" 
          style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800, 
            marginBottom: '12px',
            color: color 
          }}
        >
          {title}
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#ccc', marginBottom: '20px' }}>
          {isComingSoon ? 'COMING SOON.' : description}
        </p>
        <span 
          className="explore-link" 
          style={{ 
            fontWeight: 600, 
            transition: '0.2s', 
            display: 'inline-block',
            color: color
          }}
        >
          ⟶ {isComingSoon ? 'Coming Soon' : 'Explore'} {title}
        </span>
      </div>
      
      <style>{`
        .cat-card[data-category="ppf"]:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 40px -20px #E50914;
          border-color: #E50914;
          background: linear-gradient(145deg, #0C0C12, #1a0a0a);
        }
        .cat-card[data-category="tint"]:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 40px -20px #1E6BFF;
          border-color: #1E6BFF;
          background: linear-gradient(145deg, #0C0C12, #0a1220);
        }
        .cat-card[data-category="windshield"]:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 40px -20px #8A8A8A;
          border-color: #8A8A8A;
          background: linear-gradient(145deg, #0C0C12, #151515);
        }
        .cat-card:hover .explore-link {
          transform: translateX(8px);
        }
      `}</style>
    </a>
  );
};