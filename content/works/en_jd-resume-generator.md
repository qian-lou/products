---
title: "JD Customized Resume Generator"
slug: "jd-resume-generator"
date: "2024-03-01"
excerpt: "An AI-powered smart resume customization tool that automatically optimizes and rewrites resume content based on target Job Descriptions (JD), significantly improving initial screening pass rates."
tags:
  - Spring Boot 3
  - Next.js 14
  - AI / LLM
  - PostgreSQL
cover: "/images/works/ecommerce-dashboard-cover.svg"
github: ""
demo: ""
featured: true
order: 1
---

## Overview

An intelligent resume generation tool customized based on target Job Descriptions (JD), utilizing AI to help job seekers generate a tailored resume that makes them "look more like the candidate the position wants." It solves the pain points of repeatedly modifying resumes and struggling to grasp the screening logic of ATS (Applicant Tracking Systems) and HRs.

## Core Features

- **Intelligent JD Deep Parsing**: Automatically extracts must-have skills, nice-to-have skills, and ATS keywords from job descriptions.
- **Candidate Profile Extraction**: Breaks down original resume skills and experiences into structured data units.
- **Smart Resume Customization & Rewriting**: Rewrites experiences based on the JD's linguistic system, strengthening highly relevant experiences while weakening less relevant ones.
- **Match Scoring & Diagnostics**: Provides modification reasons, JD mapping explanations, and outputs a position match score from an ATS/HR perspective.

## Tech Stack & Architecture

### Backend Architecture
- **Core Framework**: Java 25 + Spring Boot 3.4
- **Data Storage**: PostgreSQL 16 (Application Data) + Redis 7 (Caching & Async Task Queue)
- **Security & Auth**: Spring Security + JWT
- **API Management**: OpenAPI (Swagger)

### Frontend Architecture
- **Core Framework**: Next.js 14 (App Router)
- **UI & Language**: React 18 + TypeScript
- **Styling & Components**: Tailwind CSS + shadcn/ui

### AI & LLM Integration
- **LLM Integration**: Integrated with Zhipu GLM API (default glm-4-flash) and OpenAI models.
- **Asynchronous Workflow**: Supports asynchronous LLM calls, task status polling, and result retrieval.

### Deployment & DevOps
- **Containerized Deployment**: Docker + Docker Compose for seamless orchestration of frontend, backend, and middleware.
