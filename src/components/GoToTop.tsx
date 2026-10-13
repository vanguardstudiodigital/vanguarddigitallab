import { useEffect, useState } from 'react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Sayfa 300 piksel aşağı kayınca butonu göster
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Hafıza sızıntısını önlemek için event'i temizle
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Yumuşak kaydırma efekti
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded border border-[#262626] bg-[#0d0d0d] text-white transition-all duration-300 hover:border-[#404040] hover:bg-[#171717] focus:outline-none ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      aria-label="Yukarı Çık"
    >
      <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </button>
  );
}
