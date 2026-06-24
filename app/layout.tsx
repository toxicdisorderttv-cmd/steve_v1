import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WelcomeOverlay from "@/components/WelcomeOverlay";

export const metadata: Metadata = {
  title: "Steve Beal — A Life Well Lived",
  description:
    "A tribute to Steve Beal: Whisky Hall of Fame inductee, Diageo Master of Whisky, mentor, priest, and a man of genuine spirit.",
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
