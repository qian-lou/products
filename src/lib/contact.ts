/**
 * @fileoverview 联系表单 API 设计（可选功能）
 * @description Contact form handling for static sites
 *
 * Since this is a static site, we use serverless functions or third-party services.
 *
 * Options:
 * 1. Vercel Serverless Functions (recommended)
 * 2. Formspree / Netlify Forms
 * 3. EmailJS (client-side)
 */

// ============================================================
// 联系表单数据结构
// ============================================================

/**
 * 联系表单输入
 */
export interface ContactFormInput {
  /** 姓名 */
  name: string;
  /** 邮箱 */
  email: string;
  /** 主题 */
  subject?: string;
  /** 消息内容 */
  message: string;
}

/**
 * 联系表单响应
 */
export interface ContactFormResponse {
  /** 是否成功 */
  success: boolean;
  /** 消息 */
  message: string;
  /** 错误详情 */
  errors?: Record<string, string>;
}

// ============================================================
// 表单验证
// ============================================================

/**
 * 验证联系表单
 * @param input - 表单输入
 * @returns 验证结果
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
export function validateContactForm(
  input: Partial<ContactFormInput>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // 姓名验证
  if (!input.name?.trim()) {
    errors.name = 'Name is required';
  } else if (input.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  // 邮箱验证
  if (!input.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'Invalid email format';
  }

  // 消息验证
  if (!input.message?.trim()) {
    errors.message = 'Message is required';
  } else if (input.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (input.message.length > 5000) {
    errors.message = 'Message must be less than 5000 characters';
  }

  // 主题验证（可选）
  if (input.subject && input.subject.length > 200) {
    errors.subject = 'Subject must be less than 200 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================
// API 客户端
// ============================================================

/**
 * 发送联系表单
 * @param input - 表单输入
 * @param endpoint - API 端点
 *
 * Time Complexity: O(1) network request
 * Space Complexity: O(1)
 */
export async function submitContactForm(
  input: ContactFormInput,
  endpoint = '/api/contact'
): Promise<ContactFormResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();
    return data as ContactFormResponse;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
    };
  }
}

// ============================================================
// Vercel Serverless Function 示例
// ============================================================

/**
 * Vercel Serverless Function 示例代码
 *
 * 文件位置: /api/contact.ts
 *
 * ```typescript
 * import type { VercelRequest, VercelResponse } from '@vercel/node';
 * import nodemailer from 'nodemailer';
 *
 * export default async function handler(
 *   req: VercelRequest,
 *   res: VercelResponse
 * ) {
 *   if (req.method !== 'POST') {
 *     return res.status(405).json({ message: 'Method not allowed' });
 *   }
 *
 *   const { name, email, subject, message } = req.body;
 *
 *   // 验证输入
 *   if (!name || !email || !message) {
 *     return res.status(400).json({
 *       success: false,
 *       message: 'Missing required fields',
 *     });
 *   }
 *
 *   // 发送邮件 (使用环境变量配置)
 *   const transporter = nodemailer.createTransport({
 *     host: process.env.SMTP_HOST,
 *     port: 587,
 *     auth: {
 *       user: process.env.SMTP_USER,
 *       pass: process.env.SMTP_PASS,
 *     },
 *   });
 *
 *   await transporter.sendMail({
 *     from: process.env.CONTACT_EMAIL,
 *     to: process.env.CONTACT_EMAIL,
 *     subject: subject || `New message from ${name}`,
 *     text: `
 *       Name: ${name}
 *       Email: ${email}
 *       Message: ${message}
 *     `,
 *     replyTo: email,
 *   });
 *
 *   return res.status(200).json({
 *     success: true,
 *     message: 'Message sent successfully',
 *   });
 * }
 * ```
 */

// ============================================================
// Formspree 集成（替代方案）
// ============================================================

/**
 * 使用 Formspree 的客户端代码
 *
 * ```typescript
 * const FORMSPREE_ID = 'your-form-id';
 *
 * async function submitToFormspree(input: ContactFormInput) {
 *   const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(input),
 *   });
 *   return response.ok;
 * }
 * ```
 */

// ============================================================
// 访问统计（可选）
// ============================================================

/**
 * 简单的页面访问追踪
 * @description 使用 Vercel Analytics 或自定义解决方案
 *
 * Vercel Analytics 配置:
 * 1. 在 vercel.json 中启用:
 *    { "analytics": { "id": "your-analytics-id" } }
 *
 * 2. 或使用 @vercel/analytics 包:
 *    import { Analytics } from '@vercel/analytics/react';
 *    <Analytics />
 */

/**
 * 自定义事件追踪
 * @param eventName - 事件名称
 * @param metadata - 事件元数据
 */
export function trackEvent(
  eventName: string,
  metadata?: Record<string, unknown>
): void {
  // Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      'event',
      eventName,
      metadata
    );
  }

  // 自定义追踪（可选）
  console.log('[Analytics]', eventName, metadata);
}
