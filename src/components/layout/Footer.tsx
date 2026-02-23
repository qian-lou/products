'use client';

/**
 * @fileoverview 页脚组件（支持 i18n）
 * @description Footer with copyright and credits, i18n-aware
 *
 * Time O(1), Space O(1)
 */

import { useI18n } from '@/components/providers/I18nProvider';

interface FooterProps {
  name?: string;
}

export function Footer({ name = 'Alex Rivera' }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="pt-10 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-[#A0A0A0] flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300">
      <p>{t.footer.rights(name)}</p>
      <p>{t.footer.builtWith}</p>
    </footer>
  );
}
