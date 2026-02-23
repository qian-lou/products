import { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/content';

const contentDir = process.cwd() + '/content';

export const dynamic = 'force-static';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSiteConfig(contentDir);
  const baseUrl = config.seo.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
