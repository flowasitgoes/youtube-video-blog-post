import * as fs from "fs";
import * as path from "path";
import type { Article } from "./types";
import type { Locale } from "./types";
import { getArticle } from "./getArticle";

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");
const ARTICLES_EN_DIR = path.join(process.cwd(), "data", "articles-en");

export function getArticles(lang: Locale = "zh"): Article[] {
  const dir = lang === "en" ? ARTICLES_EN_DIR : ARTICLES_DIR;
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const articles: Article[] = [];
  for (const file of files) {
    const slug = path.basename(file, ".json");
    const article = getArticle(slug, lang);
    if (article) articles.push(article);
  }
  return articles.sort((a, b) => (b.addedAt ?? "").localeCompare(a.addedAt ?? "") || b.slug.localeCompare(a.slug));
}
