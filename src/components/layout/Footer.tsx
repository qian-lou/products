/**
 * @fileoverview 页脚组件
 * @description Footer with copyright and credits
 *
 * Time O(1), Space O(1)
 */

interface FooterProps {
  name?: string;
}

export function Footer({ name = 'Alex Rivera' }: FooterProps) {
  return (
    <footer className="pt-10 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-[#A0A0A0] flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300">
      <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
      <p>Designed in Figma, built with Next.js & Tailwind.</p>
    </footer>
  );
}
