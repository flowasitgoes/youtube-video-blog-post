/**
 * 將 data/articles/*.json 中的中文 (zh) 翻譯成英文 (en)，寫回同一檔案。
 * 使用 @vitalets/google-translate-api（免 API key）。
 *
 * 使用方式：npx tsx scripts/translate-to-en.ts
 * 可設環境變數 DRY_RUN=1 只印出會翻譯的欄位，不寫入。
 * 若遇到 429 Too Many Requests，可隔幾小時再跑，或改用 DeepL（見 docs/TRANSLATION_TOOLS.md）。
 */

import * as fs from "fs";
import * as path from "path";
import type { Article, Bilingual } from "../lib/types";

// CJS: { translate }; ESM default could be translate itself
const mod = require("@vitalets/google-translate-api");
const translateFn = typeof mod.translate === "function" ? mod.translate : mod.default;

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");
const DELAY_MS = 3500;
const MAX_CHARS_PER_REQUEST = 4500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function needsTranslation(b: Bilingual): boolean {
  const zh = (b.zh || "").trim();
  const en = (b.en || "").trim();
  if (!zh) return false;
  if (!en) return true;
  if (en === zh) return true;
  return false;
}

async function translateText(zh: string): Promise<string> {
  const trimmed = zh.trim();
  if (!trimmed) return "";
  try {
    const result = await translateFn(trimmed, { from: "zh-cn", to: "en" });
    return (result.text || trimmed) as string;
  } catch (e) {
    const err = e as Error;
    console.error("Translate error:", err.message);
    if (err.message.includes("Too Many Requests")) {
      console.error("Tip: Wait a few hours or use DeepL API (see docs/TRANSLATION_TOOLS.md).");
    }
    return trimmed;
  }
}

/** 長文分段翻譯再接起來（避免超過 API 長度限制） */
async function translateLongText(zh: string): Promise<string> {
  const trimmed = zh.trim();
  if (!trimmed) return "";
  if (trimmed.length <= MAX_CHARS_PER_REQUEST) {
    return translateText(trimmed);
  }
  const parts: string[] = [];
  const blocks = trimmed.split(/\n\n+/);
  let buf = "";
  for (const block of blocks) {
    if (buf.length + block.length + 2 > MAX_CHARS_PER_REQUEST && buf.length > 0) {
      const translated = await translateText(buf);
      parts.push(translated);
      await sleep(DELAY_MS);
      buf = block;
    } else {
      buf = buf ? buf + "\n\n" + block : block;
    }
  }
  if (buf) {
    parts.push(await translateText(buf));
    await sleep(DELAY_MS);
  }
  return parts.join("\n\n");
}

async function main(): Promise<void> {
  const dryRun = process.env.DRY_RUN === "1";
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error("Not found:", ARTICLES_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No JSON files in", ARTICLES_DIR);
    return;
  }

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const article: Article = JSON.parse(raw);

    let changed = false;

    if (needsTranslation(article.title)) {
      console.log(`[${article.slug}] Translating title...`);
      if (!dryRun) {
        article.title.en = await translateText(article.title.zh);
        await sleep(DELAY_MS);
      }
      changed = true;
    }

    if (needsTranslation(article.description)) {
      console.log(`[${article.slug}] Translating description...`);
      if (!dryRun) {
        article.description.en = await translateLongText(article.description.zh);
        await sleep(DELAY_MS);
      }
      changed = true;
    }

    for (let i = 0; i < article.sections.length; i++) {
      const sec = article.sections[i];
      if (needsTranslation(sec.title)) {
        console.log(`[${article.slug}] Section ${i + 1} title...`);
        if (!dryRun) {
          sec.title.en = await translateText(sec.title.zh);
          await sleep(DELAY_MS);
        }
        changed = true;
      }
      if (needsTranslation(sec.content)) {
        console.log(`[${article.slug}] Section ${i + 1} content...`);
        if (!dryRun) {
          sec.content.en = await translateLongText(sec.content.zh);
          await sleep(DELAY_MS);
        }
        changed = true;
      }
    }

    if (changed && !dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2), "utf-8");
      console.log("Wrote", filePath);
    } else if (changed && dryRun) {
      console.log("[DRY RUN] Would update", filePath);
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
