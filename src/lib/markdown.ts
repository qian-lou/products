/**
 * @fileoverview Markdown 解析核心模块
 * @description Parse Markdown files with frontmatter support
 *
 * Time Complexity:
 * - parseMarkdown: O(n) where n is content length
 * - extractFrontmatter: O(n) where n is content length
 * Space Complexity: O(n) for parsed content storage
 */

import type { WorkFrontmatter, Work, WorkListItem } from '@/types';

// ============================================================
// Frontmatter 解析
// ============================================================

/**
 * 从 Markdown 内容中提取 frontmatter
 * @param content - 原始 Markdown 内容
 * @returns [frontmatter 对象, 去除 frontmatter 后的内容]
 *
 * @example
 * const [fm, body] = extractFrontmatter(markdownContent);
 */
export function extractFrontmatter(
  content: string
): [Record<string, unknown>, string] {
  // 匹配 --- 包裹的 frontmatter 块
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return [{}, content];
  }

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);

  // 简单 YAML 解析（不依赖第三方库）
  const frontmatter = parseSimpleYaml(frontmatterStr);

  return [frontmatter, body];
}

/**
 * 简单 YAML 解析器
 * @description 支持 key: value 和数组格式，满足 frontmatter 需求
 * @param yaml - YAML 字符串
 * @returns 解析后的对象
 *
 * Time Complexity: O(n) where n is number of lines
 * Space Complexity: O(m) where m is number of keys
 */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let currentKey: string | null = null;
  let currentArray: unknown[] = [];

  for (const line of lines) {
    // 跳过空行和注释
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    // 检测数组项（以 - 开头）
    const arrayMatch = line.match(/^\s*-\s*(.+)$/);
    if (arrayMatch) {
      if (currentKey) {
        currentArray.push(parseValue(arrayMatch[1].trim()));
      }
      continue;
    }

    // 检测键值对
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      // 保存之前的数组
      if (currentKey && currentArray.length > 0) {
        result[currentKey] = currentArray;
        currentArray = [];
      }

      const [, key, value] = kvMatch;
      currentKey = key;

      if (value.trim()) {
        // 有内联值
        result[key] = parseValue(value.trim());
        currentKey = null;
      }
      // 无值，可能是数组或对象
    }
  }

  // 处理最后的数组
  if (currentKey && currentArray.length > 0) {
    result[currentKey] = currentArray;
  }

  return result;
}

/**
 * 解析 YAML 值
 * @param value - 原始值字符串
 * @returns 解析后的值
 */
