/**
 * @fileoverview 工具函数
 * @description Common utility functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind 类名，处理冲突
 * Time O(n), Space O(n)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期
 * Time O(1), Space O(1)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 生成完整的 URL
 * Time O(1), Space O(1)
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
