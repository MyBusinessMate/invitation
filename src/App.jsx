import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PdfInvitation from './components/PdfInvitation';
import './index.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const containerRef = useRef(null);
  const bookGroupRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightShadowRef = useRef(null);
  const leftShadowRef = useRef(null);
  const spineShadowRef = useRef(null);
  const leftPanelLightRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // DESKTOP & TABLET (>= 768px)
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=2400',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Left panel opens around the center hinge: 0deg -> -180deg
        tl.to(
          leftPanelRef.current,
          {
            rotateY: -180,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // 2. Book container shifts to center the single card when closed and the two-panel book when open
        tl.fromTo(
          bookGroupRef.current,
          {
            xPercent: -25,
          },
          {
            xPercent: 0,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // 3. Right shadow stays grounded under right panel throughout
        tl.fromTo(
          rightShadowRef.current,
          {
            opacity: 0.35,
          },
          {
            opacity: 0.35,
            duration: 1,
          },
          0
        );

        // 4. Left shadow is completely hidden (0 opacity) while the cover is closed or lifted in the air!
        // It ONLY fades in at the very end (from 0.7 to 1.0) when the left panel actually comes down flat on the desk!
        tl.fromTo(
          leftShadowRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 0.35,
            ease: 'power2.in',
            duration: 0.3,
          },
          0.7
        );

        // 5. Center spine crease shadow softens slightly as the book opens flat
        tl.fromTo(
          spineShadowRef.current,
          {
            opacity: 0.65,
          },
          {
            opacity: 0.22,
            ease: 'power1.out',
            duration: 1,
          },
          0
        );

        // 6. Lighting shift on front cover as it rotates away from ambient light
        tl.to(
          leftPanelLightRef.current,
          {
            opacity: 0.4,
            ease: 'power1.in',
            duration: 0.5,
          },
          0
        );
      });

      // MOBILE (< 768px)
      // On mobile, the card starts centered and intact.
      // In Phase 1: As user scrolls, the front cover swings open sideways (0deg -> -180deg)
      // revealing the inside anniversary invitation while keeping it grounded.
      // In Phase 2: As user scrolls further, the book smoothly reframes (xPercent: -25 -> 0, scale: 1 -> 0.49)
      // and brings the left page ("A Celebration of Innovation & Growth") into full view
      // alongside the right page, so the complete invitation spread is accessible and visible on mobile!
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=2400',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Initial State: Centered closed card
        tl.set(bookGroupRef.current, {
          xPercent: -25,
          scale: 1,
        });
        tl.set(rightShadowRef.current, {
          opacity: 0.35,
        });
        tl.set(leftShadowRef.current, {
          opacity: 0,
        });

        // Phase 1 (0 to 0.5): Cover opens sideways around its hinge
        tl.to(
          leftPanelRef.current,
          {
            rotateY: -180,
            ease: 'power2.inOut',
            duration: 0.5,
          },
          0
        );

        // Center crease shadow softens
        tl.to(
          spineShadowRef.current,
          {
            opacity: 0.22,
            ease: 'power1.out',
            duration: 0.5,
          },
          0
        );

        // Cover lighting shift
        tl.to(
          leftPanelLightRef.current,
          {
            opacity: 0.4,
            ease: 'power1.in',
            duration: 0.25,
          },
          0
        );

        // Left shadow fades in as cover lands flat
        tl.to(
          leftShadowRef.current,
          {
            opacity: 0.35,
            ease: 'power1.in',
            duration: 0.2,
          },
          0.3
        );

        // Phase 2 (0.5 to 1.0): Reframes the entire spread to bring the left page into full view!
        tl.to(
          bookGroupRef.current,
          {
            xPercent: 0,
            scale: 0.485,
            ease: 'power2.inOut',
            duration: 0.5,
          },
          0.5
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="scroll-wrapper" ref={containerRef}>
      <div className="viewport-stage">
        <div className="scene-perspective">
          <div className="book-group" ref={bookGroupRef}>
            
            {/* Separate, dedicated realistic contact shadows */}
            <div className="book-ambient-shadow shadow-right" ref={rightShadowRef} />
            <div className="book-ambient-shadow shadow-left" ref={leftShadowRef} />

            {/* Main Luxury Menu-Book Structure: Two Exactly Equal Panels */}
            <div className="menu-book">

              {/* 1. RIGHT PANEL — Interior Invitation (Fixed Base) */}
              <div className="menu-panel right-panel">
                {/* Continuous, uniform #F8E9DD interior surface */}
                <div className="panel-interior-surface">
                  {/* Clean, elegant double-line deep maroon border */}
                  <div className="page-border-double">
                    <div className="page-border-inner">
                      <div className="interior-pdf-frame">
                        <PdfInvitation />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. LEFT PANEL — Front Cover / Inner-Facing Page (Hinged at Center) */}
              <div className="menu-panel left-panel" ref={leftPanelRef}>
                
                {/* FRONT FACE: Clean, uninterrupted exact supplied front cover */}
                <div className="panel-face front-cover-face">
                  {/* Exact supplied embossed floral cover image */}
                  <img
                    src="/assets/front_cover_card.jpg"
                    alt="NeoMinds Invitation Cover"
                    className="cover-artwork-img"
                  />

                  {/* Subtle lighting shift as panel turns */}
                  <div className="cover-light-overlay" ref={leftPanelLightRef} />
                </div>

                {/* BACK FACE: Visible when card is OPENED (Inner Left Page) */}
                <div className="panel-face inner-facing-face">
                  {/* Exact supplied embossed floral frame image */}
                  <img
                    src="/assets/inner_left_page.png"
                    alt="Embossed Floral Artwork"
                    className="inner-page-bg-img"
                  />

                  {/* Symmetrical double-line deep maroon border */}
                  <div className="page-border-double">
                    <div className="page-border-inner" />
                  </div>

                  {/* Centered Luxury Typography */}
                  <div className="inner-page-text-container">
                    <div className="inner-page-text-content">
                      <p className="inner-heading-sub">A CELEBRATION OF</p>
                      <h2 className="inner-heading-main">INNOVATION &amp; GROWTH</h2>
                      <p className="inner-body-text">
                        Celebrating the journey, achievements and milestones of Neo Minds Tech Hub.
                      </p>
                      <p className="inner-closing-text">
                        Thank you for being part of our journey.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. CENTER HINGE / SPINE connecting the two equal panels */}
              <div className="center-hinge-spine">
                <div className="spine-crease-shadow" ref={spineShadowRef} />
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}