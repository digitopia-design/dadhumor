import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';
import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategory,
  type Page,
} from '@/types/content';

const CONTENT_ROOT = join(process.cwd(), 'content');
const ARTICLES_DIR = join(CONTENT_ROOT, 'articles');
const PAGES_DIR = join(CONTENT_ROOT, 'pages');

const dateString = z
  .union([z.string(), z.date()])
  .transform(v => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const articleFrontmatterSchema = z
  .object({
    title: z.string().min(1, 'title is required'),
    slug: z.string().min(1, 'slug is required'),
    description: z.string().min(1, 'description is required'),
    date: dateString,
    updated: dateString.optional(),
    author: z.string().default('Stache'),
    category: z.enum(ARTICLE_CATEGORIES),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .transform(data => ({
    ...data,
    updated: data.updated ?? data.date,
  }));

const pageFrontmatterSchema = z.object({
  title: z.string().min(1, 'title is required'),
  slug: z.string().min(1, 'slug is required'),
  description: z.string().min(1, 'description is required'),
  updated: dateString,
});

function listMdxFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));
}

function parseArticle(file: string): Article {
  const filePath = join(ARTICLES_DIR, file);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const result = articleFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${file}:\n${result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`
    );
  }

  return {
    frontmatter: result.data,
    content,
    readingTime: readingTime(content).text,
  };
}

function parsePage(file: string): Page {
  const filePath = join(PAGES_DIR, file);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const result = pageFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${file}:\n${result.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`).join('\n')}`
    );
  }

  return { frontmatter: result.data, content };
}

const showDrafts = process.env.NODE_ENV !== 'production';

export function getAllArticles(): Article[] {
  return listMdxFiles(ARTICLES_DIR)
    .map(parseArticle)
    .filter(a => showDrafts || !a.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getArticleBySlug(slug: string): Article | null {
  const article = getAllArticles().find(a => a.frontmatter.slug === slug);
  return article ?? null;
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getAllArticles().filter(a => a.frontmatter.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter(a => a.frontmatter.tags.includes(tag));
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter(a => a.frontmatter.featured);
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map(a => a.frontmatter.slug);
}

export function getAllPages(): Page[] {
  return listMdxFiles(PAGES_DIR).map(parsePage);
}

export function getPageBySlug(slug: string): Page | null {
  const page = getAllPages().find(p => p.frontmatter.slug === slug);
  return page ?? null;
}
