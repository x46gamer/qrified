import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl mb-12 ${alignmentClasses[align]} ${className}`}
    >
      <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
        {subtitle}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
};