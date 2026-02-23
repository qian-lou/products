/**
 * @fileoverview 国际化字典类型定义和英文翻译
 * @description i18n dictionary type definitions and English translations
 */

export interface Dictionary {
    // 侧边栏标签
    sidebar: {
        location: string;
        works: string;
        coreFocus: string;
        highlights: string;
        experience: string;
        projects: string;
        clients: string;
        timezone: string;
        contact: string;
        email: string;
        website: string;
        base: string;
        availability: string;
    };
    // 主页
    home: {
        selectedWorks: string;
        projectCount: (n: number) => string;
    };
    // 详情页
    detail: {
        back: string;
        liveDemo: string;
        source: string;
        minRead: (n: number) => string;
    };
    // 页脚
    footer: {
        rights: (name: string) => string;
        builtWith: string;
    };
    // 通用
    common: {
        noWorks: string;
    };
}

export const en: Dictionary = {
    sidebar: {
        location: 'Location',
        works: 'Works',
        coreFocus: 'Core Focus',
        highlights: 'Highlights',
        experience: 'Experience',
        projects: 'Projects',
        clients: 'Clients',
        timezone: 'Timezone',
        contact: 'Contact',
        email: 'Email',
        website: 'Website',
        base: 'Base',
        availability: 'Availability',
    },
    home: {
        selectedWorks: 'Selected Works',
        projectCount: (n) => `${n} projects`,
    },
    detail: {
        back: 'Back',
        liveDemo: 'Live Demo',
        source: 'Source',
        minRead: (n) => `${n} min read`,
    },
    footer: {
        rights: (name) => `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
        builtWith: 'Designed in Figma, built with Next.js & Tailwind.',
    },
    common: {
        noWorks: 'No works found.',
    },
};
