import * as fs from "fs";
import * as path from "path";
import type { Article, Bilingual, Section } from "../lib/types";

type YouTubeMeta = {
  videoTitle?: string;
  channelTitle?: string;
  viewCount?: string;
  likeCount?: string;
  channelSubscriberCount?: string;
  publishedAt?: string;
  videoDescription?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_DIR = path.join(process.cwd(), "data", "articles");

function slugFromFilename(filename: string): string {
  const base = path.basename(filename, ".txt");
  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "");
}

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function parseBilingualField(
  value: string,
  fallbackToSame = false
): Bilingual {
  const trimmed = value.trim();
  if (fallbackToSame) {
    return { zh: trimmed, en: trimmed };
  }
  return { zh: trimmed, en: trimmed || "" };
}

/** 從 VIDEO_ID: 或 YOUTUBE: URL 取出影片 ID */
function extractVideoId(line: string): string | null {
  const t = line.trim();
  const vidMatch = t.match(/^VIDEO_ID:\s*(.+)$/i);
  if (vidMatch) return vidMatch[1].trim() || null;
  const urlMatch = t.match(/^YOUTUBE:\s*(.+)$/i);
  if (urlMatch) {
    const url = urlMatch[1].trim();
    const v = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return v ? v[1] : null;
  }
  return null;
}

/** 從 VIDEO_ID 區塊後的選用欄位讀取影片/頻道資訊（手動填寫） */
function parseVideoMetaLine(line: string): Partial<YouTubeMeta> | null {
  const t = line.trim();
  const m = t.match(/^(CHANNEL_SUBSCRIBERS|VIDEO_LIKES|VIEWS|PUBLISHED):\s*(.*)$/i);
  if (!m) return null;
  const key = m[1].toUpperCase();
  const value = m[2].trim();
  if (key === "CHANNEL_SUBSCRIBERS") return { channelSubscriberCount: value };
  if (key === "VIDEO_LIKES") return { likeCount: value };
  if (key === "VIEWS") return { viewCount: value };
  if (key === "PUBLISHED") return { publishedAt: value };
  return null;
}

/** 是否為「編號小節」標題行，例如 "1. 一切的開始" 或 "18. AI 對開源的衝擊" */
const NUMBERED_SECTION_RE = /^\d+\.\s+.+/;

/**
 * 解析「編號小節」格式的 TXT：
 * - 第 1 行 = 英文標題，第 2 行 = 中文標題
 * - 接著一段簡介（到第一個 "N. " 為止）= description
 * - 之後每一行 "N. 標題" 開始一個 section，內容到下一條 "N. " 或結尾
 */
function parseTxtNumberedFormat(content: string): Omit<Article, "slug"> {
  const lines = content.split(/\r?\n/);
  let videoId: string | undefined;
  let videoMetaFromTxt: Partial<YouTubeMeta> = {};
  let titleEn = "";
  let titleZh = "";
  let descZh = "";
  const sections: Section[] = [];
  let i = 0;

  while (i < lines.length && !lines[i].trim()) i++;
  if (i >= lines.length)
    return { title: { zh: "", en: "" }, description: { zh: "", en: "" }, sections: [] };

  const first = lines[i].trim();
  if (first.startsWith("VIDEO_ID:") || first.startsWith("YOUTUBE:")) {
    const id = extractVideoId(lines[i]);
    if (id) videoId = id;
    i++;
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length)
      return {
        title: { zh: "", en: "" },
        description: { zh: "", en: "" },
        sections: [],
        ...(videoId && { videoId }),
      };
    let videoMetaFromTxtLocal: Partial<YouTubeMeta> = {};
    while (i < lines.length) {
      const meta = parseVideoMetaLine(lines[i]);
      if (meta) {
        videoMetaFromTxtLocal = { ...videoMetaFromTxtLocal, ...meta };
        i++;
        continue;
      }
      if (lines[i].trim() !== "") break;
      i++;
    }
    videoMetaFromTxt = videoMetaFromTxtLocal;
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length)
      return {
        title: { zh: "", en: "" },
        description: { zh: "", en: "" },
        sections: [],
        ...(videoId && { videoId }),
        ...videoMetaFromTxt,
      };
  }

  titleEn = lines[i].trim();
  i++;
  while (i < lines.length && !lines[i].trim()) i++;
  if (i >= lines.length)
    return {
      title: { zh: titleEn, en: titleEn },
      description: { zh: "", en: "" },
      sections: [],
      ...(videoId && { videoId }),
      ...videoMetaFromTxt,
    };

  titleZh = lines[i].trim();
  i++;

  const descLines: string[] = [];
  while (i < lines.length && !NUMBERED_SECTION_RE.test(lines[i])) {
    descLines.push(lines[i]);
    i++;
  }
  descZh = descLines.join("\n").trim();
  const description = parseBilingualField(descZh, true);

  while (i < lines.length) {
    const head = lines[i];
    if (!NUMBERED_SECTION_RE.test(head)) {
      i++;
      continue;
    }
    const sectionTitle = head.trim();
    i++;
    const contentLines: string[] = [];
    while (i < lines.length && !NUMBERED_SECTION_RE.test(lines[i])) {
      contentLines.push(lines[i]);
      i++;
    }
    const sectionContent = contentLines.join("\n").trim();
    sections.push({
      title: parseBilingualField(sectionTitle, true),
      content: parseBilingualField(sectionContent, true),
    });
  }

  return {
    title: { zh: titleZh, en: titleEn },
    description,
    sections,
    ...(videoId && { videoId }),
    ...videoMetaFromTxt,
  };
}

