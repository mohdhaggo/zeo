import React from 'react';
import { CategoryCard } from './CategoryCard';

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      category: 'ppf' as const,
      title: 'PPF',
      color: '#E50914',
      imageUrl: '/PPF-cat.webp',
      description: 'Premium Paint Protection Film engineered for ultimate durability and performance. Self-healing technology, UV resistance, and long-lasting clarity for vehicles worldwide.',
      navUrl: '/ppf-cat',
      isComingSoon: false
    },
    {
      category: 'tint' as const,
      title: 'Window Tint',
      color: '#1E6BFF',
      imageUrl: '/wintint-cat.webp',
      description: 'Advanced Window Tint engineered for heat rejection, UV protection, and ultimate driving comfort.',
      navUrl: '#',
      isComingSoon: true
    },
    {
      category: 'windshield' as const,
      title: 'Windshield Film',
      color: '#8A8A8A',
      imageUrl: '/windshield-cat.webp',
      description: 'Advanced windshield protection film engineered for clarity, durability, and impact resistance.',
      navUrl: '#',
      isComingSoon: true
    }
  ];

  return (
    <div className="category-grid fade-section" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '40px',
      margin: '60px 0'
    }}>
      {categories.map((cat) => (
        <CategoryCard key={cat.category} {...cat} />
      ))}
    </div>
  );
};