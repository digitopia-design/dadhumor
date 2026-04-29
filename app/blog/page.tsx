import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Stache } from '@/components/Stache';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ArticleCard } from '@/components/ArticleCard';
import { getAllArticles, getFeaturedArticles } from '@/lib/content';
import { ARTICLE_CATEGORIES, type ArticleCategory } from '@/types/content';

export const metadata: Metadata = {
  title: 'The Archive — Dad Humor',
  description: "Long-form thoughts on dad jokes, the data behind them, and the people who tell them. Read at your own risk.",
  openGraph: {
    title: 'The Archive — Dad Humor',
    description: 'Long-form thoughts on dad jokes. Read at your own risk.',
    url: 'https://dadhumor.app/blog',
  },
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles();

  const counts = ARTICLE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = allArticles.filter(a => a.frontmatter.category === cat).length;
    return acc;
  }, {} as Record<ArticleCategory, number>);

  const isValidCategory = ARTICLE_CATEGORIES.includes(category as ArticleCategory);
  const activeCategory = isValidCategory ? (category as ArticleCategory) : null;

  const filtered = activeCategory
    ? allArticles.filter(a => a.frontmatter.category === activeCategory)
    : allArticles;

  // When filtered, don't show the featured hero (just the grid)
  const showFeatured = !activeCategory && featured.length > 0;
  const featuredArticle = featured[0];
  const gridArticles = showFeatured
    ? filtered.filter(a => a.frontmatter.slug !== featuredArticle.frontmatter.slug)
    : filtered;

  return (
    <main className="flex flex-col items-center min-h-screen">

      {/* Nav */}
      <nav className="w-full max-w-5xl flex items-center justify-between px-6 py-8">
        <Logo className="text-xl" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="font-body text-text-secondary text-sm hover:text-text transition-colors"
          >
            Jokes →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="w-full max-w-5xl px-6 py-12 flex flex-col items-start gap-6">
        <div className="flex items-end gap-4">
          <Stache mood="pointing" size="md" priority />
          <p className="font-body text-text-secondary text-sm uppercase tracking-widest pb-2">
            The Archive
          </p>
        </div>
        <h1
          className="font-display font-bold text-5xl md:text-6xl text-text leading-none"
          style={{ letterSpacing: '-0.03em' }}
        >
          Long-form for short<br />
          <span className="text-brand-yellow theme-light:bg-charcoal theme-light:px-2 theme-light:rounded-md theme-light:inline-block">
            attention spans.
          </span>
        </h1>
        <p className="font-body text-text-secondary text-lg max-w-2xl leading-relaxed">
          Data stories, guides, brand notes, and the occasional press piece.
          Everything that doesn&#39;t fit in a 200-character punchline.
        </p>
      </section>

      {/* Filters */}
      <section className="w-full max-w-5xl px-6 pb-8">
        <CategoryFilter counts={counts} total={allArticles.length} />
      </section>

      {/* Featured (only when no filter) */}
      {showFeatured && (
        <section className="w-full max-w-5xl px-6 pb-8">
          <ArticleCard article={featuredArticle} variant="featured" />
        </section>
      )}

      {/* Article grid */}
      <section className="w-full max-w-5xl px-6 pb-16">
        {gridArticles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Stache mood="shrugging" size="md" />
            <p className="font-body text-text-secondary">
              Nothing in this category yet. Check back when Stache has had more thoughts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridArticles.map(article => (
              <ArticleCard key={article.frontmatter.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-bg-border mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 max-w-5xl mx-auto">
          <Logo className="text-base" />
          <div className="flex items-center gap-6">
            <Link href="/" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Jokes
            </Link>
            <Link href="/privacy" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-body text-text-secondary text-sm hover:text-text transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
