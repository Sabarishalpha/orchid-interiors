import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Viga } from "next/font/google";
import SmoothMotion from "./components/SmoothMotion";
import ChatBot from "./components/ChatBot";
import { ConsultationModalProvider } from "./components/ConsultationModalProvider";
import GlobalConsultationModal from "./components/GlobalConsultationModal";
import ContextMenuGuard from "./components/ContextMenuGuard";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const viga = Viga({
  variable: "--font-viga",
  subsets: ["latin"],
  weight: "400",
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Orchid Interiors | Premium Interior Design",
    template: "%s | Orchid Interiors",
  },
  description:
    "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors.",
  alternates: { canonical: siteUrl },
  icons: { icon: "/images/logo.png" },
  openGraph: {
    type: "website",
    siteName: "Orchid Interiors",
    title: "Orchid Interiors | Premium Interior Design",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors.",
    images: [
      { url: "/images/hero-1.png", alt: "Orchid Interiors interior design" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchid Interiors | Premium Interior Design",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors.",
    images: ["/images/hero-1.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Orchid Interiors",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/hero-1.png`,
    description:
      "Residential, commercial and turnkey interior design services.",
    email: "hello@orchidinteriors.com",
    telephone: "+91 97903 52563",
  };

  return (
    <html
      lang="en"
      className={`${viga.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; window.gtag = function(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${gaId}', { anonymize_ip: true });`,
              }}
            />
          </>
        ) : null}
        <ConsultationModalProvider>
          {children}
          <ContextMenuGuard />
          <SmoothMotion />
          <ChatBot />
          <GlobalConsultationModal />
        </ConsultationModalProvider>
      </body>
    </html>
  );
}
