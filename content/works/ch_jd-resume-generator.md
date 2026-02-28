---
title: "JD 定制简历生成器"
slug: "jd-resume-generator"
date: "2024-03-01"
excerpt: "基于大型语言模型（LLM）的智能简历定制工具，能够根据目标职位描述（JD）自动优化和重写简历内容，显著提升简历初筛通过率。"
tags:
  - Spring Boot 3
  - Next.js 14
  - AI / LLM
  - PostgreSQL
cover: "/images/works/jd-resume-cover.png"
github: ""
demo: ""
featured: true
order: 1
---

## 项目概述

一个基于目标职位描述（JD）定制的智能简历生成工具，利用 AI 帮助求职者生成"更像这个岗位想要的候选人"的专属简历。解决了求职者反复修改简历、难以把握 ATS（应用追踪系统）和 HR 关注筛选逻辑的痛点。

## 核心功能

- **JD 智能深度解析**：自动提取职位必备技能、加分技能和 ATS 关键词。
- **候选人画像抽取**：将原始简历技能和经历拆解为结构化数据单元。
- **简历智能定制与重写**：基于 JD 语言体系重写经历，强化强相关经历，弱化弱相关经历。
- **匹配度评分与诊断**：输出修改理由、JD 映射说明，并提供 ATS/HR 视角的岗位匹配度评分。

## 技术栈与架构

### 后端架构
- **核心框架**：Java 25 + Spring Boot 3.4
- **数据存储**：PostgreSQL 16 (应用数据) + Redis 7 (缓存与异步任务队列)
- **安全与鉴权**：Spring Security + JWT
- **API 管理**：OpenAPI (Swagger)

### 前端架构
- **核心框架**：Next.js 14 (App Router)
- **开发语言**：React 18 + TypeScript
- **样式与组件**：Tailwind CSS + shadcn/ui

### AI 与大模型接入
- **大模型**：对接智谱 GLM API（默认使用 glm-4-flash）及 OpenAI 模型
- **异步工作流**：支持 LLM 异步调用、任务状态轮询及结果取回

### 部署与运维
- **容器化部署**：Docker + Docker Compose 实现前后端及中间件的一键编排