function parseTxt(content: string): Omit<Article, "slug"> {
  const trimmedStart = content.trimStart();
  const firstLine = trimmedStart.split(/\r?\n/)[0] ?? "";
  if (firstLine.startsWith("TITLE:") || firstLine.startsWith("#")) {
    return parseTxtLegacy(content);
  }
  return parseTxtNumberedFormat(content);
}

function parseTxtLegacy(content: string): Omit<Article, "slug"> {
  const lines = content.split(/\r?\n/);
  let titleZh = "";
  let titleEn = "";
  let descZh = "";
  let descEn = "";
  let videoId: string | undefined;
  let channelSubscriberCount: string | undefined;
  let likeCount: string | undefined;
  let viewCount: string | undefined;
  let publishedAt: string | undefined;
  const sections: Section[] = [];
  let i = 0;

  const takeUntilNextKeyword = (): string[] => {
    const buf: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      if (
        line.startsWith("TITLE:") ||
        line.startsWith("TITLE_EN:") ||
        line.startsWith("DESCRIPTION:") ||
        line.startsWith("DESCRIPTION_EN:") ||
        line.startsWith("VIDEO_ID:") ||
        line.startsWith("YOUTUBE:") ||
        line.startsWith("CHANNEL_SUBSCRIBERS:") ||
        line.startsWith("VIDEO_LIKES:") ||
        line.startsWith("VIEWS:") ||
        line.startsWith("PUBLISHED:") ||
        line.startsWith("#")
      ) {
        break;
      }
      buf.push(line);
      i++;
    }
    return buf;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("VIDEO_ID:") || line.startsWith("YOUTUBE:")) {
      const id = extractVideoId(line);
      if (id) videoId = id;
      i++;
      continue;
    }
    if (line.startsWith("CHANNEL_SUBSCRIBERS:")) {
      channelSubscriberCount = line.replace(/^CHANNEL_SUBSCRIBERS:\s*/i, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("VIDEO_LIKES:")) {
      likeCount = line.replace(/^VIDEO_LIKES:\s*/i, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("VIEWS:")) {
      viewCount = line.replace(/^VIEWS:\s*/i, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("PUBLISHED:")) {
      publishedAt = line.replace(/^PUBLISHED:\s*/i, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("TITLE:")) {
      titleZh = line.replace(/^TITLE:\s*/, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("TITLE_EN:")) {
      titleEn = line.replace(/^TITLE_EN:\s*/, "").trim();
      i++;
      continue;
    }
    if (line.startsWith("DESCRIPTION:")) {
      i++;
      descZh = takeUntilNextKeyword().join("\n").trim();
      continue;
    }
    if (line.startsWith("DESCRIPTION_EN:")) {
      i++;
      descEn = takeUntilNextKeyword().join("\n").trim();
      continue;
    }
    if (line.startsWith("#")) {
      const sectionTitle = line.replace(/^#\s*/, "").trim();
      i++;
      const contentLines = takeUntilNextKeyword();
      const sectionContent = contentLines.join("\n").trim();
      sections.push({
        title: parseBilingualField(sectionTitle, true),
        content: parseBilingualField(sectionContent, true),
      });
      continue;
    }
    i++;
  }

  return {
    title: { zh: titleZh, en: titleEn || titleZh },
    description: { zh: descZh, en: descEn || descZh },
    sections,
    ...(videoId && { videoId }),
    ...(channelSubscriberCount && { channelSubscriberCount }),
    ...(likeCount && { likeCount }),
    ...(viewCount && { viewCount }),
    ...(publishedAt && { publishedAt }),
  };
}

function parseFile(filePath: string): Article {
  const content = fs.readFileSync(filePath, "utf-8");
  const slug = slugFromFilename(path.basename(filePath));
  const parsed = parseTxt(content);
  return { slug, ...parsed };
}

/** 使用 YouTube Data API v3 擷取影片資訊（需設定 YOUTUBE_API_KEY） */
async function fetchYouTubeMetaWithApi(videoId: string): Promise<YouTubeMeta | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${key}`;
  try {
    const videoRes = await fetch(videoUrl);
    const videoData = (await videoRes.json()) as {
      items?: Array<{
        snippet?: {
          title?: string;
          channelTitle?: string;
          channelId?: string;
          publishedAt?: string;
          description?: string;
        };
        statistics?: { viewCount?: string; likeCount?: string };
      }>;
    };
    const item = videoData?.items?.[0];
    if (!item) return null;
    const sn = item.snippet;
    const stat = item.statistics;
    const channelId = sn?.channelId;
    let channelSubscriberCount: string | undefined;
    if (channelId) {
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${key}`;
      const channelRes = await fetch(channelUrl);
      const channelData = (await channelRes.json()) as {
        items?: Array<{ statistics?: { subscriberCount?: string } }>;
      };
      channelSubscriberCount = channelData?.items?.[0]?.statistics?.subscriberCount;
    }
    const desc = sn?.description;
    return {
      videoTitle: sn?.title,
      channelTitle: sn?.channelTitle,
      viewCount: stat?.viewCount,
      likeCount: stat?.likeCount,
      channelSubscriberCount,
      publishedAt: sn?.publishedAt,
      videoDescription: desc ? desc.slice(0, 300) + (desc.length > 300 ? "…" : "") : undefined,
    };
  } catch {
    return null;
  }
}

/** 使用 oEmbed 擷取標題與頻道（不需 API key） */
async function fetchYouTubeMetaWithOEmbed(videoId: string): Promise<YouTubeMeta | null> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url);
    const data = (await res.json()) as { title?: string; author_name?: string };
    return {
      videoTitle: data.title ?? undefined,
      channelTitle: data.author_name ?? undefined,
    };
  } catch {
    return null;
  }
}

