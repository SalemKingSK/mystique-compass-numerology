import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import CosmicNebula from '@/components/cosmic-nebula';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Mystique Co. – Numerology & Astrology',
  description: 'Personalized insights from Numerology, Astrology & Chinese Zodiac',
  manifest: '/manifest.json',
  themeColor: '#ff00ff',
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
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff00ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mystique" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body antialiased">
        <CosmicNebula />
        <ServiceWorkerRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
