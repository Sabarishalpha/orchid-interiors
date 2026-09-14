import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import FeaturedProjects from "./components/FeaturedProjects";
import VideoShowcase from "./components/VideoShowcase";
import BrandPartners from "./components/BrandPartners";
import {
  getPublicServices,
  getPublicProjects,
  getSiteStatistics,
} from "@/lib/db";

export default function Home() {
  const statistics = getSiteStatistics();
  const services = getPublicServices().map((service) => ({
    number: String(service.display_order).padStart(2, "0"),
    slug: service.slug,
    title: service.name,
    description: service.short_description,
    image: service.service_image,
    gallery: service.gallery_images,
    detail: service.full_description,
  }));

  const projects = getPublicProjects().map((project) => ({
    id: project.id,
    number: String(project.display_order).padStart(2, "0"),
    title: project.name,
    slug: project.slug,
    category: project.category,
    location: project.location,
    image: project.cover_image,
    width: 1920,
    height: 1080,
    gallery: project.gallery,
    video: project.project_video || undefined,
  }));
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About statistics={statistics} />
        <Services services={services} />
        <FeaturedProjects />
        <BrandPartners />
        <VideoShowcase />
        <Projects projectLimit={2} projects={projects} />
      </main>

      <Footer />
    </>
  );
}
