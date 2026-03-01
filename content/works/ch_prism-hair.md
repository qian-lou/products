---
title: "Prism Hair - AI 实时染发引擎"
slug: "prism-hair"
date: "2026-03-01"
excerpt: "基于 MediaPipe Vision 的实时 AI 头发颜色变换 Web 应用。通过浏览器摄像头捕获视频流，利用多类自拍分割模型精准提取头发区域，并实时叠加颜色滤镜，实现流畅的虚拟染发体验。"
tags:
  - React 19
  - MediaPipe
  - TypeScript
  - WebGPU
cover: "/images/works/prism-hair-cover.png"
github: "https://github.com/qian-lou/prism-hair"
demo: "https://prism-hair.vercel.app"
featured: true
order: 1
---

## 项目概述

**Prism Hair** 是一个纯前端实时头发颜色变换应用，无需后端服务，打开即用。它利用 MediaPipe 多类自拍分割模型（selfie_multiclass_256x256）在浏览器端进行 GPU 加速推理，从摄像头视频流中精准提取头发区域，并通过 Canvas 2D 渲染管线实时叠加颜色滤镜。

## 核心特性

- **🧠 AI 实时分割**：基于 MediaPipe Selfie Multiclass 256×256 模型，GPU 加速推理
- **🎨 多色彩预设**：内置 Neon Blue、Hot Pink、Emerald、Purple 四种预设颜色
- **🎯 自定义颜色**：支持通过颜色选择器自由选取任意颜色
- **🔄 时序平滑**：帧间 Mask 指数加权平滑（α=0.4），消除闪烁与抖动
- **🌫️ 边缘柔化**：Soft Alpha Ramping + 2px 高斯模糊，自然过渡发丝边缘
- **📐 软光混合**：使用 `soft-light` 合成模式，保留头发纹理与光影细节
- **📱 响应式 UI**：适配桌面与移动端，暗色赛博朋克风格界面

## 技术栈与架构

### 技术栈

- **视图层**：React 19 + TypeScript
- **AI 推理**：MediaPipe Image Segmenter（WebAssembly + WebGPU）
- **渲染管线**：Canvas 2D API，requestAnimationFrame 驱动的实时渲染循环
- **构建工具**：Vite 6
- **样式**：TailwindCSS 4 + Lucide Icons + Motion 动画

### 渲染管线

1. **捕获**：通过 `getUserMedia` 获取 1280×720 摄像头流
2. **分割**：MediaPipe 多类分割模型输出 6 类置信度掩码（bg/hair/body/face/clothes/others）
3. **平滑**：帧间指数加权移动平均（EMA, α=0.4），消除时序抖动
4. **Alpha 映射**：置信度 0.3-0.7 区间线性映射至 0-255 alpha，捕捉细碎发丝
5. **合成**：`source-in` 填充目标颜色 → 2px 模糊扩展边缘 → `soft-light` 混合至原画

## 部署

项目已部署至 Vercel：**[prism-hair.vercel.app](https://prism-hair.vercel.app)**
