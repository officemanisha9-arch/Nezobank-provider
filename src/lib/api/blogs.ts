// Frontend-only mock data layer. Everything is persisted to localStorage
// via the storage helpers below - there is no backend or network request.
import { delay, readStore, slugify, uid, writeStore } from "./storage";
import { SEED_BLOGS } from "./seed-data";

export type Blog = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  category: string;
  premium: boolean;
  views: string;
  status: "draft" | "published";
};

const KEY = "blogs";

function readBlogs(): Blog[] {
  return readStore<Blog[]>(KEY, SEED_BLOGS);
}

function writeBlogs(blogs: Blog[]): void {
  writeStore(KEY, blogs);
}

export async function listBlogs(): Promise<Blog[]> {
  await delay();
  return readBlogs();
}

export type BlogInput = Omit<Blog, "id" | "slug" | "date" | "views"> & {
  date?: string;
};

export async function createBlog(input: BlogInput): Promise<Blog> {
  await delay();
  const blog: Blog = {
    ...input,
    id: uid(),
    slug: slugify(input.title),
    date: input.date ?? new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    views: "0",
  };
  const blogs = [blog, ...readBlogs()];
  writeBlogs(blogs);
  return blog;
}

export async function updateBlog(id: string, input: BlogInput): Promise<Blog> {
  await delay();
  const blogs = readBlogs();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Blog not found");

  const updated: Blog = {
    ...blogs[index],
    ...input,
    id,
    slug: slugify(input.title),
    date: input.date ?? blogs[index].date,
  };
  blogs[index] = updated;
  writeBlogs(blogs);
  return updated;
}

export async function deleteBlog(id: string): Promise<void> {
  await delay();
  writeBlogs(readBlogs().filter((b) => b.id !== id));
}
