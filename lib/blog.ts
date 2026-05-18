// ブログ記事の読み込み（Markdown + Frontmatter）
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;          // "YYYY-MM-DD"
  category: string;
  tags: string[];
  cover_image: string | null;
}

export interface BlogPost extends BlogPostMeta {
  body_html: string;
  body_md: string;
}

function readPostFile(filename: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, "");

  return {
    slug,
    title: (data.title as string) ?? slug,
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? "1970-01-01",
    category: (data.category as string) ?? "other",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    cover_image: (data.cover_image as string | null) ?? null,
    body_md: content,
    body_html: marked.parse(content, { async: false }) as string,
  };
}

export function getAllBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((f) => readPostFile(f))
    .filter((p): p is BlogPost => p !== null)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      category: p.category,
      tags: p.tags,
      cover_image: p.cover_image,
    }));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return readPostFile(`${slug}.md`);
}

export function allBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}
