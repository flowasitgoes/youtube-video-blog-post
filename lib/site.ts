import type { Locale } from "./types";

/** 網站標題 */
export const SITE_NAME_ZH = "Youtube 摘要博客";
export const SITE_NAME_EN = "Video Digest – YouTube Video Summary & Insight";

/** 副標 */
export const SUBTITLE_ZH = "將 YouTube 的長影片整理成結構清晰、易於閱讀的文章。";
export const SUBTITLE_EN = "Turn YouTube long videos into structured easy-to-read articles.";

export function getSiteName(lang: Locale): string {
  return lang === "en" ? SITE_NAME_EN : SITE_NAME_ZH;
}

export function getSubtitle(lang: Locale): string {
  return lang === "en" ? SUBTITLE_EN : SUBTITLE_ZH;
}
