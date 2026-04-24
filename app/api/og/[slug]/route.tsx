import { ImageResponse } from 'next/og';
import { getJokeBySlug } from '@/lib/jokes';

export const runtime = 'edge';

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
    ).then(r => r.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('woff2'\)/)?.[1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then(r => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [joke, boldFont, bodyFont] = await Promise.all([
    getJokeBySlug(slug),
    loadGoogleFont('Space+Grotesk', 700),
    loadGoogleFont('Inter', 400),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] = [];
  if (boldFont) fonts.push({ name: 'SpaceGrotesk', data: boldFont, weight: 700, style: 'normal' });
  if (bodyFont) fonts.push({ name: 'Inter', data: bodyFont, weight: 400, style: 'normal' });

  if (!joke) {
    return new ImageResponse(
      <DefaultCard />,
      { width: 1200, height: 630, fonts }
    );
  }

  const category = joke.category.replace(/-/g, ' ');

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#121212',
        padding: '64px 72px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'SpaceGrotesk, sans-serif',
            fontWeight: 700,
            fontSize: 32,
            color: '#E3FF00',
            letterSpacing: '-0.5px',
          }}
        >
          Dad Humor
        </span>
      </div>

      {/* Joke content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1, justifyContent: 'center' }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 38,
            color: '#A0A0A0',
            margin: 0,
            lineHeight: 1.45,
            maxWidth: '900px',
          }}
        >
          {joke.setup}
        </p>
        <p
          style={{
            fontFamily: 'SpaceGrotesk, sans-serif',
            fontWeight: 700,
            fontSize: 56,
            color: '#E3FF00',
            margin: 0,
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {joke.punchline}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 20,
            color: '#333333',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          {category}
        </span>
        <span
          style={{
            fontFamily: 'SpaceGrotesk, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: '#333333',
          }}
        >
          dadhumor.app
        </span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts }
  );
}

function DefaultCard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#121212',
        gap: '24px',
        fontFamily: 'sans-serif',
      }}
    >
      <span style={{ fontSize: 80, fontWeight: 700, color: '#E3FF00' }}>
        Dad Humor
      </span>
      <span style={{ fontSize: 36, color: '#A0A0A0' }}>
        Professionally unfunny since 2026.
      </span>
      <span style={{ fontSize: 24, color: '#333333' }}>dadhumor.app</span>
    </div>
  );
}
