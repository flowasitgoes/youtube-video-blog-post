import * as fs from "fs";
import * as path from "path";
import type { Article } from "./types";
import { getArticle } from "./getArticle";

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");

export function getArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const articles: Article[] = [];
  for (const file of files) {
    const slug = path.basename(file, ".json");
    const article = getArticle(slug);
    if (article) articles.push(article);
  }
  return articles.sort((a, b) => a.slug.localeCompare(b.slug));
}
