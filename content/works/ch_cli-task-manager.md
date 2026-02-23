---
title: "CLI 任务管理器"
slug: "cli-task-manager"
date: "2025-08-05"
excerpt: "基于终端的任务管理工具，支持键盘导航、语法高亮和 SQLite 存储。使用 Go 构建，跨平台兼容。"
tags:
  - Go
  - CLI
  - SQLite
  - TUI
cover: "/images/works/cli-task-cover.svg"
github: "https://github.com/username/cli-task-manager"
featured: false
order: 5
---

## 项目概述

一个功能丰富的终端任务管理应用，专为键盘操作优化，让你在命令行中高效管理待办事项。

## 核心功能

- **TUI 界面**：基于 Bubble Tea 框架的精美终端 UI
- **键盘优先**：Vim 风格快捷键，全键盘操作
- **SQLite 存储**：轻量级本地数据库，零配置
- **跨平台**：支持 macOS、Linux 和 Windows

## 技术栈

- **语言**：Go 1.21+
- **TUI 框架**：Charm / Bubble Tea + Lip Gloss
- **存储**：SQLite3 + sqlx
- **构建**：GoReleaser + GitHub Actions CI/CD
