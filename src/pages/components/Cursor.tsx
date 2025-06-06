import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Only show custom cursor on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary-500 rounded-full z-50 pointer-events-none"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6
        }}
        animate={{
          scale: isPointer ? 0.5 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
      />

      {/* Cursor ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-primary-500/50 rounded-full z-50 pointer-events-none"
        style={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          borderColor: isPointer ? "rgba(0, 73, 255, 0.8)" : "rgba(0, 73, 255, 0.5)"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28
        }}
      />
    </>
  );
};

export default Cursor;