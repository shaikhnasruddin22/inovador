'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<string | null>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for cursor follow
  const springX = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 600, damping: 35 });

  useEffect(() => {
    // Only bind mouse listeners if fine pointer is supported and reduced-motion is not preferred
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!finePointerQuery.matches || reducedMotionQuery.matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering an element with data-cursor
      const target = e.target as HTMLElement | null;
      const cursorElem = target?.closest('[data-cursor]') as HTMLElement | null;

      if (cursorElem) {
        const type = cursorElem.getAttribute('data-cursor');
        const customLabel = cursorElem.getAttribute('data-cursor-text');
        setCursorType(type);

        if (customLabel) {
          setCursorText(customLabel);
        } else if (type === 'view') {
          setCursorText('VIEW WORK');
        } else if (type === 'drag') {
          setCursorText('DRAG ↔');
        } else if (type === 'open') {
          setCursorText('EXPAND +');
        } else {
          setCursorText('');
        }
      } else {
        setCursorType(null);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setCursorType(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isVisible || !cursorType) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{
          left: springX,
          top: springY,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.18 }}
        className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <div className="px-3.5 py-1.5 bg-[#121212]/90 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-[10px] uppercase tracking-[0.16em] font-sans font-medium rounded-full shadow-2xl flex items-center gap-1.5">
          <span>{cursorText}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
