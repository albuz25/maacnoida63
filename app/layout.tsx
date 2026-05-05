import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MAAC | VFX, Animation, Graphic Design, Game Design, UI/UX & BVoc",
  description:
    "Join MAAC Sector 63, Noida for career-focused VFX, animation, graphic design, game design, UI/UX, and B.Voc Animation & VFX courses near H-Block, Film City, and NCR's creative studios.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MAAC Creative Courses",
    description:
      "Master VFX, animation, graphic design, game design, UI/UX, and B.Voc Animation & VFX with industry-led creative courses.",
    type: "website",
    locale: "en_IN",
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
