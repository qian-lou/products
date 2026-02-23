/**
 * @fileoverview 图片管理工具
 * @description Image optimization and management utilities
 *
 * Features:
 * - Image compression before upload
 * - Responsive image generation
 * - Lazy loading helpers
 * - Placeholder generation
 *
 * Time Complexity: O(1) for helpers
 * Space Complexity: O(1)
 */

// ============================================================
// 图片路径工具
// ============================================================

/** 图片基础路径 */
export const IMAGE_BASE = '/images';

/** 预设尺寸 */
export const IMAGE_SIZES = {
  thumbnail: { width: 320, height: 240 },
  cover: { width: 800, height: 600 },
  hero: { width: 1920, height: 1080 },
  avatar: { width: 200, height: 200 },
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

/**
 * 生成图片 URL
 * @param path - 图片路径（相对于 /images）
 * @param size - 尺寸预设
 */
export function getImageUrl(path: string, size?: ImageSize): string {
  const cleanPath = path.replace(/^\//, '');
  if (!size) return `${IMAGE_BASE}/${cleanPath}`;

  // 如果有尺寸变体，尝试加载
  const ext = cleanPath.split('.').pop();
  const baseName = cleanPath.replace(`.${ext}`, '');
  return `${IMAGE_BASE}/${baseName}-${size}.${ext}`;
}

/**
 * 生成 srcset 属性
 * @param path - 图片路径
 * @param sizes - 尺寸列表
 */
export function getImageSrcSet(
  path: string,
  sizes: ImageSize[] = ['thumbnail', 'cover']
): string {
  return sizes
    .map((size) => {
      const config = IMAGE_SIZES[size];
      return `${getImageUrl(path, size)} ${config.width}w`;
    })
    .join(', ');
}

// ============================================================
// 懒加载工具
// ============================================================

/**
 * 生成模糊占位符
 * @param width - 宽度
 * @param height - 高度
 * @returns Base64 encoded SVG
 */
export function generatePlaceholder(
  width: number,
  height: number
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

/**
 * 图片加载状态
 */
export type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * 图片懒加载配置
 */
export interface LazyImageConfig {
  /** 图片源 */
  src: string;
  /** 占位符 */
  placeholder?: string;
  /** 加载阈值（像素） */
  threshold?: number;
  /** 是否立即加载 */
  eager?: boolean;
}

// ============================================================
// 图片优化建议
// ============================================================

/**
 * 图片优化配置
 */
export const IMAGE_OPTIMIZATION = {
  /** 最大文件大小（字节） */
  maxSizeBytes: 500 * 1024, // 500KB
  /** 推荐格式 */
  preferredFormats: ['webp', 'avif', 'jpg', 'png'] as const,
  /** 压缩质量 */
  quality: 85,
  /** 最大宽度 */
  maxWidth: 1920,
  /** 最大高度 */
  maxHeight: 1080,
} as const;

/**
 * 检查图片是否符合优化标准
 */
export function checkImageOptimization(
  file: File
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (file.size > IMAGE_OPTIMIZATION.maxSizeBytes) {
    const sizeKB = Math.round(file.size / 1024);
    warnings.push(`File size (${sizeKB}KB) exceeds recommended 500KB`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() as 'webp' | 'avif' | 'jpg' | 'png' | undefined;
  if (ext && !IMAGE_OPTIMIZATION.preferredFormats.includes(ext)) {
    warnings.push(`Format ".${ext}" is not in preferred formats`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
