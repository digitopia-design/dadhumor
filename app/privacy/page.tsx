import type { Metadata } from 'next';
import { StaticPage } from '@/components/StaticPage';
import { getPageBySlug } from '@/lib/content';

export function generateMetadata(): Metadata {
  const page = getPageBySlug('privacy');
  return {
    title: page?.frontmatter.title ?? 'Privacy Policy',
    description: page?.frontmatter.description,
  };
}

export default function PrivacyPage() {
  return <StaticPage slug="privacy" />;
}
