'use client';

/**
 * @fileoverview 主题切换组件
 * @description Dark/Light mode toggle with next-themes
 *
 * Time O(1), Space O(1)
 */

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 占位符，避免布局偏移
    return (
      <div
        className={cn(
          'p-2 rounded-full bg-slate-100 dark:bg-white/5 w-9 h-9',
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'p-2 rounded-full bg-slate-100 dark:bg-white/5',
        'text-slate-500 dark:text-slate-400',
        'hover:text-blue-600 dark:hover:text-blue-400',
        'transition-colors duration-200',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
