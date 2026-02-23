'use client';

/**
 * @fileoverview 主页标题组件（支持 i18n）
 * @description Homepage section header with i18n support
 *
 * Time O(1), Space O(1)
 */

import { useI18n } from '@/components/providers/I18nProvider';

interface HomeHeaderProps {
    workCount: number;
}

export function HomeHeader({ workCount }: HomeHeaderProps) {
    const { t } = useI18n();

    return (
        <div className="mb-8 lg:mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {t.home.selectedWorks}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                {t.home.projectCount(workCount)}
            </p>
        </div>
    );
}
