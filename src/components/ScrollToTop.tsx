import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useApp();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('common.goTop', 'Yukarı Çık')}
      title={t('common.goTop', 'Sayfa Başına Dön')}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-neutral-900/90 dark:bg-neutral-800/90 text-white hover:text-amber-400 dark:hover:text-amber-400 border border-neutral-700/80 dark:border-neutral-600/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 cursor-pointer group"
    >
      <ChevronUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
};
