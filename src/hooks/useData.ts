/**
 * @fileoverview 数据获取 Hooks
 * @description React hooks for fetching content data
 *
 * Time Complexity:
 * - useWorks: O(n) for data transformation
 * - useWork: O(1) for single fetch
 * Space Complexity: O(n) for cached data
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Work, WorkListItem, Profile, SiteConfig } from '@/types';

// ============================================================
// 数据获取基础函数
// ============================================================

const DATA_BASE = '/data';

/**
 * 获取 JSON 数据
 * @description Fetch JSON data from static files
 *
 * Time Complexity: O(1) network request
 * Space Complexity: O(n) for response data
 */
async function fetchData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${DATA_BASE}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return null;
  }
}

// ============================================================
// 作品相关 Hooks
// ============================================================

/**
 * 获取所有作品列表
 * @returns { works, loading, error }
 *
 * @example
 * const { works, loading } = useWorks();
 */
export function useWorks() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchData<WorkListItem[]>('/works.json')
      .then((data) => {
        if (data) {
          setWorks(data);
        }
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { works, loading, error };
}

/**
 * 获取单个作品详情
 * @param slug - 作品 slug
 * @returns { work, loading, error }
 *
 * Time Complexity: O(1) for fetch
 * Space Complexity: O(m) where m = work content size
 */
export function useWork(slug: string | undefined) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchData<Work>(`/works/${slug}.json`)
      .then((data) => {
        setWork(data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [slug]);

  return { work, loading, error };
}

/**
 * 获取相关作品推荐
 * @param currentSlug - 当前作品 slug
 * @param tags - 当前作品的标签
 * @param limit - 返回数量限制
 * @returns { relatedWorks, loading }
 *
 * Time Complexity: O(n * m) where n = works, m = tags per work
 * Space Complexity: O(k) where k = limit
 */
export function useRelatedWorks(
  currentSlug: string,
  tags: string[],
  limit = 3
) {
  const { works, loading } = useWorks();

  const relatedWorks = useMemo(() => {
    if (!works.length || !tags.length) return [];

    // 计算标签匹配分数
    const scored = works
      .filter((w) => w.slug !== currentSlug)
      .map((work) => {
        const commonTags = work.tags.filter((t) => tags.includes(t));
        return { work, score: commonTags.length };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ work }) => work);

    return scored;
  }, [works, currentSlug, tags, limit]);

  return { relatedWorks, loading };
}

/**
 * 根据标签筛选作品
 * @param tag - 标签名
 * @returns { works, loading }
 */
export function useWorksByTag(tag: string | undefined) {
  const { works, loading } = useWorks();

  const filteredWorks = useMemo(() => {
    if (!tag) return [];
    return works.filter((work) => work.tags.includes(tag));
  }, [works, tag]);

  return { works: filteredWorks, loading };
}

/**
 * 搜索作品
 * @param query - 搜索关键词
 * @returns { results, loading }
 *
 * Time Complexity: O(n * m) where n = works, m = avg title/excerpt length
 * Space Complexity: O(k) where k = matching results
 */
export function useSearchWorks(query: string) {
  const { works, loading } = useWorks();

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return works.filter((work) => {
      const titleMatch = work.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = work.excerpt.toLowerCase().includes(lowerQuery);
      const tagMatch = work.tags.some((t) =>
        t.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || excerptMatch || tagMatch;
    });
  }, [works, query]);

  return { results, loading };
}

// ============================================================
// 配置相关 Hooks
// ============================================================

/**
 * 获取个人信息
 * @returns { profile, loading, error }
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchData<Profile>('/profile.json')
      .then((data) => {
        setProfile(data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, error };
}

/**
 * 获取站点配置
 * @returns { config, loading, error }
 */
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchData<SiteConfig>('/config.json')
      .then((data) => {
        setConfig(data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}

/**
 * 获取所有标签
 * @returns { tags, loading }
 *
 * Time Complexity: O(n) for data extraction
 * Space Complexity: O(k) where k = unique tags
 */
export function useTags() {
  const { works, loading } = useWorks();

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const work of works) {
      for (const tag of work.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [works]);

  return { tags, loading };
}

// ============================================================
// 数据预加载
// ============================================================

/**
 * 预加载所有关键数据
 * @description 在应用初始化时调用，提前加载关键数据
 *
 * Time Complexity: O(n) parallel fetch
 * Space Complexity: O(n) for cached responses
 */
export function usePreloadData() {
  const { works, loading: worksLoading } = useWorks();
  const { profile, loading: profileLoading } = useProfile();
  const { config, loading: configLoading } = useSiteConfig();

  const loading = worksLoading || profileLoading || configLoading;
  const ready = !loading && works.length > 0 && profile && config;

  return {
    ready,
    loading,
    works,
    profile,
    config,
  };
}
