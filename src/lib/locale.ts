/**
 * @fileoverview 服务端语言检测工具
 * @description Server-side locale detection from cookies
 *
 * Time O(1), Space O(1)
 */

import { cookies } from 'next/headers';

export type Locale = 'en' | 'zh';

/** 文件名前缀映射 */
const LOCALE_PREFIX_MAP: Record<Locale, string> = {
    en: 'en_',
    zh: 'ch_',
};

/**
 * 从 cookie 获取当前语言（服务端使用）
 * @returns 当前语言，默认 'en'
 */
export async function getServerLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const raw = cookieStore.get('portfolio-locale')?.value;
    if (raw === 'zh') return 'zh';
    return 'en';
}

/**
 * 获取指定语言的文件名前缀
 * @param locale - 语言标识
 * @returns 文件名前缀，如 'en_' 或 'ch_'
 */
export function getLocalePrefix(locale: Locale): string {
    return LOCALE_PREFIX_MAP[locale];
}

/**
 * 从带前缀的文件名中提取 slug
 * @param fileName - 文件名，如 'en_portfolio-website.md'
 * @returns slug，如 'portfolio-website'
 */
export function extractSlugFromLocalizedFile(fileName: string): string {
    // 移除扩展名
    const withoutExt = fileName.replace(/\.(md|mdx)$/, '');
    // 移除语言前缀（en_ 或 ch_）
    return withoutExt.replace(/^(en|ch)_/, '');
}
