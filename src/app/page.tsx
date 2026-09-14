import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import FeaturedProjects from "./components/FeaturedProjects";
import VideoShowcase from "./components/VideoShowcase";
import BrandPartners from "./components/BrandPartners";
import { PROJECTS } from "./data/projects";
import { SERVICES } from "./data/services";

export default function Home() {
  const projects = PROJECTS.map((project) => ({
    ...project,
    category: project.category as
      | "Residential"
      | "Commercial"
      | "Hospitality"
      | "Institute"
      | "Luxury",
  }));
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services services={SERVICES} />
        <FeaturedProjects />
        <BrandPartners />
        <VideoShowcase />
        <Projects projectLimit={2} projects={projects} />
      </main>

      <Footer />
    </>
  );
}
