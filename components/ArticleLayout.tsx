import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";

export type VideoMeta = {
  videoTitle?: string;
  channelTitle?: string;
  viewCount?: string;
  likeCount?: string;
  channelSubscriberCount?: string;
  publishedAt?: string;
  videoDescription?: string;
};

type ArticleLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  videoId?: string;
  videoMeta?: VideoMeta;
  lang?: Locale;
  /** 文章標籤，顯示於文末，供 SEO 與分類 */
  tags?: string[];
};

function formatCount(n: string): string {
  if (/[KkMm萬]/.test(n)) return n;
  const num = parseInt(n, 10);
  if (Number.isNaN(num)) return n;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

function formatPublishedAt(publishedAt: string, lang: Locale): string {
  const raw = publishedAt.trim();
  if (/^\d{4}-\d{2}/.test(raw)) {
    try {
      const d = new Date(publishedAt);
      return d.toLocaleDateString(lang === "zh" ? "zh-TW" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return publishedAt;
    }
  }
  if (lang === "zh") {
    const days = raw.match(/^(\d+)\s*days?\s*ago$/i);
    if (days) return `${days[1]} 天前`;
    const weeks = raw.match(/^(\d+)\s*weeks?\s*ago$/i);
    if (weeks) return `${weeks[1]} 週前`;
    const months = raw.match(/^(\d+)\s*months?\s*ago$/i);
    if (months) return `${months[1]} 個月前`;
    const years = raw.match(/^(\d+)\s*years?\s*ago$/i);
    if (years) return `${years[1]} 年前`;
  }
  return publishedAt;
}

export default function ArticleLayout({
  children,
  title,
  description,
  videoId,
  videoMeta,
  lang = "zh",
  tags,
}: ArticleLayoutProps) {
  const hasMeta =
    videoMeta &&
    (videoMeta.videoTitle ||
      videoMeta.channelTitle ||
      videoMeta.viewCount ||
      videoMeta.likeCount ||
      videoMeta.channelSubscriberCount ||
      videoMeta.publishedAt ||
      videoMeta.videoDescription);

  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 py-10 sm:px-8">
      {videoId && (
        <div className="mb-8 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube 影片"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {hasMeta && (
            <div className="px-4 pb-4 pt-3">
              {/* 影片標題 - YouTube 風格大標 */}
              {videoMeta.videoTitle && (
                <h2 className="text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                  {videoMeta.videoTitle}
                </h2>
              )}
              {/* 第二列：左側頻道資訊、右側互動按鈕 */}
              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-700" aria-hidden>
                    🥰
                  </div>
                  <div className="min-w-0">
                    {videoMeta.channelTitle && (
                      <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                        {videoMeta.channelTitle}
                      </p>
                    )}
                    {videoMeta.channelSubscriberCount != null && videoMeta.channelSubscriberCount !== "" && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatCount(videoMeta.channelSubscriberCount)} {lang === "zh" ? "位訂閱者" : "subscribers"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {videoMeta.likeCount != null && videoMeta.likeCount !== "" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                      <span aria-hidden>👍</span>
                      {formatCount(videoMeta.likeCount)}
                    </span>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  >
                    <span aria-hidden>↗</span>
                    {lang === "zh" ? "分享" : "Share"}
                  </a>
                </div>
              </div>
              {/* 觀看次數、日期與描述 - 灰底資訊區 */}
              <div className="mt-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                  {(videoMeta.viewCount != null && videoMeta.viewCount !== "") && (
                    <span>
                      {lang === "zh" ? "觀看次數：" : "Views: "}
                      {formatCount(videoMeta.viewCount)}
                      {lang === "zh" ? " 次" : " times"}
                    </span>
                  )}
                  {videoMeta.publishedAt && (
                    <span className="ml-auto">{formatPublishedAt(videoMeta.publishedAt, lang)}</span>
                  )}
                </div>
                {videoMeta.videoDescription && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {videoMeta.videoDescription}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {(title || description) && (
        <header className="mb-10 space-y-4">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </header>
      )}
      <div className="space-y-10 text-[17px] leading-[1.8] text-neutral-800 dark:text-neutral-200">
        {children}
      </div>
      {tags && tags.length > 0 && (
        <footer className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-700">
          <p className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {lang === "zh" ? "標籤" : "Tags"}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label={lang === "zh" ? "文章標籤" : "Article tags"}>
            {tags.map((tag) => (
              <li key={tag}>
                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
}
