'use client';

import { useEffect, useRef } from 'react';
import { Quicksand } from 'next/font/google';
import Image from 'next/image';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

/* ─────────────────────────────────────────────────────── */

export default function HumanoidScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Image layer refs
  const img0 = useRef<HTMLDivElement>(null);
  const img1 = useRef<HTMLDivElement>(null);

  // Slide text wrapper refs (opacity)
  const txt0 = useRef<HTMLDivElement>(null);
  const txt1 = useRef<HTMLDivElement>(null);

  // Per-line clip refs — Slide 0 (outgoing)
  const s0r0 = useRef<HTMLDivElement>(null); // index label
  const s0r1 = useRef<HTMLDivElement>(null); // title
  const s0r2 = useRef<HTMLDivElement>(null); // body

  // Per-line clip refs — Slide 1 (incoming)
  const s1r0 = useRef<HTMLDivElement>(null);
  const s1r1 = useRef<HTMLDivElement>(null);
  const s1r2 = useRef<HTMLDivElement>(null);

  // Dot refs
  const dot0 = useRef<HTMLDivElement>(null);
  const dot1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let rafId: number;

    /** clamp value between min and max */
    const cl = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));
    /** normalise v into 0-1 over [start, end] range */
    const nm = (v: number, s: number, e: number) => cl((v - s) / (e - s), 0, 1);

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const p = cl(-rect.top / range, 0, 1);

      /* ── Images: both scroll upward linearly inside clip ── */
      // img0 starts at y=0, exits top (y= -100%) by end
      // img1 starts at y=100% (below), arrives at y=0 by end
      if (img0.current) img0.current.style.transform = `translateY(${-p * 100}%)`;
      if (img1.current) img1.current.style.transform = `translateY(${(1 - p) * 100}%)`;

      /* ── Slide 0 lines exit upward through clip masks ── */
      // staggered: label first, then title, then body
      const e0 = nm(p, 0.20, 0.40); // label
      const e1 = nm(p, 0.24, 0.44); // title
      const e2 = nm(p, 0.28, 0.48); // body
      if (s0r0.current) s0r0.current.style.transform = `translateY(${-e0 * 110}%)`;
      if (s0r1.current) s0r1.current.style.transform = `translateY(${-e1 * 110}%)`;
      if (s0r2.current) s0r2.current.style.transform = `translateY(${-e2 * 110}%)`;

      /* ── Slide 1 lines enter upward through clip masks ── */
      const i0 = nm(p, 0.55, 0.72); // label
      const i1 = nm(p, 0.59, 0.76); // title
      const i2 = nm(p, 0.63, 0.80); // body
      if (s1r0.current) s1r0.current.style.transform = `translateY(${(1 - i0) * 110}%)`;
      if (s1r1.current) s1r1.current.style.transform = `translateY(${(1 - i1) * 110}%)`;
      if (s1r2.current) s1r2.current.style.transform = `translateY(${(1 - i2) * 110}%)`;

      /* ── Panel opacity ── */
      const op0 = cl(1 - nm(p, 0.35, 0.52), 0, 1);
      const op1 = cl(nm(p, 0.50, 0.68), 0, 1);
      if (txt0.current) txt0.current.style.opacity = op0.toString();
      if (txt1.current) {
        txt1.current.style.opacity = op1.toString();
        txt1.current.style.pointerEvents = op1 > 0 ? 'auto' : 'none';
      }

      /* ── Progress dots ── */
      const on2 = p >= 0.5;
      if (dot0.current) {
        dot0.current.style.width = on2 ? '6px' : '22px';
        dot0.current.style.background = on2 ? '#d1d5db' : '#111';
      }
      if (dot1.current) {
        dot1.current.style.width = on2 ? '22px' : '6px';
        dot1.current.style.background = on2 ? '#111' : '#d1d5db';
      }
    };

    const onScroll = () => { rafId = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    tick(); // run once immediately
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    /* Scroll driver: tall enough for 2 "slides" + 1 viewport of sticky display */
    <div ref={sectionRef} className="relative" style={{ height: '300vh' }}>

      {/* Sticky container — holds the card while parent scrolls */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-black">

        {/* ══ Card ══ */}
        <div
          className="relative overflow-hidden flex rounded-[2rem] bg-white"
          style={{
            width: '90vw',
            maxWidth: '1200px',
            height: 'clamp(480px, 68vh, 720px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          }}
        >

          {/* ── Left: clipping image panel ── */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{ width: '48%' }}
          >
            {/* Image 0 — starts in place, scrolls up and out */}
            <div ref={img0} className="absolute inset-0 will-change-transform">
              <Image src="/manu.png" fill sizes="(max-width:768px) 90vw, 48vw"
                className="object-cover object-center" alt="Manu" priority />
            </div>
            {/* Image 1 — starts below, scrolls up into place */}
            <div ref={img1} className="absolute inset-0 will-change-transform"
              style={{ transform: 'translateY(100%)' }}>
              <Image src="/cleva.png" fill sizes="(max-width:768px) 90vw, 48vw"
                className="object-cover object-center" alt="Cleva" />
            </div>
          </div>

          {/* ── Right: text panel ── */}
          <div className="relative flex-1 bg-white overflow-hidden flex items-center">

            {/* Corner brackets */}
            <div className="pointer-events-none absolute top-7 left-7 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-gray-300" />
            <div className="pointer-events-none absolute top-7 right-7 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-gray-300" />
            <div className="pointer-events-none absolute bottom-7 left-7 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-gray-300" />
            <div className="pointer-events-none absolute bottom-7 right-7 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-gray-300" />

            {/* ── Slide 0: Manu ── */}
            <div ref={txt0} className="absolute inset-0 flex items-center px-12 lg:px-16 will-change-[opacity]">
              <div className="w-full max-w-[400px]">

                {/* Label */}
                <div className="overflow-hidden pb-[0.12em]">
                  <div ref={s0r0} className="will-change-transform text-[0.58rem] tracking-[0.45em] uppercase text-gray-400 mb-5">
                    /01
                  </div>
                </div>

                {/* Title */}
                <div className="overflow-hidden pb-[0.1em]">
                  <div ref={s0r1} className={`will-change-transform text-[#111] leading-[1.1] mb-5 ${quicksand.className}`}
                    style={{ fontSize: 'clamp(2.2rem, 3.2vw, 3.1rem)', fontWeight: 600 }}>
                    Manu
                  </div>
                </div>

                {/* Body */}
                <div className="overflow-hidden pb-[0.1em]">
                  <div ref={s0r2} className="will-change-transform text-gray-500 font-light leading-relaxed"
                    style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>
                    A facially expressive humanoid robot built to read, respond to, and reflect human emotion — blurring the boundary between machine and presence.
                  </div>
                </div>

              </div>
            </div>

            {/* ── Slide 1: Cleva ── */}
            <div ref={txt1} className="absolute inset-0 flex items-center px-12 lg:px-16 will-change-[opacity]"
              style={{ opacity: 0, pointerEvents: 'none' }}>
              <div className="w-full max-w-[400px]">

                {/* Label */}
                <div className="overflow-hidden pb-[0.12em]">
                  <div ref={s1r0} className="will-change-transform text-[0.58rem] tracking-[0.45em] uppercase text-gray-400 mb-5"
                    style={{ transform: 'translateY(110%)' }}>
                    /02
                  </div>
                </div>

                {/* Title */}
                <div className="overflow-hidden pb-[0.1em]">
                  <div ref={s1r1} className={`will-change-transform text-[#111] leading-[1.1] mb-5 ${quicksand.className}`}
                    style={{ fontSize: 'clamp(2.2rem, 3.2vw, 3.1rem)', fontWeight: 600, transform: 'translateY(110%)' }}>
                    Cleva
                  </div>
                </div>

                {/* Body */}
                <div className="overflow-hidden pb-[0.1em]">
                  <div ref={s1r2} className="will-change-transform text-gray-500 font-light leading-relaxed"
                    style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', transform: 'translateY(110%)' }}>
                    Human-Like Intelligence, Machine Precision. Cleva combines advanced neural inference with razor-sharp physical dexterity to handle complex real-world tasks.
                  </div>
                </div>

              </div>
            </div>

          </div>{/* end right panel */}

          {/* Progress dots */}
          <div className="absolute bottom-6 right-8 flex items-center gap-[6px] z-10">
            <div ref={dot0} className="rounded-full transition-[width,background] duration-300"
              style={{ width: 22, height: 6, background: '#111' }} />
            <div ref={dot1} className="rounded-full transition-[width,background] duration-300"
              style={{ width: 6, height: 6, background: '#d1d5db' }} />
          </div>

        </div>{/* end card */}
      </div>{/* end sticky */}
    </div>
  );
}
