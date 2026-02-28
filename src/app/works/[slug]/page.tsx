import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { getWorkBySlug, getWorkList, getProfile } from '@/lib/content';
import { getServerLocale } from '@/lib/locale';
import { formatDate } from '@/lib/utils';
import { Sidebar, Footer, ResizableLayout } from '@/components/layout';
import { PageTransition } from '@/components/ui';
import { BackLabel, DemoLabel, SourceLabel, ReadingTime } from '@/components/works/DetailLabels';

// 内容目录路径
const contentDir = process.cwd() + '/content';

// 生成静态参数（两种语言的 slug 取并集）
export async function generateStaticParams() {
  const [enWorks, zhWorks] = await Promise.all([
    getWorkList(contentDir, 'en'),
    getWorkList(contentDir, 'zh'),
  ]);
  const slugSet = new Set([...enWorks, ...zhWorks].map((w) => w.slug));
  return Array.from(slugSet).map((slug) => ({ slug }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug, contentDir);

  if (!work) {
    return { title: 'Work Not Found' };
  }

  return {
    title: work.title,
    description: work.excerpt,
    openGraph: {
      title: work.title,
      description: work.excerpt,
      images: work.cover ? [work.cover] : [],
      type: 'article',
      publishedTime: work.date,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();

  // 并行获取数据
  const [work, profile] = await Promise.all([
    getWorkBySlug(slug, contentDir, locale),
    getProfile(contentDir, locale),
  ]);

  if (!work) {
    notFound();
  }

  // 共用的详情内容 JSX
  const detailContent = (
    <>
      {/* 返回导航 */}
      <nav className="sticky top-0 z-40 bg-slate-50/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-none mx-auto px-6 py-3 lg:py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <BackLabel />
          </Link>
        </div>
      </nav>

      <PageTransition>
        {/* 作品头部 */}
        <header className="max-w-none mx-auto px-6 pt-8 lg:pt-12 pb-6 lg:pb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {work.title}
          </h1>
          <p className="mt-3 lg:mt-4 text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {work.excerpt}
          </p>

          {/* 元信息 */}
          <div className="mt-4 lg:mt-6 flex flex-wrap items-center gap-2 lg:gap-3 text-xs lg:text-sm text-slate-500 dark:text-slate-500">
            <time dateTime={work.date}>{formatDate(work.date)}</time>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <ReadingTime minutes={work.readingTime} />
          </div>

          {/* 标签 */}
          <div className="mt-3 lg:mt-4 flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 lg:px-3 py-0.5 lg:py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 链接 */}
          {(work.demo || work.github) && (
            <div className="mt-6 lg:mt-8 flex flex-wrap gap-2 lg:gap-3">
              {work.demo && (
                <a
                  href={work.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                >
                  <ExternalLink size={16} />
                  <DemoLabel />
                </a>
              )}
              {work.github && (
                <a
                  href={work.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-white/10"
                >
                  <Github size={16} />
                  <SourceLabel />
                </a>
              )}
            </div>
          )}
        </header>

        {/* 封面图片 */}
        {work.cover && (
          <div className="max-w-none mx-auto px-6 mt-6 lg:mt-8">
            <div className="relative w-full rounded-xl lg:rounded-2xl overflow-hidden bg-slate-200/50 dark:bg-[#1E1E1E]/50 border border-slate-200 dark:border-white/10 shadow-xl lg:shadow-2xl shadow-slate-900/10 dark:shadow-black/50 flex justify-center">
              <Image
                src={work.cover}
                alt={work.title}
                width={1024}
                height={804}
                priority
                className="w-full h-auto object-contain max-h-[70vh]"
                unoptimized={true}
              />
            </div>
          </div>
        )}

        {/* Markdown 内容 */}
        <article className="max-w-none mx-auto px-6 py-8 lg:py-12">
          <div
            className="prose dark:prose-invert max-w-none prose-sm lg:prose-base"
            dangerouslySetInnerHTML={{ __html: work.content }}
          />
        </article>

        {/* 页脚 */}
        <div className="max-w-none mx-auto px-6 pb-8 lg:pb-12">
          <Footer name={profile.name} />
        </div>
      </PageTransition>
    </>
  );

  return (
    <>
      {/* 移动端顶部导航 */}
      <Sidebar profile={profile} mobileOnly />

      {/* 桌面端：带拖拽分隔条的双栏布局 */}
      <ResizableLayout sidebar={<Sidebar profile={profile} disableAnimation />}>
        {detailContent}
      </ResizableLayout>

      {/* 移动端：常规全宽布局 */}
      <main className="lg:hidden w-full min-h-screen pt-[65px] bg-transparent transition-colors duration-300">
        {detailContent}
      </main>
    </>
  );
}
