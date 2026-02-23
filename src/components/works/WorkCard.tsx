'use client';

/**
 * @fileoverview 作品卡片组件
 * @description 用于展示单个作品的信息卡片
 *
 * Time O(1), Space O(1) per render
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { WorkListItem } from '@/types';

interface WorkCardProps {
  work: WorkListItem;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="group relative grid grid-cols-1 md:grid-cols-8 gap-6 p-6 -mx-6 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none border border-transparent hover:border-slate-100 dark:hover:border-white/5">
      {/* 内容区域 */}
      <div className="md:col-span-5 lg:col-span-6 flex flex-col justify-center order-2 md:order-1">
        {/* 标题 */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex items-center gap-2">
          {work.title}
          <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </h3>

        {/* 描述 */}
        <p className="mt-2 text-slate-600 dark:text-[#A0A0A0] text-sm leading-relaxed">
          {work.excerpt}
        </p>

        {/* 标签 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-transparent border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 封面图 */}
      <div className="md:col-span-3 lg:col-span-2 order-1 md:order-2">
        <div className="aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] w-full rounded-lg bg-slate-100 dark:bg-white/5 overflow-hidden border border-slate-100 dark:border-white/5 relative">
          {work.cover ? (
            <Image
              src={work.cover}
              alt={work.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transform group-hover:scale-105 transition-transform duration-500 dark:opacity-80 dark:group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* 链接覆盖层 */}
      <Link
        href={`/works/${work.slug}`}
        aria-label={`View ${work.title}`}
        className="absolute inset-0 z-10"
      />
    </article>
  );
}
