import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Climbix Marketing Agency — AI-Powered Growth Systems",
  description:
    "Climbix Marketing Agency helps brands scale with AI-powered digital marketing, performance advertising, SEO, lead generation, and business automation. Systems > Services.",
  keywords: [
    "Climbix",
    "Marketing Agency",
    "Digital Marketing",
    "AI Marketing",
    "SEO Services",
    "Lead Generation",
    "Business Automation",
    "Performance Marketing",
  ],
  authors: [{ name: "Climbix Marketing Agency" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Climbix Marketing Agency — AI-Powered Growth Systems",
    description:
      "Build smarter. Grow faster. Partner with an AI-powered marketing agency driving measurable business growth.",
    url: "https://climbix.agency",
    siteName: "Climbix Marketing Agency",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Climbix Marketing Agency",
    description: "AI-powered growth systems for modern brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
