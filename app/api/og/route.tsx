import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

function loadFont(filename: string): ArrayBuffer {
  const fontPath = join(process.cwd(), 'public', 'fonts', filename);
  const buffer = readFileSync(fontPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const setup = searchParams.get('setup');
  const punchline = searchParams.get('punchline');
  const category = searchParams.get('category')?.replace(/-/g, ' ') ?? '';

  const boldFont = loadFont('SpaceGrotesk-Bold.woff');
  const bodyFont = loadFont('Inter-Regular.woff');

  const fonts = [
    { name: 'SpaceGrotesk', data: boldFont, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: bodyFont, weight: 400 as const, style: 'normal' as const },
  ];

  if (!setup || !punchline) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#121212',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '8px',
              height: '60px',
              background: '#E3FF00',
              borderRadius: '4px',
            }}
          />
          <span
            style={{
              fontFamily: 'SpaceGrotesk',
              fontWeight: 700,
              fontSize: 72,
              color: '#FFFFFF',
              letterSpacing: '-2px',
            }}
          >
            Dad Humor
          </span>
        </div>
        <span
          style={{
            fontFamily: 'Inter',
            fontSize: 32,
            color: '#A0A0A0',
          }}
        >
          Professionally unfunny since 2026.
        </span>
        <span
          style={{
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: 24,
            color: '#E3FF00',
            marginTop: '24px',
            letterSpacing: '1px',
          }}
        >
          dadhumor.app
        </span>
      </div>,
      { width: 1200, height: 630, fonts }
    );
  }

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
        <span
          style={{
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: 28,
            color: '#E3FF00',
          }}
        >
          Dad Humor
        </span>
        {category && (
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 20,
              color: '#444444',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            {category}
          </span>
        )}
      </div>

      {/* Joke */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flex: 1,
          justifyContent: 'center',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 42,
            color: '#A0A0A0',
            margin: 0,
            lineHeight: 1.25,
            maxWidth: '1000px',
            letterSpacing: '-0.02em',
          }}
        >
          {setup}
        </p>
        <div
          style={{
            display: 'flex',
            width: '56px',
            height: '4px',
            background: '#E3FF00',
            borderRadius: '2px',
          }}
        />
        <p
          style={{
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: 72,
            color: '#E3FF00',
            margin: 0,
            lineHeight: 1.0,
            maxWidth: '1000px',
            letterSpacing: '-0.02em',
          }}
        >
          {punchline}
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
        <span style={{ fontFamily: 'Inter', fontSize: 20, color: '#444444' }}>
          dadhumor.app
        </span>
        <span style={{ fontFamily: 'Inter', fontSize: 20, color: '#444444' }}>
          Tap to react →
        </span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts }
  );
}
