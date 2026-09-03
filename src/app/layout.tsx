import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import SmoothMotion from "./components/SmoothMotion";
import "./globals.css";
import ChatBot from "./components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com",
  ),
  title: {
    default: "Orchid Interiors | Premium Interior Design in Coimbatore",
    template: "%s | Orchid Interiors",
  },
  description:
    "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Orchid Interiors",
    title: "Orchid Interiors | Premium Interior Design in Coimbatore",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
    images: [
      { url: "/images/hero-1.png", alt: "Orchid Interiors interior design" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchid Interiors | Premium Interior Design in Coimbatore",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
    images: ["/images/hero-1.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SmoothMotion />
        <ChatBot />
      </body>
    </html>
  );
}
