import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { siteConfig } from '@/lib/config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo';

const titleDefault = `${siteConfig.name} — Luxury Furniture Showroom in Velachery, Chennai`;
const descLong =
  'Lavish Furniture is a 30,000 sq.ft luxury furniture showroom in Velachery, Chennai. 26+ years crafting premium carved sofas, luxury sofas, recliners, dining sets, bedroom collections, wardrobes & more. Rated by 1100+ happy customers. Visit our showroom near Phoenix Marketcity.';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: titleDefault,
    template: `%s | ${siteConfig.name} Velachery, Chennai`,
  },
  description: descLong,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Furniture',
  alternates: { canonical: '/' },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: titleDefault,
    description: descLong,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — Velachery, Chennai` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: titleDefault,
    description: descLong,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  // Add your Google Search Console token here once you verify the site:
  // verification: { google: 'YOUR_TOKEN' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FDFBF6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en-IN">
      <body>
        {isAdmin ? (
          <main>{children}</main>
        ) : (
          <>
            <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
            <SmoothScroll>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SmoothScroll>
          </>
        )}
      </body>
    </html>
  );
}
