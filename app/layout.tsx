import type { Metadata } from "next";
import "./globals.css";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  
  
  verification: {
    google: "RerALtYUPgKMiTZsN4pJ16FpqOAEs3K-s-QfmqA3h1I",
  },
  
  metadataBase: new URL("https://worldcup26.anuarnazer.com"),

  title: {
    default: "World Cup 2026 Predictor",
    template: "%s | World Cup 2026 Predictor",
  },

  description:
    "Predice los resultados del Mundial 2026, compite con otros usuarios y escala posiciones en el ranking global.",

  keywords: [
    "World Cup 2026",
    "World Cup Predictor",
    "FIFA World Cup",
    "Football Predictions",
    "Soccer Predictions",
    "Prediction League",
    "World Cup Rankings",
    "Match Predictions",
    "Mundial 2026",
    "Pronósticos Mundial",
  ],

  authors: [
    {
      name: "Agustin Anuar Nazer",
      url: "https://anuarnazer.com",
    },
  ],

  creator: "Agustin Anuar Nazer",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://worldcup26.anuarnazer.com",
  },

  openGraph: {
    title: "World Cup 2026 Predictor",
    description:
      "Predice los resultados del Mundial 2026 y compite en el ranking global.",

    url: "https://worldcup26.anuarnazer.com",
    siteName: "World Cup 2026 Predictor",
    locale: "es_AR",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "World Cup 2026 Predictor",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 Predictor",
    description:
      "Predice resultados del Mundial 2026 y compite con otros usuarios.",
    images: ["/og-image.png"],
  },

  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}