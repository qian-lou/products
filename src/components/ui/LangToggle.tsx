'use client';

/**
 * @fileoverview 语言切换按钮
 * @description Language toggle button for switching between Chinese and English
 *
 * Time O(1), Space O(1)
 */

import { useI18n } from '@/components/providers/I18nProvider';
import { Languages } from 'lucide-react';

export function LangToggle() {
    const { locale, toggleLocale } = useI18n();

    return (
        <button
            onClick={toggleLocale}
            className="relative flex items-center gap-1.5 px-2 py-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-xs font-medium"
            aria-label={locale === 'en' ? 'Switch to Chinese' : '切换为英文'}
            title={locale === 'en' ? '切换中文' : 'Switch to English'}
        >
            <Languages size={14} />
            <span className="uppercase tracking-wide">{locale === 'en' ? '中' : 'EN'}</span>
        </button>
    );
}
