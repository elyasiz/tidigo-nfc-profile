import type { Metadata } from 'next';
import './globals.css';

const title = 'TIDIGO NFC Profile';
const description = 'Satu sentuhan, satu cerita kreatif. Buat profil aman untuk karya NFC murid TIDIGO.';
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = productionHost ? `https://${productionHost}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: '%s' },
  description,
  icons: { icon: '/favicon.svg' },
  openGraph: { title, description, type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'TIDIGO NFC Profile' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}

