/**
 * @fileoverview 中文翻译
 * @description Chinese translations for i18n
 */

import type { Dictionary } from './en';

export const zh: Dictionary = {
    sidebar: {
        location: '所在地',
        works: '作品',
        coreFocus: '核心技能',
        highlights: '亮点',
        experience: '经验',
        projects: '项目',
        clients: '客户',
        timezone: '时区',
        contact: '联系方式',
        email: '邮箱',
        website: '网站',
        base: '基地',
        availability: '状态',
    },
    home: {
        selectedWorks: '精选作品',
        projectCount: (n) => `共 ${n} 个项目`,
    },
    detail: {
        back: '返回',
        liveDemo: '在线演示',
        source: '源码',
        minRead: (n) => `${n} 分钟阅读`,
    },
    footer: {
        rights: (name) => `© ${new Date().getFullYear()} ${name}. 保留所有权利。`,
        builtWith: '使用 Figma 设计，基于 Next.js 和 Tailwind 构建。',
    },
    common: {
        noWorks: '暂无作品。',
    },
};
