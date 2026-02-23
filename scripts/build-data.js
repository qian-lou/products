#!/usr/bin/env node
/**
 * @fileoverview 构建时数据生成脚本
 * @description Generate static data files for production build
 *
 * This script:
 * 1. Reads all content files
 * 2. Validates content
 * 3. Generates JSON data files for the frontend
 * 4. Creates sitemap.xml
 *
 * Time Complexity: O(n * m) where n = files, m = avg file size
 * Space Complexity: O(n) for content cache
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const contentDir = join(rootDir, 'content');
const outputDir = join(rootDir, 'public', 'data');

// 复制解析函数 (避免 ESM 导入问题)
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  if (!match) return [{}, content];
  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);
  return [parseSimpleYaml(frontmatterStr), body];
}

function parseSimpleYaml(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentArray = [];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const arrayMatch = line.match(/^\s*-\s*(.+)$/);
    if (arrayMatch) {
      if (currentKey) currentArray.push(parseValue(arrayMatch[1].trim()));
      continue;
    }
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      if (currentKey && currentArray.length > 0) {
        result[currentKey] = currentArray;
        currentArray = [];
      }
      const [, key, value] = kvMatch;
      currentKey = key;
      if (value.trim()) {
        result[key] = parseValue(value.trim());
        currentKey = null;
      }
    }
  }
  if (currentKey && currentArray.length > 0) result[currentKey] = currentArray;
  return result;
}

function parseValue(value) {
  const unquoted = value.replace(/^["']|["']$/g, '');
  if (unquoted.toLowerCase() === 'true') return true;
  if (unquoted.toLowerCase() === 'false') return false;
  if (/^-?\d+$/.test(unquoted)) return parseInt(unquoted, 10);
  if (/^-?\d+\.\d+$/.test(unquoted)) return parseFloat(unquoted);
  if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
    return unquoted.slice(1, -1).split(',').map(s => parseValue(s.trim().replace(/^["']|["']$/g, '')));
  }
  return unquoted;
}

// 简化的 Markdown 转 HTML
function markdownToHtml(md) {
  let html = md;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}

// 计算阅读时间
function calculateReadingTime(content) {
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  return Math.max(1, Math.ceil((chineseChars + englishWords) / 250));
}

// 确保输出目录存在
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// 收集所有作品
function collectWorks() {
  const works = [];
  const worksDir = join(contentDir, 'works');

  if (!existsSync(worksDir)) return works;

  const files = readdirSync(worksDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  for (const file of files) {
    const filePath = join(worksDir, file);
    const rawContent = readFileSync(filePath, 'utf-8');
    const [fm, body] = extractFrontmatter(rawContent);

    // 跳过未发布
    if (fm.published === false) continue;

    const work = {
      title: String(fm.title || ''),
      slug: String(fm.slug || file.replace(/\.(md|mdx)$/, '')),
      date: String(fm.date || new Date().toISOString().split('T')[0]),
      excerpt: String(fm.excerpt || ''),
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      cover: fm.cover ? String(fm.cover) : undefined,
      demo: fm.demo ? String(fm.demo) : undefined,
      github: fm.github ? String(fm.github) : undefined,
      featured: Boolean(fm.featured),
      published: fm.published !== false,
      order: typeof fm.order === 'number' ? fm.order : undefined,
      content: markdownToHtml(body),
      rawContent: body,
      filePath: file,
      readingTime: calculateReadingTime(body),
    };

    works.push(work);
  }

  // 排序
  return works.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return b.order - a.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date) - new Date(a.date);
  });
}

// 生成作品列表数据（不含完整内容）
function generateWorkList(works) {
  return works.map(w => ({
    title: w.title,
    slug: w.slug,
    date: w.date,
    excerpt: w.excerpt,
    tags: w.tags,
    cover: w.cover,
    featured: w.featured,
    readingTime: w.readingTime,
  }));
}

// 生成 sitemap.xml
function generateSitemap(works, config) {
  const baseUrl = config.seo?.url || 'https://example.com';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: baseUrl, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${baseUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
    ...works.map(w => ({
      loc: `${baseUrl}/works/${w.slug}`,
      lastmod: w.date,
      changefreq: 'monthly',
      priority: '0.9',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  return xml;
}

// 生成 robots.txt
function generateRobotsTxt(config) {
  const baseUrl = config.seo?.url || 'https://example.com';
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

// 主函数
function main() {
  console.log('\n▶ Building static data...\n');

  ensureDir(outputDir);

  // 1. 收集作品
  console.log('  📚 Collecting works...');
  const works = collectWorks();
  console.log(`     Found ${works.length} works`);

  // 2. 生成作品列表
  console.log('  📋 Generating work list...');
  const workList = generateWorkList(works);
  writeFileSync(join(outputDir, 'works.json'), JSON.stringify(workList, null, 2));

  // 3. 生成单个作品数据
  console.log('  📄 Generating individual work data...');
  const worksDetailDir = join(outputDir, 'works');
  ensureDir(worksDetailDir);
  for (const work of works) {
    writeFileSync(join(worksDetailDir, `${work.slug}.json`), JSON.stringify(work, null, 2));
  }

  // 4. 读取并复制配置
  console.log('  ⚙️  Processing config...');
  let config = {};
  const configPath = join(contentDir, 'config.json');
  if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
    writeFileSync(join(outputDir, 'config.json'), JSON.stringify(config, null, 2));
  }

  // 5. 读取并复制 profile
  console.log('  👤 Processing profile...');
  const profilePath = join(contentDir, 'profile', 'index.json');
  if (existsSync(profilePath)) {
    const profile = JSON.parse(readFileSync(profilePath, 'utf-8'));
    writeFileSync(join(outputDir, 'profile.json'), JSON.stringify(profile, null, 2));
  }

  // 6. 生成标签索引
  console.log('  🏷️  Generating tag index...');
  const tagMap = {};
  for (const work of works) {
    for (const tag of work.tags) {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(work.slug);
    }
  }
  writeFileSync(join(outputDir, 'tags.json'), JSON.stringify(tagMap, null, 2));

  // 7. 生成 sitemap
  console.log('  🗺️  Generating sitemap...');
  const sitemap = generateSitemap(works, config);
  writeFileSync(join(rootDir, 'public', 'sitemap.xml'), sitemap);

  // 8. 生成 robots.txt
  console.log('  🤖 Generating robots.txt...');
  const robots = generateRobotsTxt(config);
  writeFileSync(join(rootDir, 'public', 'robots.txt'), robots);

  console.log('\n✓ Build complete!\n');
  console.log(`Output files:
  - public/data/works.json      (${workList.length} works)
  - public/data/works/*.json    (individual work data)
  - public/data/config.json     (site config)
  - public/data/profile.json    (profile data)
  - public/data/tags.json       (${Object.keys(tagMap).length} tags)
  - public/sitemap.xml
  - public/robots.txt
`);
}

main();