async function fetchYouTubeMeta(videoId: string): Promise<YouTubeMeta> {
  const withApi = await fetchYouTubeMetaWithApi(videoId);
  if (withApi && (withApi.videoTitle || withApi.channelTitle)) return withApi;
  const withOEmbed = await fetchYouTubeMetaWithOEmbed(videoId);
  return withOEmbed ?? {};
}

async function main(): Promise<void> {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error("Content directory not found:", CONTENT_DIR);
    process.exit(1);
  }
  ensureOutputDir();
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".txt"));
  if (files.length === 0) {
    console.log("No .txt files found in", CONTENT_DIR);
    return;
  }
  for (const file of files) {
    const fullPath = path.join(CONTENT_DIR, file);
    const stat = fs.statSync(fullPath);
    let article = parseFile(fullPath);
    article = { ...article, addedAt: stat.mtime.toISOString().slice(0, 10) };
    const txtMeta: Partial<YouTubeMeta> = {};
    if (article.channelSubscriberCount) txtMeta.channelSubscriberCount = article.channelSubscriberCount;
    if (article.likeCount) txtMeta.likeCount = article.likeCount;
    if (article.viewCount) txtMeta.viewCount = article.viewCount;
    if (article.publishedAt) txtMeta.publishedAt = article.publishedAt;
    if (article.videoId) {
      process.stdout.write(`Fetching YouTube meta for ${article.slug} (${article.videoId})... `);
      const meta = await fetchYouTubeMeta(article.videoId);
      article = { ...article, ...meta, ...txtMeta };
      console.log(meta.videoTitle || Object.keys(txtMeta).length ? "OK" : "no data");
    }
    const outPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(article, null, 2), "utf-8");
    console.log("Wrote", outPath);
  }
  console.log(`Parsed ${files.length} file(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
