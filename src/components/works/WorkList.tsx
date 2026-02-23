'use client';

/**
 * @fileoverview 作品列表组件（带交错入场动画）
 * @description Displays work cards with staggered entrance animations
 *
 * Time O(n), Space O(n) where n = number of works
 */

import { motion } from 'motion/react';
import { WorkCard } from './WorkCard';
import { useI18n } from '@/components/providers/I18nProvider';
import type { WorkListItem } from '@/types';

// 容器动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// 单个卡片动画变体
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface WorkListProps {
  works: WorkListItem[];
}

export function WorkList({ works }: WorkListProps) {
  const { t } = useI18n();

  if (works.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-[#A0A0A0]">{t.common.noWorks}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {works.map((work) => (
        <motion.div key={work.slug} variants={cardVariants}>
          <WorkCard work={work} />
        </motion.div>
      ))}
    </motion.div>
  );
}
