'use client';

/**
 * @fileoverview 页面过渡动画包装器（基于 motion 库）
 * @description Page transition wrapper using motion library for smooth entrance animations
 *
 * Time O(1), Space O(1)
 */

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
