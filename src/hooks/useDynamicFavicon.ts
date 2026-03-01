import { useEffect } from 'react';

const SIZE = 32;
const PERIOD = 2000; // ms per full pulse cycle

export function useDynamicFavicon() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d')!;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const faviconEl = link;

    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
    let startTime: number | null = null;
    let rafId: number;

    function draw(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const t = ((timestamp - startTime) % PERIOD) / PERIOD; // 0 → 1

      const dark = darkMq.matches;
      const CENTER = SIZE / 2;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Background circle
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, CENTER, 0, Math.PI * 2);
      ctx.fillStyle = dark ? '#1c1c1e' : '#ffffff';
      ctx.fill();

      // Expanding, fading ring
      const ringRadius = 4 + (CENTER - 5) * t;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = dark
        ? `rgba(255,255,255,${(1 - t).toFixed(3)})`
        : `rgba(3,2,19,${(1 - t).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Solid core dot
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 4, 0, Math.PI * 2);
      ctx.fillStyle = dark ? '#ffffff' : '#030213';
      ctx.fill();

      faviconEl.href = canvas.toDataURL();

      if (!document.hidden) {
        rafId = requestAnimationFrame(draw);
      }
    }

    function handleVisibility() {
      if (!document.hidden) {
        startTime = null;
        rafId = requestAnimationFrame(draw);
      }
    }

    function handleThemeChange() {
      // Force a redraw immediately on theme switch
      startTime = null;
    }

    document.addEventListener('visibilitychange', handleVisibility);
    darkMq.addEventListener('change', handleThemeChange);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
      darkMq.removeEventListener('change', handleThemeChange);
    };
  }, []);
}
