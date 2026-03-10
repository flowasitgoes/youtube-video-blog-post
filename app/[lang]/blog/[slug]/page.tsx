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
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const zhArticles = getArticles("zh");
  const enArticles = getArticles("en");
  const slugs = new Set([...zhArticles.map((a) => a.slug), ...enArticles.map((a) => a.slug)]);
  const params: { lang: string; slug: string }[] = [];
  Array.from(slugs).forEach((slug) => {
    params.push({ lang: "zh", slug });
    params.push({ lang: "en", slug });
  });
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (lang !== "zh" && lang !== "en") return {};
  const article = getArticle(slug, lang);
  const siteName = getSiteName(lang);
  if (!article) return { title: siteName };
  const title = article.title[lang] || article.title.zh;
  const description = article.description[lang] || article.description.zh;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summary.ifunlove.com";
  const path = lang === "zh" ? `/zh/blog/${slug}` : `/en/blog/${slug}`;
  const url = `${siteUrl}${path}`;
  const ogImage = article.videoId
    ? `https://img.youtube.com/vi/${article.videoId}/maxresdefault.jpg`
    : `${siteUrl}/icons/video-digest-1200x630.jpg`;
  const ogWidth = article.videoId ? 1280 : 1200;
  const ogHeight = article.videoId ? 720 : 630;
  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: article.tags && article.tags.length > 0 ? article.tags : undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      images: [{ url: ogImage, width: ogWidth, height: ogHeight, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { lang, slug } = await params;
  if (lang !== "zh" && lang !== "en") notFound();
  const article = getArticle(slug, lang);
  if (!article) notFound();

  const title = article.title[lang] || article.title.zh;
  const description = article.description[lang] || article.description.zh;
  const homeHref = lang === "zh" ? "/zh" : "/en";
  const blogHref = lang === "zh" ? "/zh/blog" : "/en/blog";

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:px-6">
        <div className="mx-auto flex max-w-[42rem] items-center justify-between gap-3">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            aria-label={lang === "zh" ? "回到主頁" : "Back to home"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <Link
            href={blogHref}
            className="min-w-0 flex-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate"
          >
            {getSiteName(lang)}
          </Link>
          <LanguageSwitch currentLang={lang} pathSuffix={`/blog/${slug}`} />
        </div>
      </header>
      <ArticleLayout
        title={title}
        description={description}
        videoId={article.videoId}
        lang={lang}
        tags={article.tags}
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
