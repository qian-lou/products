好的 👍
下面是为你的项目整理好的 **完整需求文档（Markdown 格式）**。

你可以直接复制使用。

---

```markdown
# Personal Portfolio Website — Requirement Document

## 1. Project Overview

### 1.1 Project Goal

Build a modern, minimal, static portfolio website with a simple left-right layout.

- No backend
- No database
- No CMS
- Content managed via Markdown files
- Deployed on Vercel
- Fully static generated site

The website should be clean, professional, and easy to maintain long term.

---

## 2. Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content Source | Markdown / MDX |
| Rendering | Static Site Generation (SSG) |
| Deployment | Vercel |

---

## 3. Layout Structure

### 3.1 Global Layout

Desktop layout uses a split screen structure:

- Left Panel: Personal Information (30–35%)
- Right Panel: Works Content Area (65–70%)

Mobile layout:

- Left panel stacked on top
- Right panel displayed below
- Fully responsive

---

## 4. Page Requirements

---

## 4.1 Homepage ("/")

### Layout

Split layout:

### Left Panel (Sticky Sidebar)

Content:

- Name (large typography)
- Professional title (e.g. Designer / Developer)
- Short bio paragraph
- Skills (displayed as tags)
- Social links:
  - GitHub
  - Email
  - LinkedIn
- Optional avatar

Design requirements:

- Clean background
- Strong typography hierarchy
- Vertical spacing
- Minimal decoration
- May remain sticky during scroll

---

### Right Panel (Scrollable Content Area)

Section title: "Selected Works"

Display works as:

- Vertical list OR clean grid layout
- Generous spacing
- Clear content separation

Each work item includes:

- Title
- Short description
- Tags
- Optional thumbnail (right aligned)
- Subtle hover effect
- Clickable link to detail page

Sorting logic:

1. Featured items first
2. Then by date (descending)

---

## 4.2 Work Detail Page ("/works/[slug]")

Layout remains split (left panel unchanged).

Right panel content:

- Project title (large heading)
- Publish date
- Tags
- Cover image (optional)
- Markdown content body
- External links section:
  - Demo
  - GitHub
- Back to home link

Typography must be optimized for readability.

Markdown should support:

- Headings (H2, H3)
- Paragraph spacing
- Lists
- Code blocks
- Images

---

## 4.3 About Page (Optional)

Right panel content:

- Short biography
- Skills list
- Experience summary (optional)
- Contact information

---

## 5. Content Management (Markdown Driven)

All works stored in:

```

/content/works/

```

Each work is one Markdown or MDX file.

---

### Example File Structure

```

content/
works/
portfolio-website.md
design-system.md

````

---

### Markdown Frontmatter Schema

```yaml
---
title: "Project Title"
slug: "project-slug"
date: "2026-02-23"
excerpt: "Short description of the project"
tags: ["Next.js", "Design", "Portfolio"]
cover: "/images/project/cover.png"
demo: "https://demo-link.com"
github: "https://github.com/username/repo"
featured: true
---
````

---

### Required Fields

| Field    | Required | Description                  |
| -------- | -------- | ---------------------------- |
| title    | Yes      | Project title                |
| slug     | Yes      | URL identifier               |
| date     | Yes      | Publish date                 |
| excerpt  | Yes      | Short description            |
| tags     | Yes      | Tag list                     |
| cover    | No       | Cover image path             |
| demo     | No       | Demo link                    |
| github   | No       | GitHub link                  |
| featured | No       | Boolean for priority display |

---

## 6. Image Management

### Option A (Recommended)

Store images locally:

```
/public/images/...
```

Advantages:

* Completely free
* No external dependency
* Simple maintenance

---

### Option B (Optional)

Use Cloudflare R2 as image storage.

Markdown references external image URLs.

---

## 7. SEO Requirements

* Dynamic page title per project
* Meta description from excerpt
* Open Graph support
* Sitemap generation
* robots.txt

---

## 8. UI & Visual Guidelines

### Design Style

* Minimal
* Modern
* Clean
* Balanced layout
* Professional

### Visual Rules

* Neutral color palette
* One accent color
* Strong typography hierarchy
* Generous whitespace
* Rounded corners (8px)
* Soft shadows
* Subtle hover transitions (200–300ms)

Avoid:

* Complex animations
* Heavy gradients
* Overly decorative elements

---

## 9. Performance Requirements

* Fully static generated pages
* Optimized images
* Fast loading speed
* No runtime database calls

---

## 10. Deployment Process

1. Create GitHub repository
2. Implement project
3. Import repository into Vercel
4. Deploy
5. Connect custom domain (optional)

Future content updates:

* Add new Markdown file
* Commit and push
* Vercel auto rebuilds

---

## 11. Future Extensibility

* Blog system
* Tag filtering page
* Search
* Dark mode toggle
* RSS feed
* Resume download
* Multi-language support

---

## 12. Project Goals Summary

This project must be:

* Fully static
* Long-term free
* Easy to maintain
* Clean and structured
* Easy to extend in the future

```

---

如果你愿意，我可以再给你：

- 🔹 对应的项目目录结构模板
- 🔹 Next.js 路由结构设计
- 🔹 Markdown 解析实现方案
- 🔹 或帮你写 README.md（可直接放到 GitHub）
```