function parseValue(value: string): unknown {
  // 去除引号
  const unquoted = value.replace(/^["']|["']$/g, '');

  // 布尔值
  if (unquoted.toLowerCase() === 'true') return true;
  if (unquoted.toLowerCase() === 'false') return false;

  // 数字
  if (/^-?\d+$/.test(unquoted)) return parseInt(unquoted, 10);
  if (/^-?\d+\.\d+$/.test(unquoted)) return parseFloat(unquoted);

  // 数组（简单格式：[a, b, c]）
  if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
    const inner = unquoted.slice(1, -1);
    return inner
      .split(',')
      .map((s) => parseValue(s.trim().replace(/^["']|["']$/g, '')));
  }

  return unquoted;
}

// ============================================================
// Markdown 渲染
// ============================================================

/**
 * 将 Markdown 转换为 HTML
 * @description 轻量级 Markdown 解析器，支持常用语法
 * @param markdown - Markdown 文本
 * @returns HTML 字符串
 *
 * Time Complexity: O(n) where n is markdown length
 * Space Complexity: O(n) for output HTML
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 1. 处理代码块（必须先处理，避免内部被其他规则影响）
  html = processCodeBlocks(html);

  // 2. 处理标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 3. 处理水平线
  html = html.replace(/^---$/gm, '<hr />');

  // 4. 处理图片
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" />'
  );

  // 5. 处理链接
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // 6. 处理粗体和斜体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // 7. 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 8. 处理列表
  html = processLists(html);

  // 9. 处理段落（连续的非标签行包裹在 <p> 中）
  html = processParagraphs(html);

  return html;
}

/**
 * 处理代码块
 * @description 转换 ``` 包裹的代码块为 HTML
 */
function processCodeBlocks(html: string): string {
  return html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang: string, code: string) => {
      const escaped = escapeHtml(code.trim());
      const langClass = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${langClass}>${escaped}</code></pre>`;
    }
  );
}

/**
 * 处理列表
 * @description 转换 Markdown 列表为 HTML
 */
function processLists(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);

    if (ulMatch || olMatch) {
      const content = ulMatch ? ulMatch[2] : olMatch![2];
      const tag = ulMatch ? 'ul' : 'ol';

      if (!inList) {
        result.push(`<${tag}>`);
        inList = true;
      }
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }

  // 关闭未闭合的列表
  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

/**
 * 处理段落
 * @description 将连续的文本行包装成 <p> 标签
 */
function processParagraphs(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  let paragraph: string[] = [];

  const blockElements = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'pre', 'code', 'hr',
    'img', 'div', 'p', 'blockquote',
  ]);

  const isOpeningTag = (line: string) =>
    /^<(h[1-6]|ul|ol|pre|hr|blockquote|div|p)/.test(line);

  const isBlockElement = (line: string) => {
    const match = line.match(/^<\/?(\w+)/);
    return match && blockElements.has(match[1]);
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      // 空行结束当前段落
      if (paragraph.length > 0) {
        result.push(`<p>${paragraph.join(' ')}</p>`);
        paragraph = [];
      }
      continue;
    }

    if (isBlockElement(trimmed)) {
      // 块级元素结束当前段落
      if (paragraph.length > 0) {
        result.push(`<p>${paragraph.join(' ')}</p>`);
        paragraph = [];
      }
      result.push(trimmed);
      continue;
    }

    // 累积段落内容
    paragraph.push(trimmed);
  }

  // 处理最后的段落
  if (paragraph.length > 0) {
    result.push(`<p>${paragraph.join(' ')}</p>`);
  }

  return result.join('\n');
}

/**
 * HTML 转义
 */
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => escapeMap[char]);
}

// ============================================================
// 内容处理工具
// ============================================================

/**
 * 计算阅读时间（分钟）
 * @param content - 文本内容
 * @param wpm - 每分钟阅读字数（默认 200 中文/300 英文）
 * @returns 阅读时间（分钟，向上取整）
 *
 * Time Complexity: O(n) where n is content length
 */
export function calculateReadingTime(content: string, wpm = 250): number {
  // 统计中文字符
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 统计英文单词
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  // 总字数（中文按1字计，英文按单词计）
  const totalWords = chineseChars + englishWords;

  return Math.max(1, Math.ceil(totalWords / wpm));
}

/**
 * 生成 slug
 * @param title - 标题
 * @returns URL 友好的 slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 验证 frontmatter 必填字段
 * @param fm - frontmatter 对象
 * @returns [是否有效, 缺失字段列表]
 */
export function validateFrontmatter(
  fm: Record<string, unknown>
): [boolean, string[]] {
  const requiredFields: (keyof WorkFrontmatter)[] = [
    'title',
    'slug',
    'date',
    'excerpt',
    'tags',
  ];

  const missing = requiredFields.filter((field) => {
    const value = fm[field];
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && !value.trim()) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  });

  return [missing.length === 0, missing];
}

/**
 * 应用 frontmatter 默认值
 * @param fm - 原始 frontmatter
 * @returns 补全默认值后的 frontmatter
 */
export function applyFrontmatterDefaults(
  fm: Record<string, unknown>
): WorkFrontmatter {
  return {
    title: String(fm.title ?? ''),
    slug: String(fm.slug ?? ''),
    date: String(fm.date ?? new Date().toISOString().split('T')[0]),
    excerpt: String(fm.excerpt ?? ''),
    tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
    cover: fm.cover ? String(fm.cover) : undefined,
    demo: fm.demo ? String(fm.demo) : undefined,
    github: fm.github ? String(fm.github) : undefined,
    featured: Boolean(fm.featured),
    published: fm.published !== false,
    order: typeof fm.order === 'number' ? fm.order : undefined,
  };
}

/**
 * 将 Work 转换为 WorkListItem
 * @param work - 完整作品对象
 * @returns 列表项对象
 */
export function toListItem(work: Work): WorkListItem {
  return {
    title: work.title,
    slug: work.slug,
    date: work.date,
    excerpt: work.excerpt,
    tags: work.tags,
    cover: work.cover,
    featured: work.featured ?? false,
    readingTime: work.readingTime,
  };
}
