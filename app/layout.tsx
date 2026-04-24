import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { CookieBanner } from "@/components/CookieBanner";
import { ogImageUrl } from "@/lib/url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const clashDisplay = localFont({
  src: "../public/fonts/ClashDisplay-Bold.woff2",
  variable: "--font-clash-display",
  weight: "700",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight font-body text-white" suppressHydrationWarning>
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
