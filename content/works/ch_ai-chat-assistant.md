---
title: "AI 聊天助手"
slug: "ai-chat-assistant"
date: "2025-11-20"
excerpt: "支持多轮对话的智能聊天界面。集成 OpenAI API，具备上下文记忆、流式输出和 Markdown 渲染能力。"
tags:
  - React
  - OpenAI
  - Node.js
  - WebSocket
cover: "/images/works/ai-chat-cover.svg"
demo: "https://ai-chat-demo.vercel.app"
github: "https://github.com/username/ai-chat"
featured: false
order: 3
---

## 项目概述

基于 OpenAI GPT 模型构建的智能聊天应用，提供流畅的多轮对话体验。

## 核心功能

- **流式输出**：逐token渲染 AI 回复，类似 ChatGPT 的打字效果
- **上下文记忆**：维护对话历史，支持多轮连贯交互
- **Markdown 渲染**：完整支持代码高亮、表格、列表等格式
- **对话管理**：创建、切换、删除多个独立会话

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS
- **后端**：Node.js + Express + OpenAI SDK
- **实时通信**：Server-Sent Events (SSE)
- **存储**：IndexedDB（本地对话存储）
