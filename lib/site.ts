import type { Locale } from "./types";

/** 網站標題 */
export const SITE_NAME_ZH = "Youtube 摘要博客";
export const SITE_NAME_EN = "Video Digest – Youtube Summary & Insight";

/** 副標 */
export const SUBTITLE_ZH = "將 YouTube 的長影片整理成結構清晰、易於閱讀的文章。";
export const SUBTITLE_EN = "Turn YouTube long videos into structured easy-to-read articles.";

/** SEO 用 meta description（理念：幫助大家「閱讀」YouTube 影片、節省時間、吸收創作者智慧） */
export const META_DESCRIPTION_ZH =
  "Video Digest 將 YouTube 長影片整理成結構化、簡潔易讀的文章，提取重點與洞察，節省時間、吸收創作者智慧。幫助你「閱讀」YouTube 影片。";
export const META_DESCRIPTION_EN =
  "Video Digest turns long YouTube videos into structured, easy-to-read articles. Save time, learn from creators, and get key ideas and insights without watching hours of video.";

/** SEO 用關鍵字 */
export const KEYWORDS_ZH =
  "YouTube 摘要, YouTube 影片整理, Video Digest, 長影片摘要, 創作者, 演講摘要, 訪談整理, 知識學習, 影片轉文章";
export const KEYWORDS_EN =
  "YouTube summary, video digest, long video summary, creator insights, talk summary, interview notes, learn from video, video to article";

export function getSiteName(lang: Locale): string {
  return lang === "en" ? SITE_NAME_EN : SITE_NAME_ZH;
}

export function getSubtitle(lang: Locale): string {
  return lang === "en" ? SUBTITLE_EN : SUBTITLE_ZH;
}
