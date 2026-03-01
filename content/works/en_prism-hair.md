---
title: "Prism Hair - Real-time AI Hair Color Engine"
slug: "prism-hair"
date: "2026-03-01"
excerpt: "A real-time AI hair color transformation web app powered by MediaPipe Vision. Captures webcam video, uses a multi-class selfie segmentation model to precisely extract hair regions, and overlays color filters in real-time for a seamless virtual hair coloring experience."
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

## Overview

**Prism Hair** is a purely frontend, real-time hair color transformation app — no backend required, ready to use instantly. It leverages the MediaPipe Multi-class Selfie Segmentation model (selfie_multiclass_256x256) for GPU-accelerated inference directly in the browser, precisely extracting hair regions from the webcam video stream and overlaying color filters through a Canvas 2D rendering pipeline.

## Core Features

- **🧠 Real-time AI Segmentation**: Built on MediaPipe Selfie Multiclass 256×256 model with GPU-accelerated inference
- **🎨 Color Presets**: Four built-in presets — Neon Blue, Hot Pink, Emerald, and Purple
- **🎯 Custom Colors**: Freely pick any color via the color picker
- **🔄 Temporal Smoothing**: Inter-frame exponential weighted mask smoothing (α=0.4) to eliminate flickering and jitter
- **🌫️ Edge Softening**: Soft Alpha Ramping + 2px Gaussian blur for natural hair strand edge transitions
- **📐 Soft-Light Blending**: Uses `soft-light` compositing to preserve hair texture and lighting details
- **📱 Responsive UI**: Adapts to desktop and mobile, featuring a dark cyberpunk-style interface

## Tech Stack & Architecture

### Tech Stack

- **View Layer**: React 19 + TypeScript
- **AI Inference**: MediaPipe Image Segmenter (WebAssembly + WebGPU)
- **Rendering Pipeline**: Canvas 2D API, requestAnimationFrame-driven real-time render loop
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4 + Lucide Icons + Motion animations

### Rendering Pipeline

1. **Capture**: Obtain 1280×720 webcam stream via `getUserMedia`
2. **Segment**: MediaPipe multi-class model outputs 6-class confidence masks (bg/hair/body/face/clothes/others)
3. **Smooth**: Inter-frame exponential moving average (EMA, α=0.4) to eliminate temporal jitter
4. **Alpha Map**: Linear mapping from 0.3-0.7 confidence range to 0-255 alpha, capturing fine flyaway strands
5. **Composite**: `source-in` color fill → 2px blur edge dilation → `soft-light` blend onto original frame

## Deployment

Deployed on Vercel: **[prism-hair.vercel.app](https://prism-hair.vercel.app)**
