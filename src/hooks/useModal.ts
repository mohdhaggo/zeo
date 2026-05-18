import { useState, useCallback } from 'react';
import { Product } from '../types';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
    document.body.style.overflow = '';
  }, []);

  return { isOpen, selectedProduct, openModal, closeModal };
};