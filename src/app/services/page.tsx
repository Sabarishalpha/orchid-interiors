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
  title: "Interior Design Services in Coimbatore",
  description:
    "Explore modular kitchens, bedrooms, living rooms, workspaces, and more from Orchid Interiors, serving Coimbatore and nearby Tamil Nadu communities.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    title: "Interior Design Services in Coimbatore",
    description:
      "Explore modular kitchens, bedrooms, living rooms, workspaces, and more from Orchid Interiors, serving Coimbatore and nearby Tamil Nadu communities.",
    url: "/services",
    images: [
      { url: "/images/services.jpg", alt: "Orchid Interiors design services" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Services in Coimbatore",
    description:
      "Explore modular kitchens, bedrooms, living rooms, workspaces, and more from Orchid Interiors, serving Coimbatore and nearby Tamil Nadu communities.",
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
        />
        <div className="pt-8 sm:pt-10">
          <Services
            layout="grid"
            showHeading={false}
            services={services}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
