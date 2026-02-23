'use client';

/**
 * @fileoverview 国际化上下文提供器
 * @description i18n context provider with localStorage persistence
 *
 * Time O(1), Space O(1)
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { en, zh, type Dictionary } from '@/i18n';

export type Locale = 'en' | 'zh';

interface I18nContextValue {
    /** 当前语言 */
    locale: Locale;
    /** 翻译字典 */
    t: Dictionary;
    /** 切换语言 */
    toggleLocale: () => void;
}

const dictionaries: Record<Locale, Dictionary> = { en, zh };

const I18nContext = createContext<I18nContextValue>({
    locale: 'en',
    t: en,
    toggleLocale: () => { },
});

const STORAGE_KEY = 'portfolio-locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en');

    // 初始化：从 localStorage 读取
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (saved && (saved === 'en' || saved === 'zh')) {
            setLocale(saved);
        }
    }, []);

    const toggleLocale = useCallback(() => {
        setLocale((prev) => {
            const next = prev === 'en' ? 'zh' : 'en';
            localStorage.setItem(STORAGE_KEY, next);
            // 同步写入 cookie 供服务端读取，然后刷新页面加载对应语言内容
            document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=31536000`;
            // 刷新页面以让服务端组件读取新 locale
            window.location.reload();
            return next;
        });
    }, []);

    return (
        <I18nContext.Provider value={{ locale, t: dictionaries[locale], toggleLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

/** Hook：获取当前翻译 */
export function useI18n() {
    return useContext(I18nContext);
}
