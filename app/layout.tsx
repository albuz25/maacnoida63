import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const title = "MAAC NCR | Animation, VFX, Design & Degree Courses";
const description =
  "Explore career-focused animation, VFX, graphic design, game design, UI/UX, and B.Voc Animation & VFX programs at MAAC NCR.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.maacncr.com"),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "https://www.maacncr.com",
    siteName: "MAAC NCR",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MAAC NCR creative courses preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
