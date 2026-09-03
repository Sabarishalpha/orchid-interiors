import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Interior Design in Coimbatore",
  description:
    "Create a beautiful space with Orchid Interiors. Premium residential, commercial and turnkey interior design solutions in Coimbatore and Tamil Nadu.",
  alternates: { canonical: "/orchid-interiors" },
  openGraph: {
    title: "Orchid Interiors | Premium Interior Design in Coimbatore",
    description:
      "Premium residential, commercial and turnkey interior design solutions in Coimbatore and Tamil Nadu.",
    images: [{ url: "/images/hero-1.png", alt: "Orchid Interiors premium interior design" }],
  },
};

export default function OrchidInteriorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}