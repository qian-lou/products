# Portfolio Website

A modern, minimal, and highly interactive portfolio website built with Next.js 16, React 19, TypeScript 5.8, Tailwind CSS v4, and Motion.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)
![Motion](https://img.shields.io/badge/Motion-12-ff0055?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 📱 **Responsive Split Design** - Desktop split layout (Sidebar + Resizable Workspace) and mobile-friendly stacked views
- 🌐 **Internationalization (i18n)** - Full bilingual support (English and Simplified Chinese) via seamless dropdown
- 🌌 **Fluid Particle Background** - Interactive, high-performance canvas background that dynamically reacts to mouse movements and theme changes
- 🌗 **Dark/Light Mode** - System preference detection with manual toggle integrated with `next-themes`
- 📝 **Markdown Content Management** - Easy and flexible content management via Markdown files with language prefixes (`en_` and `ch_`)
- 🎨 **Modern UI & Animations** - Clean aesthetics with smooth `motion` page transitions and staggered container lists
- ⚡ **Static Generation (SSG)** - Pre-rendered pages for optimal performance and fast load times
- 🔍 **SEO Optimized** - Dynamic meta tags, OpenGraph support, sitemap, and robots.txt

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.x |
| **UI Library** | [React](https://react.dev/) | 19.x |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.8 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **Animation** | [Motion](https://motion.dev/) (Framer Motion) | 12.x |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.x |
| **Icons** | [Lucide React](https://lucide.dev/) | Latest |
| **Markdown** | gray-matter + remark + remark-gfm + remark-html | Latest |
| **Utilities** | clsx + tailwind-merge | Latest |

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
├── content/                    # Content files (Markdown/JSON)
│   ├── works/                  # Work Markdown files (en_*.md, ch_*.md)
│   ├── profile/                # Profile JSON files (en_index.json, ch_index.json)
│   └── config.json             # Site configuration
├── public/                     # Static assets (images, fonts)
│   └── data/                   # Generated JSON data
├── scripts/                    # Utility scripts
│   ├── validate-content.js     # Content validation
│   ├── build-data.js           # Data build script
│   └── new-work.js             # Create new work template
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   ├── robots.ts           # Robots.txt config
│   │   └── works/[slug]/       # Work detail pages
│   ├── components/
│   │   ├── layout/             # Layout components (Sidebar, ResizableLayout, Footer)
│   │   ├── providers/          # Context providers (Theme, I18n)
│   │   ├── ui/                 # UI components (DynamicBackground, ThemeToggle, LangToggle)
│   │   └── works/              # Work-related components (WorkCard, WorkList, etc.)
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization configs
│   ├── lib/                    # Utility functions (content, markdown, locale, etc.)
│   └── types/                  # TypeScript type definitions
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment config
```

## 📝 Content Management

### 1. Site Configuration

Edit `content/config.json` to update site metadata:

```json
{
  "seo": {
    "title": "Your Name - Title",
    "description": "Your description...",
    "url": "https://yoursite.com"
  },
  "features": {
    "darkMode": true,
    "analytics": false
  }
}
```

### 2. Bilingual Profiles

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

### 3. Adding Works (Bilingual Markdown)

Works are driven by Markdown files. Create two locale versions with identical `slug` but localized content.

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

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Project title |
| `slug` | ✅ | URL identifier |
| `date` | ✅ | Publish date (ISO 8601) |
| `excerpt` | ✅ | Short description for list/SEO |
| `tags` | ✅ | Tag array |
| `cover` | ❌ | Cover image path |
| `demo` | ❌ | Demo URL |
| `github` | ❌ | GitHub repo URL |
| `featured` | ❌ | Priority display (default: false) |
| `published` | ❌ | Publish status (default: true) |
| `order` | ❌ | Custom sort weight |

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Validate content and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run content:validate` | Validate Markdown frontmatter |
| `npm run content:build` | Build JSON data from Markdown |
| `npm run new:work` | Create new work template |

## 🎨 Design System

- **Fonts**: Inter (body) + Outfit (headings) via Google Fonts
- **Colors**: Neutral palette with blue accent
- **Spacing**: Consistent whitespace with Tailwind's scale
- **Border Radius**: 8px standard
- **Transitions**: 200-300ms for hover effects

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Deploy automatically

### Content Updates

1. Add/edit Markdown files in `content/works/`
2. Commit and push to GitHub
3. Vercel auto-rebuilds and deploys

## 📊 Performance

- **SSG**: All pages pre-rendered at build time
- **Font Optimization**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code eliminated

## 🔒 Security

- No runtime database calls
- No sensitive data in client bundle
- CSP-ready headers
- No external API dependencies

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Motion](https://motion.dev/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
