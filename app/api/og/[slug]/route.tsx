import { ImageResponse } from 'next/og';
import { getJokeBySlug } from '@/lib/jokes';

// Node.js runtime - Supabase client is not edge-compatible
export const runtime = 'nodejs';

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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dadhumor.app';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
      return new ImageResponse(<DefaultCard />, { width: 1200, height: 630, fonts });
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
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'SpaceGrotesk', fontWeight: 700, fontSize: 30, color: '#E3FF00' }}>
            Dad Humor
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: 22, color: '#333333', textTransform: 'uppercase', letterSpacing: '3px' }}>
            {category}
          </span>
        </div>

        {/* Joke */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1, justifyContent: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 40, color: '#A0A0A0', margin: 0, lineHeight: 1.4, maxWidth: '1000px' }}>
            {joke.setup}
          </p>
          <div style={{ display: 'flex', width: '64px', height: '4px', background: '#E3FF00', borderRadius: '2px' }} />
          <p style={{ fontFamily: 'SpaceGrotesk', fontWeight: 700, fontSize: 58, color: '#E3FF00', margin: 0, lineHeight: 1.15, maxWidth: '1000px' }}>
            {joke.punchline}
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 22, color: '#555555' }}>
            Tap to react · {BASE_URL.replace('https://', '')}
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 22, color: '#555555' }}>🤝 Props</span>
            <span style={{ fontFamily: 'Inter', fontSize: 22, color: '#555555' }}>😩 Groan</span>
          </div>
        </div>
      </div>,
      { width: 1200, height: 630, fonts }
    );
  } catch (err) {
    console.error('OG image error:', err);
    return new ImageResponse(<DefaultCard />, { width: 1200, height: 630 });
  }
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
        gap: '20px',
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 700, color: '#E3FF00', letterSpacing: '-1px', fontFamily: 'sans-serif' }}>
        DAD HUMOR
      </span>
      <span style={{ fontSize: 60, fontWeight: 700, color: '#FFFFFF', fontFamily: 'sans-serif', textAlign: 'center', maxWidth: '900px', lineHeight: 1.2 }}>
        Professionally unfunny since 2026.
      </span>
      <span style={{ fontSize: 24, color: '#555555', fontFamily: 'sans-serif', marginTop: '12px' }}>
        dadhumor.app
      </span>
    </div>
  );
}
