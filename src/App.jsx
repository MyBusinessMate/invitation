import React, { useRef, useState, useEffect } from 'react';
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

  // Modal Pop-up State for detailed reading on tap
  const [activeModal, setActiveModal] = useState(null); // 'left' | 'right' | null
  const [isOpenProgress, setIsOpenProgress] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // DESKTOP & TABLET (>= 768px)
      mm.add('(min-width: 768px)', () => {
        // Ensure starting clean coordinates without CSS transform residue
        gsap.set(bookGroupRef.current, { x: 0, xPercent: -25 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=2400',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setIsOpenProgress(self.progress > 0.4);
            },
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

        // 2. Book container shifts: -25% (centers closed single card) -> 0% (centers open 2-page spread)
        tl.fromTo(
          bookGroupRef.current,
          {
            x: 0,
            xPercent: -25,
          },
          {
            x: 0,
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

        // 4. Left shadow fades in at the end as the left panel touches down flat on desk
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
      // Smooth, unified motion identical to desktop:
      // In one fluid timeline, the front cover rotates open (0deg -> -180deg)
      // while the book shifts (xPercent: -21.25 -> 0) and reframes (scale: 0.85 -> 0.58).
      // Both the closed card and open 2-page spread remain perfectly centered on mobile!
      mm.add('(max-width: 767px)', () => {
        // Ensure starting clean coordinates without CSS transform residue
        gsap.set(bookGroupRef.current, { x: 0, xPercent: -21.25, scale: 0.85, transformOrigin: '50% 50%' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=2400',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setIsOpenProgress(self.progress > 0.4);
            },
          },
        });

        // 1. Cover opens smoothly around center hinge: 0deg -> -180deg
        tl.to(
          leftPanelRef.current,
          {
            rotateY: -180,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // 2. Book container shifts and reframes in one continuous fluid motion
        tl.fromTo(
          bookGroupRef.current,
          {
            x: 0,
            xPercent: -21.25,
            scale: 0.85,
            transformOrigin: '50% 50%',
          },
          {
            x: 0,
            xPercent: 0,
            scale: 0.58,
            transformOrigin: '50% 50%',
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

        // 4. Left shadow fades in as cover lands flat
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

        // 5. Center crease shadow softens
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

        // 6. Subtle lighting shift on front cover as it rotates
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
    },
    { scope: containerRef }
  );

  return (
    <div className="scroll-wrapper" ref={containerRef}>
      {/* Rich Embossed Luxury Background Texture & Atmosphere */}
      <div className="luxury-backdrop" aria-hidden="true">
        <div className="backdrop-paper-grain" />
        <div className="backdrop-embossed-corner corner-top-left" />
        <div className="backdrop-embossed-corner corner-top-right" />
        <div className="backdrop-embossed-corner corner-bottom-left" />
        <div className="backdrop-embossed-corner corner-bottom-right" />
        <div className="backdrop-filigree-top" />
        <div className="backdrop-filigree-bottom" />
        <div className="backdrop-vignette" />
      </div>

      <div className="viewport-stage">
        <div className="scene-perspective">
          <div className="book-group" ref={bookGroupRef}>
            
            {/* Separate, dedicated realistic contact shadows */}
            <div className="book-ambient-shadow shadow-right" ref={rightShadowRef} />
            <div className="book-ambient-shadow shadow-left" ref={leftShadowRef} />

            {/* Main Luxury Menu-Book Structure: Two Exactly Equal Panels */}
            <div className="menu-book">

              {/* 1. RIGHT PANEL — Interior Invitation (Fixed Base) */}
              <div 
                className="menu-panel right-panel clickable-panel"
                onClick={() => setActiveModal('right')}
                role="button"
                tabIndex={0}
                aria-label="Click to enlarge right invitation page"
              >
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
                {/* Refined subtle tap badge */}
                <div className="tap-hint-badge">
                  <svg className="tap-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>Tap to expand</span>
                </div>
              </div>

              {/* 2. LEFT PANEL — Front Cover / Inner-Facing Page (Hinged at Center) */}
              <div 
                className="menu-panel left-panel clickable-panel" 
                ref={leftPanelRef}
                onClick={() => {
                  if (isOpenProgress) {
                    setActiveModal('left');
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Click to enlarge left celebration page"
              >
                
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

                  {/* Refined subtle tap badge */}
                  <div className="tap-hint-badge">
                    <svg className="tap-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <span>Tap to expand</span>
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

      {/* ====================================================================
          FULL-SCREEN LUXURY POP-UP MODAL (Both Left & Right Pages)
          Equipped with elegant top-right 'X' close button and smooth backdrop
          ==================================================================== */}
      {activeModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="modal-content-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close 'X' Button */}
            <button 
              className="modal-close-btn"
              onClick={() => setActiveModal(null)}
              aria-label="Close Pop-up"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* LEFT PAGE MODAL POP-UP */}
            {activeModal === 'left' && (
              <div className="modal-inner-page left-modal-view">
                <img
                  src="/assets/inner_left_page.png"
                  alt="Embossed Floral Artwork"
                  className="modal-page-bg-img"
                />
                <div className="modal-border-double">
                  <div className="modal-border-inner" />
                </div>
                <div className="modal-text-container">
                  <div className="modal-text-content">
                    <p className="modal-heading-sub">A CELEBRATION OF</p>
                    <h2 className="modal-heading-main">INNOVATION &amp; GROWTH</h2>
                    <p className="modal-body-text">
                      Celebrating the journey, achievements and milestones of Neo Minds Tech Hub.
                    </p>
                    <p className="modal-closing-text">
                      Thank you for being part of our journey.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT PAGE MODAL POP-UP */}
            {activeModal === 'right' && (
              <div className="modal-inner-page right-modal-view">
                <div className="modal-border-double">
                  <div className="modal-border-inner">
                    <div className="modal-pdf-frame">
                      <PdfInvitation />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
