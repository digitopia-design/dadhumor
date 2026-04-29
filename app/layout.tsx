import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { CookieBanner } from "@/components/CookieBanner";
import { ogImageUrl } from "@/lib/url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Dad Humor — Professionally unfunny since 2026.",
    template: "%s — Dad Humor",
  },
  description: "One dad joke at a time. Tap to reveal, swipe to react.",
  metadataBase: new URL("https://dadhumor.app"),
  openGraph: {
    title: "Dad Humor — Professionally unfunny since 2026.",
    description: "One dad joke at a time. Tap to reveal, swipe to react.",
    url: "https://dadhumor.app",
    siteName: "Dad Humor",
    type: "website",
    images: [
      {
        url: ogImageUrl(),
        width: 1200,
        height: 630,
        alt: "Dad Humor — the dad joke app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dad Humor — Professionally unfunny since 2026.",
    description: "One dad joke at a time. Tap to reveal, swipe to react.",
    images: [ogImageUrl()],
  },
  icons: {
    apple: { url: "/icon-192.png", sizes: "192x192" },
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-body text-text" suppressHydrationWarning>
        {children}
        <CookieBanner />
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
