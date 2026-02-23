#!/usr/bin/env node
/**
 * @fileoverview 内容验证脚本
 * @description Validate all content files before build
 *
 * Usage:
 *   node scripts/validate-content.js
 *   node scripts/validate-content.js --fix
 *
 * Time Complexity: O(n * m) where n = files, m = avg file size
 * Space Complexity: O(n) for error collection
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const contentDir = join(rootDir, 'content');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// ============================================================
// 解析函数 (从 lib/markdown.ts 复制，避免构建依赖)
// ============================================================

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return [{}, content];
  }

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = parseSimpleYaml(frontmatterStr);

  return [frontmatter, body];
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
      if (currentKey) {
        currentArray.push(parseValue(arrayMatch[1].trim()));
      }
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

  if (currentKey && currentArray.length > 0) {
    result[currentKey] = currentArray;
  }

  return result;
}

function parseValue(value) {
  const unquoted = value.replace(/^["']|["']$/g, '');

  if (unquoted.toLowerCase() === 'true') return true;
  if (unquoted.toLowerCase() === 'false') return false;
  if (/^-?\d+$/.test(unquoted)) return parseInt(unquoted, 10);
  if (/^-?\d+\.\d+$/.test(unquoted)) return parseFloat(unquoted);

  if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
    const inner = unquoted.slice(1, -1);
    return inner.split(',').map(s => parseValue(s.trim().replace(/^["']|["']$/g, '')));
  }

  return unquoted;
}

// ============================================================
// 验证逻辑
// ============================================================

const errors = [];
const warnings = [];

function log(type, file, field, message) {
  const entry = { file, field, message };
  if (type === 'error') {
    errors.push(entry);
    console.log(`${colors.red}✖${colors.reset} ${colors.gray}${file}${colors.reset}: ${message}`);
  } else {
    warnings.push(entry);
    console.log(`${colors.yellow}⚠${colors.reset} ${colors.gray}${file}${colors.reset}: ${message}`);
  }
}

function validateWorkFile(filePath, fileName) {
  const content = readFileSync(filePath, 'utf-8');
  const [fm, body] = extractFrontmatter(content);

  // 必填字段检查
  const requiredFields = ['title', 'slug', 'date', 'excerpt', 'tags'];
  for (const field of requiredFields) {
    const value = fm[field];
    if (value === undefined || value === null) {
      log('error', fileName, field, `Missing required field: ${field}`);
    } else if (typeof value === 'string' && !value.trim()) {
      log('error', fileName, field, `Field "${field}" is empty`);
    } else if (Array.isArray(value) && value.length === 0) {
      log('error', fileName, field, `Field "${field}" is empty array`);
    }
  }

  // 日期格式检查
  if (fm.date && typeof fm.date === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fm.date)) {
      log('warning', fileName, 'date', 'Date should be in YYYY-MM-DD format');
    }
  }

  // slug 格式检查
  if (fm.slug && typeof fm.slug === 'string') {
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(fm.slug)) {
      log('warning', fileName, 'slug', 'Slug should be lowercase with hyphens only');
    }
  }

  // 内容长度检查
  if (body.trim().length < 50) {
    log('warning', fileName, 'content', 'Content is too short (less than 50 characters)');
  }

  // 封面图片检查
  if (fm.cover && typeof fm.cover === 'string') {
    const imagePath = join(rootDir, 'public', fm.cover.replace(/^\//, ''));
    if (!existsSync(imagePath)) {
      log('warning', fileName, 'cover', `Cover image not found: ${fm.cover}`);
    }
  }
}

function validateJsonFile(filePath, fileName) {
  const content = readFileSync(filePath, 'utf-8');
  try {
    JSON.parse(content);
    console.log(`${colors.green}✓${colors.reset} ${colors.gray}${fileName}${colors.reset}: Valid JSON`);
  } catch (e) {
    log('error', fileName, 'json', `Invalid JSON: ${e.message}`);
  }
}

function validateProfile(filePath) {
  validateJsonFile(filePath, 'profile/index.json');

  const content = readFileSync(filePath, 'utf-8');
  try {
    const profile = JSON.parse(content);
    const requiredFields = ['name', 'title', 'bio'];

    for (const field of requiredFields) {
      if (!profile[field]) {
        log('error', 'profile/index.json', field, `Missing required field: ${field}`);
      }
    }
  } catch (e) {
    // Already logged in validateJsonFile
  }
}

function validateConfig(filePath) {
  validateJsonFile(filePath, 'config.json');

  const content = readFileSync(filePath, 'utf-8');
  try {
    const config = JSON.parse(content);

    if (!config.seo?.title) {
      log('error', 'config.json', 'seo.title', 'Missing SEO title');
    }
    if (!config.seo?.description) {
      log('error', 'config.json', 'seo.description', 'Missing SEO description');
    }
    if (!config.seo?.url) {
      log('warning', 'config.json', 'seo.url', 'Missing site URL');
    }
  } catch (e) {
    // Already logged in validateJsonFile
  }
}

// ============================================================
// 主函数
// ============================================================

function main() {
  console.log(`\n${colors.blue}▶ Validating content...${colors.reset}\n`);

  // 验证作品
  const worksDir = join(contentDir, 'works');
  if (existsSync(worksDir)) {
    const files = readdirSync(worksDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    console.log(`${colors.blue}📁 Works (${files.length} files)${colors.reset}`);

    for (const file of files) {
      const filePath = join(worksDir, file);
      validateWorkFile(filePath, `works/${file}`);
    }
  }

  console.log('');

  // 验证 profile
  const profilePath = join(contentDir, 'profile', 'index.json');
  if (existsSync(profilePath)) {
    console.log(`${colors.blue}👤 Profile${colors.reset}`);
    validateProfile(profilePath);
  }

  console.log('');

  // 验证 config
  const configPath = join(contentDir, 'config.json');
  if (existsSync(configPath)) {
    console.log(`${colors.blue}⚙️  Config${colors.reset}`);
    validateConfig(configPath);
  }

  // 输出汇总
  console.log(`\n${'─'.repeat(50)}\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${colors.green}✓ All content is valid!${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`Summary: ${colors.red}${errors.length} errors${colors.reset}, ${colors.yellow}${warnings.length} warnings${colors.reset}\n`);

  if (errors.length > 0) {
    console.log(`${colors.red}✖ Validation failed with ${errors.length} error(s)${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.yellow}⚠ Validation passed with ${warnings.length} warning(s)${colors.reset}\n`);
    process.exit(0);
  }
}

main();
