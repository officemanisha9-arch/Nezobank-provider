// Frontend-only mock data layer. Everything is persisted to localStorage
// via the storage helpers below - there is no backend or network request.
import { delay, readStore, slugify, uid, writeStore } from "./storage";
import { SEED_ARTICLES } from "./seed-data";

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
};

const KEY = "articles";

function readArticles(): Article[] {
  return readStore<Article[]>(KEY, SEED_ARTICLES);
}

function writeArticles(articles: Article[]): void {
  writeStore(KEY, articles);
}

export async function listArticles(): Promise<Article[]> {
  await delay();
  return readArticles();
}

export type ArticleInput = Omit<Article, "id" | "slug">;

export async function createArticle(input: ArticleInput): Promise<Article> {
  await delay();
  const article: Article = { ...input, id: uid(), slug: slugify(input.title) };
  const articles = [article, ...readArticles()];
  writeArticles(articles);
  return article;
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  await delay();
  const articles = readArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Article not found");

  const updated: Article = { ...articles[index], ...input, id, slug: slugify(input.title) };
  articles[index] = updated;
  writeArticles(articles);
  return updated;
}

export async function deleteArticle(id: string): Promise<void> {
  await delay();
  writeArticles(readArticles().filter((a) => a.id !== id));
}
