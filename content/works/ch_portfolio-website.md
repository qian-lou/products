---
title: "作品集网站"
slug: "portfolio-website"
date: "2026-02-20"
excerpt: "使用 React、TypeScript 和 Tailwind CSS 构建的现代简约作品集网站。支持 Markdown 驱动的内容管理和静态站点生成。"
tags:
  - React
  - TypeScript
  - Tailwind CSS
  - SSG
cover: "/images/works/portfolio-cover.svg"
demo: "https://myportfolio.vercel.app"
github: "https://github.com/qian-lou/products/"
featured: true
order: 1
---

## 项目概述

这个作品集网站展示了我作为开发者的作品和技能。采用现代 Web 技术构建，主要特性包括：

- **静态站点生成**：预渲染页面实现极速加载
- **Markdown 驱动**：通过 Markdown 文件轻松管理内容
- **响应式设计**：在所有设备上都有出色的显示效果
- **SEO 优化**：完善的 Meta 标签、站点地图和结构化数据

## 技术亮点

### 内容管理

所有项目内容以带 YAML 前置元数据的 Markdown 文件存储：

```yaml
---
title: "项目标题"
slug: "project-slug"
date: "2026-02-20"
excerpt: "简短描述"
tags: ["React", "TypeScript"]
---
```

### 性能表现

- Lighthouse 评分：95+
- 首次内容绘制 (FCP)：< 1.5s
- 可交互时间 (TTI)：< 3s

## 经验总结

构建这个作品集让我学到了：

1. **简约至上**：极简的方案往往带来更好的可维护性
2. **类型安全很重要**：TypeScript 在生产环境之前就能捕获错误
3. **静态即快速**：预渲染内容提供最佳用户体验
