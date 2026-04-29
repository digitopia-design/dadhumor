import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getArticleBySlug } from '@/lib/content';
import type { ArticleCategory } from '@/types/content';

export const runtime = 'nodejs';

function loadFont(filename: string): ArrayBuffer {
  const fontPath = join(process.cwd(), 'public', 'fonts', filename);
  const buffer = readFileSync(fontPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

function loadImage(relativePath: string): string {
  const filePath = join(process.cwd(), 'public', relativePath);
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

const CATEGORY_STACHE: Record<ArticleCategory, string> = {
  data: '05-mind-blown.png',
  guides: '08-pointing.png',
  press: '01-smug-default.png',
  brand: '06-winking.png',
  jokes: '03-laughing.png',
};

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  data: 'Data',
  guides: 'Guides',
  press: 'Press',
  brand: 'Brand',
  jokes: 'Jokes',
};

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return new Response('Article not found', { status: 404 });
  }

  const { frontmatter, readingTime } = article;
  const stacheFile = CATEGORY_STACHE[frontmatter.category];
  const stacheSrc = loadImage(`stache/${stacheFile}`);

  const boldFont = loadFont('SpaceGrotesk-Bold.woff');
  const bodyFont = loadFont('Inter-Regular.woff');

  const fonts = [
    { name: 'SpaceGrotesk', data: boldFont, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: bodyFont, weight: 400 as const, style: 'normal' as const },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#121212',
          padding: '64px 72px',
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'SpaceGrotesk',
                fontWeight: 700,
                fontSize: 30,
                color: '#FFFFFF',
                letterSpacing: '-1px',
              }}
            >
              DAD
            </span>
            <span
              style={{
                fontFamily: 'SpaceGrotesk',
                fontWeight: 700,
                fontSize: 30,
                color: '#E3FF00',
                letterSpacing: '-1px',
              }}
            >
              HUMOR.
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: '999px',
              border: '2px solid #E3FF00',
              fontFamily: 'Inter',
              fontSize: 18,
              color: '#E3FF00',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {CATEGORY_LABELS[frontmatter.category]}
          </div>
        </div>

        {/* Body: title + Stache */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '32px',
            flex: 1,
            paddingTop: '40px',
            paddingBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <p
              style={{
                fontFamily: 'SpaceGrotesk',
                fontWeight: 700,
                fontSize: frontmatter.title.length > 70 ? 56 : frontmatter.title.length > 40 ? 68 : 80,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                maxWidth: '780px',
              }}
            >
              {frontmatter.title}
            </p>
            <div
              style={{
                display: 'flex',
                width: '64px',
                height: '4px',
                background: '#E3FF00',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stacheSrc}
            alt=""
            width={200}
            height={200}
            style={{ objectFit: 'contain', flexShrink: 0 }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #333333',
            paddingTop: '20px',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 22,
              color: '#A0A0A0',
            }}
          >
            dadhumor.app/blog
          </span>
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 22,
              color: '#A0A0A0',
            }}
          >
            {readingTime}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}
