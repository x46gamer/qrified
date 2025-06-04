import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Define movement direction
  let x = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);
  let y = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);

  if (direction === 'up') {
    y = useTransform(scrollYProgress, [0, 1], ['0%', `${-50 * speed}%`]);
  } else if (direction === 'down') {
    y = useTransform(scrollYProgress, [0, 1], ['0%', `${50 * speed}%`]);
  } else if (direction === 'left') {
    x = useTransform(scrollYProgress, [0, 1], ['0%', `${-50 * speed}%`]);
  } else if (direction === 'right') {
    x = useTransform(scrollYProgress, [0, 1], ['0%', `${50 * speed}%`]);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};