import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const Feature: React.FC<FeatureProps> = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-start"
    >
      <div className="p-3 bg-primary-50 rounded-lg text-primary-600 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};