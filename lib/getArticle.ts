import * as fs from "fs";
import * as path from "path";
import type { Article } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");

export function getArticle(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}
