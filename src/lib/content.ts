/**
 * @fileoverview 内容管理核心模块
 * @description Content loading and management for static site generation
 *
 * Time Complexity:
 * - getWorks: O(n log n) for sorting
 * - getWorkBySlug: O(n) for search
 * Space Complexity: O(n) for content cache
 */

import type {
  Work,
  WorkListItem,
  Profile,
  SiteConfig,
  ValidationError,
  ValidationResult,
} from '@/types';
import {
  extractFrontmatter,
  markdownToHtml,
  calculateReadingTime,
  validateFrontmatter,
  applyFrontmatterDefaults,
  toListItem,
} from './markdown';

// ============================================================
// 内容加载 (构建时使用)
// ============================================================

// 注意：这些函数在构建时由 Node.js 执行
// 使用动态 import() 来兼容浏览器环境

/**
 * 获取所有作品
 * @description 在构建时读取 content/works 目录下的所有 Markdown 文件
 * @param contentDir - 内容目录路径
 * @returns 作品列表（已排序）
 *
 * Time Complexity: O(n * m + n log n)
 * - n: 作品数量
 * - m: 平均文件大小
 * - n log n: 排序
 * Space Complexity: O(n * m) 存储所有内容
 */
export async function getWorks(contentDir: string): Promise<Work[]> {
  // 只在 Node.js 环境执行
  if (typeof window !== 'undefined') {
    console.warn('getWorks should only be called at build time');
    return [];
  }

  const fs = await import('fs');
  const path = await import('path');

  const worksDir = path.join(contentDir, 'works');

  // 检查目录是否存在
  if (!fs.existsSync(worksDir)) {
    console.warn(`Works directory not found: ${worksDir}`);
    return [];
  }

  // 读取所有 .md 文件
  const files = fs
    .readdirSync(worksDir)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

  const works: Work[] = [];

  for (const file of files) {
    const filePath = path.join(worksDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const work = parseWorkFile(rawContent, file);

    // 只包含已发布的作品
    if (work.published) {
      works.push(work);
    }
  }

  // 排序：精选优先，然后按日期降序
  return sortWorks(works);
}

/**
 * 根据 slug 获取作品
 * @param slug - 作品 slug
 * @param contentDir - 内容目录路径
 * @returns 作品对象或 null
 */
export async function getWorkBySlug(
  slug: string,
  contentDir: string
): Promise<Work | null> {
  const works = await getWorks(contentDir);
  return works.find((w) => w.slug === slug) || null;
}

/**
 * 获取作品列表（不含完整内容）
 * @param contentDir - 内容目录路径
 * @returns 作品列表项数组
 */
export async function getWorkList(contentDir: string): Promise<WorkListItem[]> {
  const works = await getWorks(contentDir);
  return works.map(toListItem);
}

/**
 * 获取所有标签
 * @param contentDir - 内容目录路径
 * @returns 标签列表（去重）
 */
export async function getAllTags(
  contentDir: string
): Promise<string[]> {
  const works = await getWorks(contentDir);
  const tagSet = new Set<string>();

  for (const work of works) {
    for (const tag of work.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * 根据标签获取作品
 * @param tag - 标签名
 * @param contentDir - 内容目录路径
 * @returns 包含该标签的作品列表
 */
export async function getWorksByTag(
  tag: string,
  contentDir: string
): Promise<WorkListItem[]> {
  const works = await getWorks(contentDir);
  return works
    .filter((w) => w.tags.includes(tag))
    .map(toListItem);
}

// ============================================================
// Profile 加载
// ============================================================

/**
 * 获取个人信息
 * @param contentDir - 内容目录路径
 * @returns 个人信息对象
 */
export async function getProfile(contentDir: string): Promise<Profile> {
  if (typeof window !== 'undefined') {
    return getDefaultProfile();
  }

  const fs = await import('fs');
  const path = await import('path');

  const profilePath = path.join(contentDir, 'profile', 'index.json');

  if (!fs.existsSync(profilePath)) {
    console.warn(`Profile file not found: ${profilePath}`);
    return getDefaultProfile();
  }

  try {
    const content = fs.readFileSync(profilePath, 'utf-8');
    return JSON.parse(content) as Profile;
  } catch (error) {
    console.error('Failed to parse profile:', error);
    return getDefaultProfile();
  }
}

/**
 * 获取站点配置
 * @param contentDir - 内容目录路径
 * @returns 站点配置对象
 */
export async function getSiteConfig(
  contentDir: string
): Promise<SiteConfig> {
  if (typeof window !== 'undefined') {
    return getDefaultConfig();
  }

  const fs = await import('fs');
  const path = await import('path');

  const configPath = path.join(contentDir, 'config.json');

  if (!fs.existsSync(configPath)) {
    console.warn(`Config file not found: ${configPath}`);
    return getDefaultConfig();
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as SiteConfig;
  } catch (error) {
    console.error('Failed to parse config:', error);
    return getDefaultConfig();
  }
}

// ============================================================
// 内容验证
// ============================================================

/**
 * 验证所有内容
 * @param contentDir - 内容目录路径
 * @returns 验证结果
 */
export async function validateContent(
  contentDir: string
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  if (typeof window !== 'undefined') {
    return { valid: true, errors: [], warningCount: 0, errorCount: 0 };
  }

  const fs = await import('fs');
  const path = await import('path');

  // 验证作品
  const worksDir = path.join(contentDir, 'works');
  if (fs.existsSync(worksDir)) {
    const files = fs
      .readdirSync(worksDir)
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(worksDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileErrors = validateWorkFile(content, file);
      errors.push(...fileErrors);
    }
  }

  // 验证 profile
  const profilePath = path.join(contentDir, 'profile', 'index.json');
  if (fs.existsSync(profilePath)) {
    try {
      const content = fs.readFileSync(profilePath, 'utf-8');
      JSON.parse(content);
    } catch {
      errors.push({
        file: 'profile/index.json',
        field: 'json',
        message: 'Invalid JSON format',
        level: 'error',
      });
    }
  }

  // 验证 config
  const configPath = path.join(contentDir, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      JSON.parse(content);
    } catch {
      errors.push({
        file: 'config.json',
        field: 'json',
        message: 'Invalid JSON format',
        level: 'error',
      });
    }
  }

  const errorCount = errors.filter((e) => e.level === 'error').length;
  const warningCount = errors.filter((e) => e.level === 'warning').length;

  return {
    valid: errorCount === 0,
    errors,
    errorCount,
    warningCount,
  };
}

// ============================================================
// 辅助函数
// ============================================================

/**
 * 解析作品文件
 */
function parseWorkFile(rawContent: string, fileName: string): Work {
  const [fm, body] = extractFrontmatter(rawContent);
  const [valid, missing] = validateFrontmatter(fm);

  if (!valid) {
    console.warn(`Missing required fields in ${fileName}:`, missing);
  }

  const frontmatter = applyFrontmatterDefaults(fm);
  const htmlContent = markdownToHtml(body);
  const readingTime = calculateReadingTime(body);

  return {
    ...frontmatter,
    content: htmlContent,
    rawContent: body,
    filePath: fileName,
    readingTime,
  };
}

/**
 * 验证作品文件
 */
function validateWorkFile(
  content: string,
  fileName: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  const [fm, body] = extractFrontmatter(content);

  // 检查必填字段
  const [valid, missing] = validateFrontmatter(fm);
  if (!valid) {
    for (const field of missing) {
      errors.push({
        file: fileName,
        field,
        message: `Required field "${field}" is missing or empty`,
        level: 'error',
      });
    }
  }

  // 检查日期格式
  if (fm.date && typeof fm.date === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fm.date)) {
      errors.push({
        file: fileName,
        field: 'date',
        message: 'Date should be in YYYY-MM-DD format',
        level: 'warning',
      });
    }
  }

  // 检查内容长度
  if (body.trim().length < 50) {
    errors.push({
      file: fileName,
      field: 'content',
      message: 'Content is too short (less than 50 characters)',
      level: 'warning',
    });
  }

  return errors;
}

/**
 * 作品排序
 */
function sortWorks(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    // 1. order 字段优先
    if (a.order !== undefined && b.order !== undefined) {
      return b.order - a.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;

    // 2. 精选优先
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    // 3. 按日期降序
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * 默认个人信息
 */
function getDefaultProfile(): Profile {
  return {
    name: 'Your Name',
    title: 'Developer / Designer',
    bio: 'A passionate developer creating beautiful and functional web experiences.',
    skills: [{ name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'React' }],
    socials: [],
  };
}

/**
 * 默认站点配置
 */
function getDefaultConfig(): SiteConfig {
  return {
    seo: {
      title: 'My Portfolio',
      description: 'A personal portfolio website',
      url: 'https://example.com',
      language: 'en',
    },
    navigation: [
      { label: 'Works', href: '/' },
      { label: 'About', href: '/about' },
    ],
    features: {
      darkMode: true,
      analytics: false,
    },
  };
}
