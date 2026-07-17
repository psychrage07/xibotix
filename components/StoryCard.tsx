'use client';

import { useEffect, useRef, useState } from 'react';
import { Quicksand } from 'next/font/google';
import Image from 'next/image';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

interface StoryCardProps {
  title: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function StoryCard({ title, body, imageSrc, imageAlt = "Story image" }: StoryCardProps) {
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
      { threshold: 0.5 } // Triggers when ~50% visible, as requested
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-full max-w-5xl mx-auto bg-[#ffffff] rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row mb-12 will-change-transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'
      }`}
    >
      {/* Left Column: Image */}
      <div className="w-full md:w-[45%] relative min-h-[350px] md:min-h-[450px] bg-[#111] shrink-0 border-r border-black/10">
        {imageSrc ? (
          <Image src={imageSrc} fill className="object-cover" alt={imageAlt} />
        ) : (
          <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
            {/* Dark placeholder as requested since background is black */}
          </div>
        )}
      </div>

      {/* Right Column: Text Block */}
      <div className="w-full md:w-[55%] p-10 md:p-14 lg:p-20 flex flex-col justify-center items-center bg-white relative">
        <div className="relative w-full max-w-md p-8 md:p-10">
          {/* Decorative Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-300 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-300 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300 rounded-br-sm pointer-events-none" />
          
          {/* Text Content */}
          <h3 className={`text-[#1a1a1a] text-3xl md:text-[2.5rem] font-medium mb-5 leading-tight tracking-tight ${quicksand.className}`}>
            {title}
          </h3>
          <p className="text-gray-500 font-light text-base md:text-lg leading-[1.8]">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
