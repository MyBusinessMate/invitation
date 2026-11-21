import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point to the local worker in public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfInvitation() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfRendered, setPdfRendered] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let renderTask = null;

    async function loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: '/assets/invitation.pdf' });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = containerRef.current;
        const containerWidth = container ? container.clientWidth : 420;
        
        // High-DPI scale for crisp typography
        const dpr = Math.max(window.devicePixelRatio || 1, 2.5);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth / unscaledViewport.width) * dpr;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const context = canvas.getContext('2d', { alpha: true });
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        });

        await renderTask.promise;
        if (!isCancelled) {
          // Precise typographic patch: replace 'YOU AND UR FAMILY ARE' with 'YOU & YOUR FAMILY ARE'
          try {
            if (document.fonts) {
              await document.fonts.ready;
            }
            const yTop = Math.floor(canvas.height * 0.193);
            const yHeight = Math.floor(canvas.height * 0.021);
            const xLeft = Math.floor(canvas.width * 0.16);
            const xWidth = Math.floor(canvas.width * 0.68);

            const bgData = context.getImageData(Math.floor(canvas.width * 0.20), yTop - 3, 1, 1).data;
            const bgCol = `rgb(${bgData[0]}, ${bgData[1]}, ${bgData[2]})`;

            // Clear original text
            context.fillStyle = bgCol;
            context.fillRect(xLeft, yTop, xWidth, yHeight);

            // Re-render corrected text matching exact luxury Cinzel typography
            const fontSize = Math.round(canvas.height * 0.0135);
            context.font = `600 ${fontSize}px Cinzel, serif`;
            context.fillStyle = '#5C1B1F';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.letterSpacing = '3.5px';
            const textY = yTop + (yHeight / 2) + 1;
            context.fillText('YOU & YOUR FAMILY ARE', canvas.width / 2, textY);
          } catch (e) {
            console.warn('Canvas text replacement note:', e);
          }

          setPdfRendered(true);
        }
      } catch (err) {
        console.error('PDF.js rendering error:', err);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // ignore cancel error on unmount
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="pdf-invitation-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
    >
      <canvas
        ref={canvasRef}
        className="pdf-canvas"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          opacity: pdfRendered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
}