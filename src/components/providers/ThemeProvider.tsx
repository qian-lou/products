'use client';

/**
 * @fileoverview 主题提供者
 * @description Wrapper for next-themes ThemeProvider
 *
 * Time O(1), Space O(1)
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
