import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const title = "MAAC Noida Sector 63 | 3D Animation, VFX & Gaming Courses";
const description =
  "Looking for the best animation courses in Noida or Ghaziabad? MAAC Sector 63 offers industry-leading VFX degree programs, 3D animation, and UI/UX training in Delhi NCR. 100% placement assistance.";
const keywords = [
  "Animation Degree Courses",
  "Best VFX Institute in Delhi NCR",
  "Animation Courses in Ghaziabad",
  "VFX Degree Noida",
  "MAAC Noida",
  "MAAC Ghaziabad",
  "MAAC Delhi NCR",
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MAAC Noida Sector 63",
  url: "https://www.maacncr.com",
  telephone: "08048032030",
  image: "https://www.maacncr.com/opengraph-image",
  address: {
    "@type": "PostalAddress",
    streetAddress: "H-58, H Block, Lower Ground Floor, Sector 63",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201309",
    addressCountry: "IN",
  },
  areaServed: ["Noida", "Ghaziabad", "Delhi NCR"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "MAAC Noida Sector 63 Creative Courses",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Animation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "VFX" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX" } },
    ],
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Animation, VFX, UI UX and Gaming Courses in Noida and Delhi NCR",
  itemListElement: [
    "Best 3D Animation Course in Noida",
    "Advanced VFX Degree Programs in Delhi NCR",
    "Best UI UX Course in Noida",
    "Best Game Design Course in Delhi NCR",
    "Best Interior Visualization Course in Noida",
  ].map((courseName, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Course",
      name: courseName,
      provider: {
        "@type": "EducationalOrganization",
        name: "MAAC Noida Sector 63",
        sameAs: "https://www.maacncr.com",
      },
      areaServed: ["Noida", "Ghaziabad", "Delhi NCR"],
    },
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.maacncr.com"),
  title,
  description,
  keywords,
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
        alt: "MAAC Noida Sector 63 Animation Degree and Best VFX Course Noida preview",
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
      <body className="font-sans antialiased">
        {children}
        <script
          id="local-business-course-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema, courseSchema]),
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18141074024" strategy="afterInteractive" />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18141074024');
          `}
        </Script>
      </body>
    </html>
  );
}
