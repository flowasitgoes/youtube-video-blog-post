import Link from "next/link";
import { getArticles } from "@/lib/getArticles";
import LanguageSwitch from "@/components/LanguageSwitch";
import {
  getSiteName,
  getSubtitle,
  META_DESCRIPTION_ZH,
  META_DESCRIPTION_EN,
} from "@/lib/site";
import type { Locale } from "@/lib/types";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

function getLang(searchParams: { lang?: string }): Locale {
  const lang = searchParams?.lang;
  return lang === "en" ? "en" : "zh";
}

export async function generateMetadata({ searchParams }: Props) {
  const resolved = await searchParams;
  const lang = getLang(resolved);
  const siteName = getSiteName(lang);
  const listTitle = lang === "zh" ? "文章列表" : "Articles";
  const description = lang === "zh" ? META_DESCRIPTION_ZH : META_DESCRIPTION_EN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
  const url = `${siteUrl}/blog${lang === "zh" ? "" : "?lang=en"}`;
  const ogImage = `${siteUrl}/icons/video-digest-1200x630.jpg`;
  return {
    title: `${listTitle} | ${siteName}`,
    description,
    openGraph: {
      title: `${listTitle} | ${siteName}`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listTitle} | ${siteName}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const lang = getLang(resolved);
  const articles = getArticles(lang);
  const siteName = getSiteName(lang);

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-neutral-950 sm:px-6">
      <div className="mx-auto max-w-[42rem]">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              {siteName}
            </Link>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              {getSubtitle(lang)}
            </p>
          </div>
          <LanguageSwitch />
        </header>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {lang === "zh" ? "文章列表" : "Articles"}
        </h1>
        <ul className="space-y-4">
          {articles.length === 0 ? (
            <li className="text-neutral-500 dark:text-neutral-400">
              {lang === "zh" ? "暫無文章" : "No articles yet."}
            </li>
          ) : (
            articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}?lang=${lang}`}
                  className="flex gap-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 transition hover:border-neutral-300 hover:bg-neutral-100/80 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80"
                >
                  <div className="relative h-20 w-[142px] shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                    {a.videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg`}
                        alt=""
                        className="h-full w-full object-cover"
                        width={320}
                        height={180}
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-2xl text-neutral-400 dark:text-neutral-500"
                        aria-hidden
                      >
                        📄
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {a.title[lang] || a.title.zh}
                      </h2>
                      {a.addedAt ? (
                        <div className="shrink-0 text-right text-xs text-neutral-500 dark:text-neutral-400">
                          <time dateTime={a.addedAt}>{a.addedAt}</time>
                          <div className="text-neutral-400 dark:text-neutral-500">added</div>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {a.description[lang] || a.description.zh}
                    </p>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
