'use client';

/**
 * @fileoverview 详情页标签组件（支持 i18n）
 * @description Client components for i18n labels on the work detail page
 *
 * Time O(1), Space O(1)
 */

import { useI18n } from '@/components/providers/I18nProvider';

/** 返回按钮文本 */
export function BackLabel() {
    const { t } = useI18n();
    return <span className="text-sm font-medium">{t.detail.back}</span>;
}

/** Live Demo 按钮文本 */
export function DemoLabel() {
    const { t } = useI18n();
    return <>{t.detail.liveDemo}</>;
}

/** Source 按钮文本 */
export function SourceLabel() {
    const { t } = useI18n();
    return <>{t.detail.source}</>;
}

/** 阅读时间 */
export function ReadingTime({ minutes }: { minutes: number }) {
    const { t } = useI18n();
    return <span>{t.detail.minRead(minutes)}</span>;
}
