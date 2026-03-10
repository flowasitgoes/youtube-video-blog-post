import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle } from "@/lib/getArticle";
import { getArticles } from "@/lib/getArticles";
import ArticleLayout from "@/components/ArticleLayout";
import SectionBlock from "@/components/SectionBlock";
import LanguageSwitch from "@/components/LanguageSwitch";
import { getSiteName } from "@/lib/site";
import type { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

function getLang(searchParams: { lang?: string }): Locale {
  const lang = searchParams?.lang;
  return lang === "en" ? "en" : "zh";
}

export async function generateStaticParams() {
  const zhArticles = getArticles("zh");
  const enArticles = getArticles("en");
  const slugs = new Set([...zhArticles.map((a) => a.slug), ...enArticles.map((a) => a.slug)]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolved = await searchParams;
  const lang = getLang(resolved);
  const article = getArticle(slug, lang);
  const siteName = getSiteName(lang);
  if (!article) return { title: siteName };
  const title = article.title[lang] || article.title.zh;
  const description = article.description[lang] || article.description.zh;
  const url = `https://yoursite.com/blog/${slug}?lang=${lang}`;
  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
    },
  };
}

export default async function BlogSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolved = await searchParams;
  const lang = getLang(resolved);
  const article = getArticle(slug, lang);
  if (!article) notFound();

  const title = article.title[lang] || article.title.zh;
  const description = article.description[lang] || article.description.zh;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:px-6">
        <div className="mx-auto flex max-w-[42rem] items-center justify-between">
          <Link
            href="/blog"
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {getSiteName(lang)}
          </Link>
          <LanguageSwitch />
        </div>
      </header>
      <ArticleLayout
        title={title}
        description={description}
        videoId={article.videoId}
        lang={lang}
        videoMeta={
          article.videoTitle ||
          article.channelTitle ||
          article.viewCount ||
          article.likeCount ||
          article.channelSubscriberCount ||
          article.publishedAt ||
          article.videoDescription
            ? {
                videoTitle: article.videoTitle,
                channelTitle: article.channelTitle,
                viewCount: article.viewCount,
                likeCount: article.likeCount,
                channelSubscriberCount: article.channelSubscriberCount,
                publishedAt: article.publishedAt,
                videoDescription: article.videoDescription,
              }
            : undefined
        }
      >
        {article.sections.map((section, i) => (
          <SectionBlock
            key={i}
            title={section.title[lang] || section.title.zh}
            content={section.content[lang] || section.content.zh}
          />
        ))}
      </ArticleLayout>
    </main>
  );
}
