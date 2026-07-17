'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HalfProps {
  sceneUrl: string;
  label: string;
  sublabel: string;
  targetId: string;
  side: 'left' | 'right';
  hoveredSide: 'left' | 'right' | null;   // which side the cursor is on globally
  onHover: (side: 'left' | 'right' | null) => void;
  loaded: boolean;
  onLoad: () => void;
}

// ─── Single scene half ────────────────────────────────────────────────────────
function SceneHalf({
  sceneUrl,
  label,
  sublabel,
  targetId,
  side,
  hoveredSide,
  onHover,
  loaded,
  onLoad,
}: HalfProps) {
  const handleClick = useCallback(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  }, [targetId]);

  const isLeft = side === 'left';
  const isHovered = hoveredSide === side;
  const siblingHovered = hoveredSide !== null && hoveredSide !== side;

  // Default 50/50. Hovered side grows to 58%, sibling shrinks to 42%.
  const flexBasis = isHovered ? '58%' : siblingHovered ? '42%' : '50%';

  return (
    <div
      className={`scene-half scene-half--${side}`}
      style={{
        flex: `0 0 ${flexBasis}`,
        transition: 'flex 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => onHover(side)}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
    >
      {/* Spline scene */}
      <div className="scene-spline">
        <Spline scene={sceneUrl} onLoad={onLoad} />
      </div>

      {/* Outer edge vignette */}
      <div
        className="scene-vignette"
        style={{
          background: isLeft
            ? 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 35%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 35%)',
        }}
      />

      {/* Label */}
      <div
        className={`scene-label scene-label--${side}`}
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p className="scene-sublabel">{sublabel}</p>
        <h2 className="scene-title">{label}</h2>
        <div className={`scene-cta ${isLeft ? '' : 'scene-cta--right'}`}>
          {!isLeft && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 8H3M7 4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>Explore</span>
          {isLeft && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Hover shimmer */}
      <div className={`scene-ring ${isHovered ? 'scene-ring--active' : ''}`} />
    </div>
  );
}

// ─── Main hero ────────────────────────────────────────────────────────────────
export default function DualSplineHero() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const bothLoaded = leftLoaded && rightLoaded;

  useEffect(() => {
    if (bothLoaded && heroRef.current) {
      heroRef.current.style.opacity = '1';
    }
  }, [bothLoaded]);

  return (
    <div
      ref={heroRef}
      className="dual-hero"
      style={{ opacity: 0, transition: 'opacity 1.4s ease' }}
    >
      {/* Left scene */}
      <SceneHalf
        sceneUrl="https://prod.spline.design/oKM2cuHg8hpVeVZn/scene.splinecode"
        label="Robotics"
        sublabel="Explore our"
        targetId="section-a"
        side="left"
        hoveredSide={hoveredSide}
        onHover={setHoveredSide}
        loaded={leftLoaded}
        onLoad={() => setLeftLoaded(true)}
      />

      {/* Seam (hidden, kept for future use) */}
      <div className="dual-hero__seam" />

      {/* Right scene */}
      <SceneHalf
        sceneUrl="https://prod.spline.design/MwXLG8M8lHKAx2Nr/scene.splinecode"
        label="AI Systems"
        sublabel="Discover our"
        targetId="section-b"
        side="right"
        hoveredSide={hoveredSide}
        onHover={setHoveredSide}
        loaded={rightLoaded}
        onLoad={() => setRightLoaded(true)}
      />

      {/* Loading overlay */}
      {!bothLoaded && (
        <div className="dual-hero__loader">
          <div className="loader-ring" />
          <p className="loader-text">Initializing…</p>
        </div>
      )}

      {/* Scroll hint */}
      {bothLoaded && (
        <div className="dual-hero__scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-chevron" />
        </div>
      )}
    </div>
  );
}
