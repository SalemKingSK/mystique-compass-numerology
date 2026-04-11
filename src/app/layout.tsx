import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import CosmicNebula from '@/components/cosmic-nebula';
import { FirebaseClientProvider } from '@/firebase';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mystique Co. – Numerology & Astrology',
  description: 'Personalized insights from Numerology, Astrology & Chinese Zodiac',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mystique',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Mystique Co.",
    title: "Mystique Co. – Numerology & Astrology",
    description: "Personalized insights from Numerology, Astrology & Chinese Zodiac",
  },
  twitter: {
    card: "summary",
    title: "Mystique Co. – Numerology & Astrology",
    description: "Personalized insights from Numerology, Astrology & Chinese Zodiac",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png' }
    ],
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#a855f7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ServiceWorkerRegister />
          <CosmicNebula />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
