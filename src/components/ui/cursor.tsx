'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CursorProps {
  children: React.ReactNode;
  attachToParent?: boolean;
  className?: string;
  variants?: any;
  transition?: any;
}

export function Cursor({
  children,
  attachToParent = false,
  className = '',
  variants = {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.3, opacity: 0 },
  },
  transition = {
    ease: 'easeInOut',
    duration: 0.15,
  },
}: CursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attachToParent && containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (!parent) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = parent.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      };

      const handleMouseEnter = () => {
        setIsVisible(true);
        parent.style.cursor = 'none';
      };

      const handleMouseLeave = () => {
        setIsVisible(false);
        parent.style.cursor = '';
      };

      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.style.cursor = '';
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
      };

      const handleMouseEnter = () => setIsVisible(true);
      const handleMouseLeave = () => setIsVisible(false);

      window.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseenter', handleMouseEnter);
      document.body.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseenter', handleMouseEnter);
        document.body.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [attachToParent]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-50 overflow-visible">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            style={{
              position: attachToParent ? 'absolute' : 'fixed',
              left: position.x,
              top: position.y,
              pointerEvents: 'none',
              transform: 'translate(0, 0)',
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className={`z-[9999] ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
