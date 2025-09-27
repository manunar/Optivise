import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/frontend/components/providers/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optivise - Développement Web Premium",
  description: "Solutions web haut de gamme pour entreprises exigeantes. Performance, design et conversion au service de votre croissance.",
  keywords: "développement web, site internet, e-commerce, application web, performance, SEO, conversion",
  authors: [{ name: "Optivise" }],
  creator: "Optivise",
  publisher: "Optivise",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://optivise.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Optivise - Développement Web Premium",
    description: "Solutions web haut de gamme pour entreprises exigeantes. Performance, design et conversion au service de votre croissance.",
    url: 'https://optivise.fr',
    siteName: 'Optivise',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Optivise - Développement Web Premium",
    description: "Solutions web haut de gamme pour entreprises exigeantes. Performance, design et conversion au service de votre croissance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
