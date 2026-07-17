'use client';

import { useEffect, useRef } from 'react';

export default function FooterSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    let x = 0;
    let rafId: number;

    const tick = () => {
      x -= 1.4;
      // Reset when first copy has fully scrolled off (half of total width)
      if (Math.abs(x) >= el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    /*
     * STICKY REVEAL PATTERN (corrected):
     * ─────────────────────────────────────────────────────────
     * The footer itself has NO position/z-index that would create
     * a containing block — that was breaking sticky.
     *
     * Inner wrapper is `position:relative` only (no z-index),
     * so the sticky child can freely pin to the viewport.
     *
     *   B (dark, sticky top:0, z:1)   ← pinned underneath
     *   A (cream, margin-top:-B_h, z:10, min-h:130vh)
     *                                  ← sits on top, scrolls away
     *
     * Scroll runway = wrapper height ≈ cream_height (130vh)
     * After cream exits, dark (38vh) fills the bottom.
     * ─────────────────────────────────────────────────────────
     */
    <footer style={{ position: 'relative', '--reveal-ht': 'max(50vh, 260px)' } as any}>
      
      {/* ── B: Dark marquee — PINNED underneath ── */}
      {/* Sticking to the top, but offset so its bottom touches the viewport bottom */}
      <div
        style={{
          position: 'sticky',
          top: 'calc(100dvh - var(--reveal-ht))',
          zIndex: 1,
          height: 'var(--reveal-ht)',
          background: '#0f0f0e',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={marqueeRef}
          style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
        >
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 'clamp(4.5rem, 10vw, 10rem)',
                fontWeight: 700,
                color: '#cdc9c3',
                lineHeight: 1,
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Get in touch
                  <span style={{ color: '#44403c', margin: '0 2.5rem', fontWeight: 300, fontSize: '0.7em' }}>
                    /
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── A: Cream CTA — covers B initially, scrolls up to reveal B ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          /* Pulls A up to exactly cover B's physical space in the flow */
          marginTop: 'calc(var(--reveal-ht) * -1)',
          minHeight: '80vh',
          background: '#eae6e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 600,
            color: '#111',
            textAlign: 'center',
            lineHeight: 1.25,
            marginBottom: '2.5rem',
            fontFamily: 'inherit',
          }}
        >
          Interested in<br />learning more?
        </h2>

        <a
          href="#"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.85rem 2.5rem',
            background: '#111',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            borderRadius: '2px',
            textDecoration: 'none',
            transition: 'background 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#333')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111')}
        >
          Contact Us
        </a>
      </div>

      {/* ── Spacer ── */}
      {/* Provides scroll runway so A can scroll up past the bottom of the viewport, revealing B. */}
      {/* Height matches B's height so B perfectly fills the space at the end. */}
      <div style={{ height: 'var(--reveal-ht)', position: 'relative' }} />

    </footer>
  );
}
