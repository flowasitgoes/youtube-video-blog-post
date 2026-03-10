import Link from "next/link";
import { getArticles } from "@/lib/getArticles";
import LanguageSwitch from "@/components/LanguageSwitch";
import type { Locale } from "@/lib/types";

const SITE_NAME = "YouTube 摘要博客";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

function getLang(searchParams: { lang?: string }): Locale {
  const lang = searchParams?.lang;
  return lang === "en" ? "en" : "zh";
}

export default async function BlogPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const lang = getLang(resolved);
  const articles = getArticles(lang);

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-neutral-950 sm:px-6">
      <div className="mx-auto max-w-[42rem]">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            {SITE_NAME}
          </Link>
          <LanguageSwitch />
        </header>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {lang === "zh" ? "文章列表" : "Articles"}
        </h1>
        <ul className="space-y-4">
          {articles.length === 0 ? (
            <li className="text-neutral-500 dark:text-neutral-400">
              {lang === "zh" ? "暂无文章" : "No articles yet."}
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
