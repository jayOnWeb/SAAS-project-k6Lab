import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

/**
 * SmoothScroll Component
 * Applies Locomotive Scroll v5 smooth inertia scrolling on marketing pages.
 * Bypasses smooth scroll inside /dashboard to ensure 100% natural, responsive native panel scrolling.
 */
export default function SmoothScroll({ children }) {
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    // Disable Lenis / Locomotive smooth scroll inside dashboard workspace to allow native panel scrolling
    if (location.pathname.startsWith('/dashboard')) {
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
      return;
    }

    let locomotiveScroll;

    try {
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.09,
          duration: 1.2,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          normalizeWheel: true,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        },
      });

      scrollRef.current = locomotiveScroll;
    } catch (err) {
      console.warn('LocomotiveScroll initialization warning:', err);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
    };
  }, [location.pathname]);

  // Reset scroll on route change
  useEffect(() => {
    if (!location.pathname.startsWith('/dashboard')) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <>{children}</>;
}
