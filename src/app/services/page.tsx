import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import {
  buildServiceCatalog,
  getDesignLibrary,
  getProjects,
  getServices,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Interior Design Services",
  description:
    "Explore modular kitchens, bedrooms, living spaces and turnkey interior design services by Orchid Interiors.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "Interior Design Services",
    description:
      "Explore modular kitchens, bedrooms, living spaces and turnkey interior design services by Orchid Interiors.",
    url: "/services",
    images: [
      { url: "/images/services.jpg", alt: "Orchid Interiors design services" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Services",
    description:
      "Explore modular kitchens, bedrooms, living spaces and turnkey interior design services by Orchid Interiors.",
    images: ["/images/services.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [designCategories, existingServices, projects] = await Promise.all([
    getDesignLibrary(),
    getServices(),
    getProjects(),
  ]);
  const services = buildServiceCatalog(
    designCategories,
    existingServices,
    projects,
  );

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Orchid Interiors"
          image="/images/services.jpg"
          imageAlt="Interior design by Orchid Interiors"
          title="Interior Design Services"
          description="Explore home, modular kitchen and commercial interiors by Orchid Interiors."
        />
        <div className="pt-8 sm:pt-10">
          <Services layout="grid" showHeading={false} services={services} />
        </div>
      </main>
      <Footer />
    </>
  );
}
