import * as fs from "fs";
import * as path from "path";
import type { Article } from "./types";
import type { Locale } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");
const ARTICLES_EN_DIR = path.join(process.cwd(), "data", "articles-en");

function getArticleDir(lang: Locale): string {
  return lang === "en" ? ARTICLES_EN_DIR : ARTICLES_DIR;
}

export function getArticle(slug: string, lang: Locale = "zh"): Article | null {
  const dir = getArticleDir(lang);
  const filePath = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    if (lang === "en") {
      return getArticle(slug, "zh");
    }
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}
