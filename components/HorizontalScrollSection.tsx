'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const CARDS = [
  {
    id: '01',
    title: 'Finger Rehab',
    subtitle: 'PRECISION THERAPY FOR FINE MOTOR RECOVERY',
    image: '/finger_rehab.png',
  },
  {
    id: '02',
    title: 'Wrist Rehab',
    subtitle: 'RESTORING STRENGTH AND FLEXIBILITY',
    image: '/wrist_rehab.png',
  },
  {
    id: '03',
    title: 'Elbow Rehab',
    subtitle: 'GUIDED RANGE-OF-MOTION RECOVERY',
    image: '/elbow_rehab.png',
  },
  {
    id: '04',
    title: 'Shoulder Rehab',
    subtitle: 'REBUILDING STABILITY AND MOBILITY',
    image: '/shoulder_rehab.png',
  },
];

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current || !scrollContainerRef.current) return;
      
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollableDistance = height - windowHeight;
      const scrolled = -top;
      
      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      // Directly mutate DOM to avoid React re-renders during scroll
      scrollContainerRef.current.style.transform = `translateX(-${progress * 65}%)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // initial set
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-black text-white"
      style={{ height: '300vh' }} // scroll runway
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row items-center">
        
        {/* Left Static Panel */}
        <div className="w-full md:w-[40%] h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 shrink-0 z-10 relative bg-black border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.8)]">
          <div className="mb-4 text-xs font-bold tracking-widest text-[#8a7afb] uppercase">
            OUR SOLUTIONS (4)
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            MEET OUR REHAB TECH
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-300">
            RECOVERY READY TECH... ANYTIME, ANYWHERE
          </h3>
          <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed">
            Our smart rehabilitation technology is clinically proven and
            ready for recovery at home or in clinic. Our affordable robotic solutions
            ensure faster recovery, personalized therapy and reduced dependence on
            in-person physiotherapy, while supporting real-time progress tracking across
            every stage of hand and arm rehabilitation.
          </p>
        </div>

        {/* Right Scrolling Panel */}
        <div className="w-full md:w-[60%] h-full flex items-center overflow-visible">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 px-4 md:px-8 h-[60vh] md:h-[70vh] items-center"
            style={{ 
              transform: `translateX(0%)`, 
              transition: 'transform 0.1s ease-out',
              willChange: 'transform'
            }}
          >
            {CARDS.map((card) => (
              <div 
                key={card.id} 
                className="group relative w-[80vw] md:w-[400px] lg:w-[450px] h-full shrink-0 rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Background Image with hover scale */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill
                    className="object-cover"
                    quality={90}
                  />
                </div>
                
                {/* Gradients for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top Left Index */}
                  <div className="text-[#8a7afb] font-mono text-xl font-bold">
                    /{card.id}
                  </div>
                  
                  {/* Bottom Content */}
                  <div className="mt-auto transform transition-transform duration-500 group-hover:-translate-y-4">
                    <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-gray-300 text-sm tracking-wide uppercase font-semibold mb-6 max-w-[80%]">
                      {card.subtitle}
                    </p>
                    
                    {/* View Button (fades in on hover) */}
                    <div className="opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-[#8a7afb] hover:text-white transition-colors">
                        View {card.title}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Spacer at the end so the last card doesn't hug the screen edge */}
            <div className="w-[10vw] md:w-[20vw] shrink-0" />
          </div>
        </div>

      </div>
    </section>
  );
}
