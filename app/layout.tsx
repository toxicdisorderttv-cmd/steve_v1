import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import { HERO_IMAGE } from "@/lib/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Steve Beal — A Life Well Lived",
  description:
    "A tribute to Steve Beal: Whisky Hall of Fame inductee, Diageo Master of Whisky, mentor, priest, and a man of genuine spirit.",
  openGraph: {
    title: "Steve Beal — A Life Well Lived",
    description:
      "A tribute to Steve Beal: Whisky Hall of Fame inductee, Diageo Master of Whisky, mentor, priest, and a man of genuine spirit.",
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: "Steve Beal" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve Beal — A Life Well Lived",
    description:
      "A tribute to Steve Beal: Whisky Hall of Fame inductee, Diageo Master of Whisky, mentor, priest, and a man of genuine spirit.",
    images: [HERO_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)" }}>
        <WelcomeOverlay />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
