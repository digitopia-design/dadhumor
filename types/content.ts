export const ARTICLE_CATEGORIES = ['data', 'guides', 'press', 'brand', 'jokes'] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated: string;
  author: string;
  category: ArticleCategory;
  tags: string[];
  ogImage?: string;
  featured: boolean;
  draft: boolean;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: string;
}

export interface PageFrontmatter {
  title: string;
  slug: string;
  description: string;
  updated: string;
}

export interface Page {
  frontmatter: PageFrontmatter;
  content: string;
}
