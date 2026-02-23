/**
 * @fileoverview 类型定义文件 - 静态作品集网站数据层
 * @description Define all TypeScript types for content management
 *
 * Time Complexity: O(1) for type definitions
 * Space Complexity: O(1) - compile-time only
 */

// ============================================================
// Work (作品) 相关类型
// ============================================================

/**
 * 作品 Frontmatter 元数据
 * @description 从 Markdown 文件的 YAML frontmatter 中提取
 */
export interface WorkFrontmatter {
  /** 作品标题 - 必填 */
  title: string;
  /** URL 标识符 - 必填，用于生成路由 */
  slug: string;
  /** 发布日期 - 必填，ISO 8601 格式 */
  date: string;
  /** 简短描述 - 必填，用于列表页和 SEO */
  excerpt: string;
  /** 标签列表 - 必填 */
  tags: ReadonlyArray<string>;
  /** 封面图片路径 - 可选 */
  cover?: string;
  /** 在线演示链接 - 可选 */
  demo?: string;
  /** GitHub 仓库链接 - 可选 */
  github?: string;
  /** 是否精选 - 可选，默认 false */
  featured?: boolean;
  /** 是否发布 - 可选，默认 true */
  published?: boolean;
  /** 自定义排序权重 - 可选，数值越大越靠前 */
  order?: number;
}

/**
 * 完整的作品数据结构
 * @description 包含 frontmatter 元数据和解析后的 HTML 内容
 */
export interface Work extends WorkFrontmatter {
  /** 解析后的 HTML 内容 */
  content: string;
  /** 原始 Markdown 内容 */
  rawContent: string;
  /** 文件相对于 content/works 的路径 */
  filePath: string;
  /** 估算阅读时间（分钟） */
  readingTime: number;
}

/**
 * 作品列表项（不含完整内容）
 * @description 用于列表页展示，减少数据量
 */
export interface WorkListItem {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: ReadonlyArray<string>;
  cover?: string;
  featured: boolean;
  readingTime: number;
}

// ============================================================
// Profile (个人信息) 相关类型
// ============================================================

/**
 * 个人技能
 */
export interface Skill {
  /** 技能名称 */
  name: string;
  /** 技能分类 */
  category?: 'frontend' | 'backend' | 'design' | 'tools' | 'other';
}

/**
 * 社交链接
 */
export interface SocialLink {
  /** 平台名称 */
  platform: 'github' | 'email' | 'linkedin' | 'twitter' | 'website' | 'other';
  /** 显示名称 */
  label: string;
  /** 链接地址 */
  url: string;
  /** 图标名称 (Lucide icon) */
  icon?: string;
}

/**
 * 个人信息配置
 * @description 从 content/profile/index.json 读取
 */
export interface Profile {
  /** 姓名 */
  name: string;
  /** 职业头衔 */
  title: string;
  /** 简短自我介绍 */
  bio: string;
  /** 头像路径 */
  avatar?: string;
  /** 技能列表 */
  skills: ReadonlyArray<Skill>;
  /** 社交链接 */
  socials: ReadonlyArray<SocialLink>;
  /** 所在地 */
  location?: string;
  /** 电子邮箱 */
  email?: string;
  /** 个人简历下载链接 */
  resume?: string;
  /** 工作状态 */
  availability?: string;
  /** 工作年限 */
  yearsOfExperience?: number;
  /** 项目数量 */
  projects?: string;
  /** 客户数量 */
  clients?: number;
  /** 时区 */
  timezone?: string;
  /** 个人网站 */
  website?: string;
}

// ============================================================
// 站点配置相关类型
// ============================================================

/**
 * SEO 元数据
 */
export interface SEOConfig {
  /** 站点标题 */
  title: string;
  /** 站点描述 */
  description: string;
  /** 站点 URL */
  url: string;
  /** Open Graph 图片 */
  ogImage?: string;
  /** Twitter 账号 */
  twitterHandle?: string;
  /** 语言 */
  language: string;
}

/**
 * 站点配置
 * @description 从 content/config.json 读取
 */
export interface SiteConfig {
  /** SEO 配置 */
  seo: SEOConfig;
  /** 导航菜单 */
  navigation: ReadonlyArray<{
    label: string;
    href: string;
  }>;
  /** 功能开关 */
  features: {
    /** 启用暗色模式 */
    darkMode: boolean;
    /** 启用 Google Analytics */
    analytics: boolean;
    /** Google Analytics ID */
    gaId?: string;
  };
}

// ============================================================
// 构建时数据类型
// ============================================================

/**
 * 静态生成时的页面数据
 */
export interface StaticProps {
  /** 作品列表（按排序规则排列） */
  works: ReadonlyArray<WorkListItem>;
  /** 个人信息 */
  profile: Profile;
  /** 站点配置 */
  config: SiteConfig;
}

/**
 * 作品详情页数据
 */
export interface WorkStaticProps {
  work: Work;
  profile: Profile;
  config: SiteConfig;
  /** 相关作品推荐 */
  relatedWorks: ReadonlyArray<WorkListItem>;
}

/**
 * 标签页数据
 */
export interface TagStaticProps {
  tag: string;
  works: ReadonlyArray<WorkListItem>;
  profile: Profile;
  config: SiteConfig;
}

// ============================================================
// 验证相关类型
// ============================================================

/**
 * 验证错误
 */
export interface ValidationError {
  /** 文件路径 */
  file: string;
  /** 字段名 */
  field: string;
  /** 错误消息 */
  message: string;
  /** 错误级别 */
  level: 'error' | 'warning';
}

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否通过验证 */
  valid: boolean;
  /** 错误列表 */
  errors: ReadonlyArray<ValidationError>;
  /** 警告数量 */
  warningCount: number;
  /** 错误数量 */
  errorCount: number;
}

// ============================================================
// 工具类型
// ============================================================

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * 必填字段提取
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Frontmatter 必填字段
 */
export type RequiredFrontmatter = RequiredFields<
  WorkFrontmatter,
  'title' | 'slug' | 'date' | 'excerpt' | 'tags'
>;
