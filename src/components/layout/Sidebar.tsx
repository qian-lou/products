'use client';

/**
 * @fileoverview 侧边栏组件
 * @description 左侧个人信息栏，包含头像、简介、技能、社交链接
 *
 * Time O(1), Space O(1) per render
 */

import { Mail, Github, Linkedin, Twitter, Dribbble, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';

// 记录本页面的 SPA 会话期间是否已经播放过动画，用于替代 sessionStorage 避免 hydration mismatch
let hasAnimatedInSession = false;

// 侧边栏交错动画变体
const sidebarContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const sidebarItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LangToggle } from '@/components/ui/LangToggle';
import { useI18n } from '@/components/providers/I18nProvider';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

// Lucide 图标映射
const iconMap = {
  github: Github,
  email: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
  website: Mail,
  other: Mail,
};

interface SidebarProps {
  profile: Profile;
  /** 仅渲染移动端部分（桌面端由 ResizableLayout 控制） */
  mobileOnly?: boolean;
  /** 禁用入场动画（用于详情页等不需要重新播放动画的场景） */
  disableAnimation?: boolean;
}

export function Sidebar({ profile, mobileOnly, disableAnimation }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  // 侧边栏动画仅在首次访问时播放，后续导航（SPA内部路由）跳过
  // 使用模块级变量确保首屏渲染 (Hydration) 与 SSR 结果一致，避免使用 sessionStorage 导致 hydration mismatch
  const shouldSkipAnimation = (() => {
    if (disableAnimation) return true;
    if (typeof window === 'undefined') return false;

    if (!hasAnimatedInSession) {
      hasAnimatedInSession = true;
      return false;
    }
    return true;
  })();

  return (
    <>
      {/* 移动端顶部导航栏 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-bold text-lg text-slate-900 dark:text-white">
            {profile.name}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单遮罩 */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* 移动端侧边菜单 */}
      <div
        className={cn(
          'lg:hidden fixed top-[65px] left-0 right-0 z-40 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 transition-transform duration-300',
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="p-6 space-y-6">
          {/* 简介 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              {profile.title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* 技能 */}
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill.name}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* 联系按钮 */}
          <a
            href={`mailto:${profile.email || 'hello@example.com'}`}
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium text-sm transition-colors"
          >
            <Mail className="mr-2" size={18} />
            Contact Me
          </a>

          {/* 社交链接 */}
          <div className="flex items-center gap-4 pt-2">
            {profile.socials.map((social) => {
              const Icon = iconMap[social.platform] || Mail;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 桌面端侧边栏 — mobileOnly 模式下跳过 */}
      {!mobileOnly && (
        <header className="hidden lg:flex w-full h-screen flex-col justify-between p-8 xl:p-10 overflow-y-auto bg-transparent transition-colors duration-300 no-scrollbar">
          {/* ═══ 主内容区 ═══ */}
          <motion.div
            className="flex flex-col gap-5"
            variants={sidebarContainer}
            initial={shouldSkipAnimation ? false : 'hidden'}
            animate="visible"
          >
            {/* 头像 + 姓名（横排） */}
            <motion.div variants={sidebarItem} className="flex items-center gap-3">
              {profile.avatar && (
                <div
                  className="h-12 w-12 rounded-full bg-cover bg-center border border-slate-200 dark:border-white/10 shrink-0"
                  style={{ backgroundImage: `url('${profile.avatar}')` }}
                />
              )}
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {profile.title}
                </h2>
              </div>
            </motion.div>

            {/* 简介 */}
            <motion.p variants={sidebarItem} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {profile.bio}
            </motion.p>

            {/* 信息网格：Location + Works */}
            <motion.div variants={sidebarItem} className="grid grid-cols-2 gap-2">
              {profile.location && (
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.location}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.location.split(',')[0]}
                  </span>
                </div>
              )}
              <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                  {t.sidebar.works}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {profile.projects || '—'}
                </span>
              </div>
            </motion.div>

            {/* Core Focus 标签 */}
            <motion.div variants={sidebarItem} className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
                {t.sidebar.coreFocus}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Highlights 2x2 网格 */}
            <motion.div variants={sidebarItem} className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
                {t.sidebar.highlights}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.experience}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.yearsOfExperience ? `${profile.yearsOfExperience} Years` : '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.projects}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.projects || '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.clients}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.clients || '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.timezone}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.timezone || '—'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact 2x2 网格 */}
            <motion.div variants={sidebarItem} className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
                {t.sidebar.contact}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.email}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white break-all">
                    {profile.email || '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.website}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {profile.website || '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.base}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {profile.location || '—'}
                  </span>
                </div>
                <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.02)] px-3 py-2.5">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    {t.sidebar.availability}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {profile.availability || '—'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══ 底部锚定区：主题切换 + 社交链接 ═══ */}
          <div className="flex items-center justify-between pt-6 mt-auto">
            <div className="flex items-center gap-4">
              {profile.socials.map((social) => {
                const Icon = iconMap[social.platform] || Mail;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
    </>
  );
}
