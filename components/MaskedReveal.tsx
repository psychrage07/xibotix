'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
}

export default function MaskedReveal({ children, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden inline-block w-full">
      <div 
        className="will-change-transform"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
        }}
      >
        {children}
      </div>
    </div>
  );
}
