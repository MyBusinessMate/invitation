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