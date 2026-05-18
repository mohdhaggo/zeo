import { useEffect, useRef, useState } from 'react';

export const useWordAnimation = (words: string[]) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      setCurrentWord(words[wordIndexRef.current]);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [words]);

  return { currentWord, isAnimating };
};