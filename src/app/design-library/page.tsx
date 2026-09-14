import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import DesignLibrary from "../components/DesignLibrary";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import { DESIGN_LIBRARY } from "../data/designLibrary";

export const metadata: Metadata = {
  title: "Design Library",
  description:
    "Browse completed 3D interior designs by Orchid Interiors, organised by room and design style.",
  alternates: { canonical: "/design-library" },
};

export default function DesignLibraryPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        image="/images/projects/1.png"
        imageAlt="Completed Orchid Interiors 3D design"
      />
      <DesignLibrary categories={DESIGN_LIBRARY} />
      <Footer />
    </>
  );
}
