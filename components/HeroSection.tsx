'use client';

import { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import MaskedReveal from './MaskedReveal';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to pause rendering when out of view
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        // Trigger when the hero is completely out of the viewport
        rootMargin: '0px', 
        threshold: 0 
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* 3D Spline Canvas */}
      {/* We use visibility/opacity to hide the canvas when out of view, 
          which helps the browser throttle/pause the WebGL render loop 
          without losing the WebGL context (which display: none might do). */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{ 
          opacity: isInView ? (loaded ? 1 : 0) : 0,
          pointerEvents: isInView ? 'auto' : 'none'
        }}
      >
        <Spline 
          scene="https://prod.spline.design/oKM2cuHg8hpVeVZn/scene.splinecode" 
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Overlay Gradients to blend edges and make text legible */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      {/* Hero Content */}
      <div 
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto pointer-events-none"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease'
        }}
      >
        <MaskedReveal delay={0}>
          <p className="text-[#8a7afb] uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-4">
            Uniting Humans and AI-Powered Robotics
          </p>
        </MaskedReveal>
        
        <MaskedReveal delay={150}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Next-Generation<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Humanoid Systems</span>
          </h1>
        </MaskedReveal>

        <MaskedReveal delay={300}>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed mx-auto">
            We engineer advanced robotic systems that operate seamlessly alongside humans. Built for precise rehabilitation, designed for unprecedented physical fidelity.
          </p>
        </MaskedReveal>
        
        <div className="flex gap-4 pointer-events-auto" style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1s ease 0.8s, transform 1s ease 0.8s'
        }}>
          <button 
            onClick={() => document.getElementById('section-a')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:bg-[#8a7afb] hover:text-white transition-colors uppercase tracking-wider"
          >
            Rehab Devices
          </button>
          <button 
            onClick={() => document.getElementById('section-b')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors uppercase tracking-wider"
          >
            View Humanoids
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
          <div className="w-10 h-10 border-2 border-white/20 border-t-[#8a7afb] rounded-full animate-spin mb-4" />
          <p className="text-white/50 text-sm font-mono tracking-widest uppercase">Initializing System...</p>
        </div>
      )}
    </div>
  );
}
