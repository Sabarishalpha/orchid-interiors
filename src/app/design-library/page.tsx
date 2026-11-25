import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import DesignLibrary from "../components/DesignLibrary";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { getDesignLibrary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Interior Design Ideas & Room Gallery",
  description:
    "Browse kitchen, bedroom, living room, dining and office interior design ideas by Orchid Interiors.",
  alternates: { canonical: "/design-library" },
  openGraph: {
    type: "website",
    title: "Interior Design Ideas & Room Gallery",
    description:
      "Browse kitchen, bedroom, living room, dining and office interior design ideas by Orchid Interiors.",
    url: "/design-library",
    images: [
      { url: "/images/hero-1.png", alt: "Orchid Interiors design gallery" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Ideas & Room Gallery",
    description:
      "Browse kitchen, bedroom, living room, dining and office interior design ideas by Orchid Interiors.",
    images: ["/images/hero-1.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function DesignLibraryPage() {
  const categories = await getDesignLibrary();
  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/hero-1.png"
        imageAlt="Completed Orchid Interiors 3D design"
      />
      <DesignLibrary categories={categories} />
      <Footer />
    </>
  );
}
