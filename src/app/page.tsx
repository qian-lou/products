import { Sidebar, Footer, ResizableLayout } from '@/components/layout';
import { WorkList } from '@/components/works';
import { PageTransition } from '@/components/ui';
import { getWorkList, getProfile } from '@/lib/content';
import { getServerLocale } from '@/lib/locale';
import { HomeHeader } from '@/components/works/HomeHeader';

// 内容目录路径
const contentDir = process.cwd() + '/content';

export default async function HomePage() {
  const locale = await getServerLocale();

  // 并行获取数据
  const [works, profile] = await Promise.all([
    getWorkList(contentDir, locale),
    getProfile(contentDir, locale),
  ]);

  // 共用的主内容区 JSX
  const mainContent = (
    <PageTransition>
      {/* 作品列表 */}
      <section id="works" className="mb-16 lg:mb-20">
        {/* 标题 */}
        <HomeHeader workCount={works.length} />

        <WorkList works={works} />
      </section>

      {/* 页脚 */}
      <Footer name={profile.name} />
    </PageTransition>
  );

  return (
    <>
      {/* 侧边栏（移动端顶部导航 — 由 Sidebar 内部的 lg:hidden 控制） */}
      <Sidebar profile={profile} mobileOnly />

      {/* 桌面端：带拖拽分隔条的双栏布局 */}
      <ResizableLayout sidebar={<Sidebar profile={profile} />}>
        <div className="p-6 lg:p-14 xl:p-20">
          {mainContent}
        </div>
      </ResizableLayout>

      {/* 移动端：常规全宽布局 */}
      <main className="lg:hidden w-full min-h-screen pt-[65px] p-6 bg-transparent transition-colors duration-300">
        {mainContent}
      </main>
    </>
  );
}
