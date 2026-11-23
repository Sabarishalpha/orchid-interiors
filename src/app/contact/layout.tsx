import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Our Interior Design Team",
  description:
    "Contact Orchid Interiors to discuss residential, commercial, or hospitality interiors. Visit our Coimbatore-area showrooms or Tiruppur office.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact Orchid Interiors",
    description:
      "Discuss residential, commercial, or hospitality interiors with Orchid Interiors. Visit our Coimbatore-area showrooms or Tiruppur office.",
    url: "/contact",
    images: [{ url: "/images/hero.jpeg", alt: "Interior by Orchid Interiors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Orchid Interiors",
    description:
      "Discuss residential, commercial, or hospitality interiors with Orchid Interiors. Visit our Coimbatore-area showrooms or Tiruppur office.",
    images: ["/images/hero.jpeg"],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
