'use client';

/**
 * @fileoverview 交错动画容器（基于 motion 库）
 * @description Staggered animation container using motion library
 *
 * Time O(n), Space O(1)
 */

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// 容器动画变体：控制子元素交错
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// 子元素动画变体：淡入 + 上滑
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  /** 子元素交错延迟（秒） */
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  const variants = staggerDelay !== 0.08
    ? {
      ...containerVariants,
      visible: {
        ...containerVariants.visible,
        transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
      },
    }
    : containerVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/** 交错容器内的子元素包装 */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
