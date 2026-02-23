import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { DynamicBackground } from '@/components/ui/DynamicBackground';
import { getProfile, getSiteConfig } from '@/lib/content';
import './globals.css';

// 正文字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 标题字体
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// 获取内容目录路径
const contentDir = process.cwd() + '/content';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig(contentDir);

  return {
    metadataBase: new URL(config.seo.url),
    title: {
      default: config.seo.title,
      template: `%s | ${config.seo.title.split(' - ')[0]}`,
    },
    description: config.seo.description,
    keywords: ['Portfolio', 'Full-stack Designer', 'React', 'Next.js', 'TypeScript'],
    authors: [{ name: 'Developer' }],
    creator: 'Developer',
    openGraph: {
      type: 'website',
      locale: config.seo.language === 'zh' ? 'zh_CN' : 'en_US',
      url: config.seo.url,
      title: config.seo.title,
      description: config.seo.description,
      siteName: config.seo.title,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.title,
      description: config.seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <DynamicBackground />
            <div className="relative z-10 min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-900 dark:selection:text-white transition-colors duration-300">
              {children}
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
