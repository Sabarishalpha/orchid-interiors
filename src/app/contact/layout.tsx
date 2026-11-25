import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Orchid Interiors",
  description:
    "Contact Orchid Interiors to discuss residential, commercial or hospitality interiors and request a design consultation.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact Orchid Interiors",
    description:
      "Contact Orchid Interiors to discuss residential, commercial or hospitality interiors and request a design consultation.",
    url: "/contact",
    images: [{ url: "/images/hero.jpeg", alt: "Interior by Orchid Interiors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Orchid Interiors",
    description:
      "Contact Orchid Interiors to discuss residential, commercial or hospitality interiors and request a design consultation.",
    images: ["/images/hero.jpeg"],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
