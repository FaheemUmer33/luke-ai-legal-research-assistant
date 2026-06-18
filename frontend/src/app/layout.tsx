import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Law AI Solutions | From Case Files to Case Wins, Faster",
  description:
    "Law AI Solutions builds premium AI automation systems for legal research, contract review, e-discovery support, compliance monitoring, and legal operations.",
  keywords: ["legal AI", "law automation", "contract intelligence", "legal research AI", "legal operations"],
  openGraph: {
    title: "Law AI Solutions",
    description: "From case files to case wins, faster. Premium AI automation systems for modern legal teams.",
    type: "website",
    images: [{ url: "/images/law-ai/hero-law-office.jpg", width: 1800, height: 1200, alt: "Modern law office at night" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Law AI Solutions",
    description: "Premium legal AI automation for research, contracts, compliance, and operations.",
    images: ["/images/law-ai/hero-law-office.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
