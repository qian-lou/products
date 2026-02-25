# Portfolio Website

A modern, minimal, and highly interactive portfolio website built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 📱 **Responsive Split Design** - Desktop split layout (Sidebar + Resizable Workspace) and mobile-friendly stacked views
- 🌐 **Internationalization (i18n)** - Full bilingual support (English and Simplified Chinese) via seamless dropdown
- 🌌 **Fluid Particle Background** - Interactive, high-performance canvas background that dynamically reacts to mouse movements and theme changes
- 🌗 **Dark/Light Mode** - System preference detection with manual toggle integrated with `next-themes`
- 📝 **Markdown Content Management** - Easy and flexible content management via Markdown (MDX/MD) files with split-language prefixes (`en_` and `ch_`)
- 🎨 **Modern UI & Animations** - Clean aesthetics with smooth `framer-motion` page transitions and staggered container lists
- ⚡ **Static Generation (SSG)** - Pre-rendered pages for optimal performance and fast load times
- 🔍 **SEO Optimized** - Dynamic meta tags, OpenGraph support, sitemap, and robots.txt

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers (Theme, i18n)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles and Tailwind configs
│   └── works/[slug]/       # Work detail pages
├── components/
│   ├── layout/             # Layout components (Sidebar, ResizableLayout)
│   ├── ui/                 # UI elements (DynamicBackground, LangToggle, ThemeToggle)
│   └── works/              # Work-related content components
├── content/
│   ├── works/              # Markdown work files (en_*.md, ch_*.md)
│   ├── profile/            # Personal info files (en_index.json, ch_index.json)
│   └── config.json         # Site configuration
├── lib/                    # Utility functions (i18n helpers, md parsers, utils)
├── public/                 # Static images and assets
└── scripts/                # Utility scripts for parsing and validating content
```

## 📝 Content Management

### 1. Bilingual Profiles

Update the user profile for both languages in `content/profile/en_index.json` and `content/profile/ch_index.json`:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "bio": "Your bio...",
  "email": "hello@example.com",
  "skills": [
    { "name": "TypeScript", "category": "frontend" }
  ],
  "socials": [
    { "platform": "github", "url": "https://github.com/user" }
  ]
}
```

### 2. Adding Works (Bilingual Markdown)

Works are driven by Markdown files. To add a new work, simply provide two locale versions with identical `slug` properties but localized content.

Example: create `content/works/en_my-project.md` and `content/works/ch_my-project.md`:

```markdown
---
title: "Project Title"
slug: "my-project"
date: "2026-02-23"
excerpt: "Short description"
tags: ["React", "TypeScript"]
cover: "/images/works/cover.png"
demo: "https://demo.example.com"
github: "https://github.com/user/repo"
featured: true
---

## Project Overview

Your content here...
```

The system will match user language preference and display the appropriate localized file!

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Validate content and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run content:validate` | Check data integrity in Markdowns |

## 📦 Tech Stack Additions

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Interactions**: [Motion (Framer Motion)](https://motion.dev/)
- **Theme/i18n**: next-themes & custom cookie-based locale detection

## 📄 License

MIT License - feel free to use this for your own portfolio!
