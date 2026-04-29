import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';
import { getPageBySlug } from '@/lib/content';

export function generateMetadata(): Metadata {
  const page = getPageBySlug('terms');
  return {
    title: page?.frontmatter.title ?? 'Terms of Service',
    description: page?.frontmatter.description,
  };
}

export default function TermsPage() {
  return <StaticPage slug="terms" />;
}
