# Portfolio Website

A modern, minimal portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 📱 **Responsive Design** - Mobile-first approach with desktop split layout
- 🌗 **Dark Mode** - System preference detection with manual toggle
- 📝 **Markdown Content** - Easy content management via Markdown files
- ⚡ **Static Generation** - Pre-rendered pages for optimal performance
- 🔍 **SEO Optimized** - Dynamic meta tags, sitemap, and robots.txt
- 🎨 **Modern UI** - Clean, minimal design with subtle animations

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

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── works/[slug]/       # Work detail pages
├── components/
│   ├── layout/             # Layout components
│   ├── providers/          # Context providers
│   ├── ui/                 # UI components
│   └── works/              # Work-related components
├── content/
│   ├── works/              # Markdown work files
│   ├── profile/            # Personal info
│   └── config.json         # Site configuration
├── lib/                    # Utility functions
├── public/
│   └── images/             # Static images
└── types/                  # TypeScript definitions
```

## 📝 Content Management

### Adding a New Work

1. Create a new Markdown file in `content/works/`:

```markdown
---
title: "Project Title"
slug: "project-slug"
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

2. Add cover image to `public/images/works/`

### Updating Profile

Edit `content/profile/index.json`:

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

### Site Configuration

Edit `content/config.json` for SEO settings:

```json
{
  "seo": {
    "title": "Your Name - Portfolio",
    "description": "Your description",
    "url": "https://yoursite.com"
  }
}
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run content:validate` | Validate content files |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio)

### Manual Build

```bash
npm run build
npm run start
```

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Content**: Markdown with gray-matter

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

- Design inspiration from minimal portfolio designs
- Built with love using modern web technologies
