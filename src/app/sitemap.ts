import { MetadataRoute } from 'next';
import { getWorkList, getSiteConfig } from '@/lib/content';

const contentDir = process.cwd() + '/content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, config] = await Promise.all([
    getWorkList(contentDir),
    getSiteConfig(contentDir),
  ]);

  const baseUrl = config.seo.url;

  // 作品页面
  const workPages = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: new Date(work.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  return [...staticPages, ...workPages];
}
