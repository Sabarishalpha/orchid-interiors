import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import DesignLibrary from "../components/DesignLibrary";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { getPublicDesignCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Design Library",
  description:
    "Browse completed 3D interior designs by Orchid Interiors, organised by room and design style.",
  alternates: { canonical: "/design-library" },
};

export default function DesignLibraryPage() {
  const categories = getPublicDesignCategories().map((category) => ({
    number: String(category.display_order).padStart(2, "0"),
    slug: category.slug,
    title: category.name,
    description: category.short_description,
    images: [category.cover_image],
  }));

  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/projects/1.png"
        imageAlt="Completed Orchid Interiors 3D design"
      />
      <DesignLibrary categories={categories} />
      <Footer />
    </>
  );
}
