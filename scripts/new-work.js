#!/usr/bin/env node
/**
 * @fileoverview 新建作品脚本
 * @description Create a new work Markdown file with template
 *
 * Usage:
 *   node scripts/new-work.js "My Project Title"
 *   node scripts/new-work.js "My Project" --slug=my-project
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */

import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentDir = join(__dirname, '..', 'content', 'works');

// ANSI 颜色
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

/**
 * 生成 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 解析命令行参数
 */
function parseArgs(args) {
  const result = {
    title: '',
    slug: '',
    tags: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--slug=')) {
      result.slug = arg.split('=')[1];
    } else if (arg === '--slug' && args[i + 1]) {
      result.slug = args[++i];
    } else if (arg.startsWith('--tags=')) {
      result.tags = arg.split('=')[1].split(',');
    } else if (arg === '--tags' && args[i + 1]) {
      result.tags = args[++i].split(',');
    } else if (!arg.startsWith('--')) {
      result.title = arg;
    }
  }

  return result;
}

/**
 * 生成模板内容
 */
function generateTemplate(options) {
  const today = new Date().toISOString().split('T')[0];
  const slug = options.slug || generateSlug(options.title);
  const tags = options.tags.length > 0 ? options.tags : ['Tag1', 'Tag2'];

  return `---
title: "${options.title}"
slug: "${slug}"
date: "${today}"
excerpt: "A short description of your project (1-2 sentences)"
tags:
${tags.map(t => `  - ${t}`).join('\n')}
cover: "/images/works/${slug}-cover.png"
demo: ""
github: ""
featured: false
---

## Overview

Describe your project here. What problem does it solve? Who is it for?

## Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

\`\`\`typescript
// Code example
const example = "Hello, World!";
\`\`\`

## Screenshots

![Screenshot](/images/works/${slug}-screenshot.png)

## Lessons Learned

What did you learn from this project?

## Links

- [Live Demo](https://example.com)
- [GitHub Repository](https://github.com/username/repo)
`;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.blue}Usage:${colors.reset}
  node scripts/new-work.js "Project Title" [options]

${colors.blue}Options:${colors.reset}
  --slug=<slug>      Custom slug (default: generated from title)
  --tags=<tags>      Comma-separated tags (default: Tag1,Tag2)

${colors.blue}Examples:${colors.reset}
  node scripts/new-work.js "My Awesome Project"
  node scripts/new-work.js "My Project" --slug=my-project --tags=React,TypeScript
`);
    process.exit(0);
  }

  const options = parseArgs(args);

  if (!options.title) {
    console.error('Error: Title is required');
    process.exit(1);
  }

  const slug = options.slug || generateSlug(options.title);
  const fileName = `${slug}.md`;
  const filePath = join(contentDir, fileName);

  // 检查文件是否存在
  if (existsSync(filePath)) {
    console.error(`Error: File already exists: ${fileName}`);
    process.exit(1);
  }

  // 生成并写入文件
  const template = generateTemplate({ ...options, slug });

  try {
    writeFileSync(filePath, template, 'utf-8');
    console.log(`
${colors.green}✓ Created new work:${colors.reset}
  ${colors.gray}Title:${colors.reset} ${options.title}
  ${colors.gray}Slug:${colors.reset}  ${slug}
  ${colors.gray}File:${colors.reset}  content/works/${fileName}

${colors.blue}Next steps:${colors.reset}
1. Edit the frontmatter and content
2. Add cover image to public/images/works/
3. Run: node scripts/validate-content.js
`);
  } catch (error) {
    console.error('Error creating file:', error.message);
    process.exit(1);
  }
}

main();
