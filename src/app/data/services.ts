export type Service = {
  number: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  detail: string;
  published?: boolean;
  video?: string;
};

export const SERVICES: Service[] = [
  {
    number: "01",
    slug: "modular-kitchen",
    title: "Modular Kitchen",
    description: "Thoughtful modular kitchens designed for everyday living.",
    image: "/images/hero-1.png",
    gallery: [
      "/images/hero-1.png",
      "/images/about-1.jpeg",
      "/images/projects/1.png",
      "/images/about-2.jpeg",
      "/images/hero-2.png",
      "/images/projects/2.jpeg",
      "/images/about-3.jpeg",
      "/images/hero-3.png",
      "/images/projects/3.jpeg",
      "/images/about-4.jpeg",
    ],
    detail:
      "We design practical, elegant modular kitchens with considered storage, durable finishes and a layout that makes daily routines feel effortless.",
  },
  {
    number: "02",
    slug: "bed-room",
    title: "Bed Room",
    description: "Calm, personal bedrooms designed for comfort and rest.",
    image: "/images/about-2.jpeg",
    gallery: [
      "/images/about-2.jpeg",
      "/images/about-3.jpeg",
      "/images/projects/2.jpeg",
      "/images/hero-2.png",
      "/images/about-4.jpeg",
      "/images/projects/4.png",
      "/images/hero-4.png",
      "/images/about-5.jpeg",
      "/images/projects/5.png",
      "/images/hero.jpeg",
    ],
    detail:
      "From wardrobes and lighting to material palettes and soft details, we create bedrooms that feel personal, restful and beautifully resolved.",
  },
  {
    number: "03",
    slug: "living-room",
    title: "Living Room",
    description: "Inviting living spaces shaped around how you gather.",
    image: "/images/projects/3.jpeg",
    gallery: [
      "/images/projects/3.jpeg",
      "/images/projects/4.png",
      "/images/hero-3.png",
      "/images/projects/5.png",
      "/images/about-3.jpeg",
      "/images/hero-4.png",
      "/images/projects/6.png",
      "/images/about-5.jpeg",
      "/images/hero.jpeg",
      "/images/about.png",
    ],
    detail:
      "We balance seating, lighting, storage and statement details to create living rooms that welcome conversation and reflect your style.",
  },
  {
    number: "04",
    slug: "dining",
    title: "Dining",
    description: "Refined dining settings made for everyday moments.",
    image: "/images/hero-4.png",
    gallery: [
      "/images/hero-4.png",
      "/images/about-4.jpeg",
      "/images/projects/4.png",
      "/images/about-1.jpeg",
      "/images/hero-1.png",
      "/images/projects/1.png",
      "/images/about-5.jpeg",
      "/images/hero-2.png",
      "/images/projects/6.png",
      "/images/about.png",
    ],
    detail:
      "Thoughtful proportions, lighting and storage come together in dining spaces that feel warm, considered and ready for gathering.",
  },
  {
    number: "05",
    slug: "pooja-unit",
    title: "Pooja Unit",
    description: "Serene pooja units designed with care and intention.",
    image: "/images/projects/5.png",
    gallery: [
      "/images/projects/5.png",
      "/images/about-5.jpeg",
      "/images/projects/6.png",
      "/images/hero.jpeg",
      "/images/about-2.jpeg",
      "/images/projects/2.jpeg",
      "/images/hero-3.png",
      "/images/about-3.jpeg",
      "/images/hero-1.png",
      "/images/about.png",
    ],
    detail:
      "We create beautifully proportioned pooja units that bring together craftsmanship, lighting, storage and a sense of quiet focus.",
  },
  {
    number: "06",
    slug: "office-workstation",
    title: "Office & Workstation",
    description: "Productive workspaces with clarity, comfort and character.",
    image: "/images/projects/3.jpeg",
    gallery: [
      "/images/projects/3.jpeg",
      "/images/projects/4.png",
      "/images/hero-3.png",
      "/images/projects/5.png",
      "/images/about-3.jpeg",
      "/images/hero-4.png",
      "/images/projects/6.png",
      "/images/about-5.jpeg",
      "/images/hero.jpeg",
      "/images/about.png",
    ],
    detail:
      "From private offices to collaborative workstations, we shape efficient, comfortable environments that support focus and reflect your organisation.",
  },
  {
    number: "07",
    slug: "aluminium-doors-partitions",
    title: "Aluminium Doors & Partitions",
    description: "Clean, durable divisions that bring structure and light.",
    image: "/images/hero-4.png",
    gallery: [
      "/images/hero-4.png",
      "/images/about-4.jpeg",
      "/images/projects/4.png",
      "/images/about-1.jpeg",
      "/images/hero-1.png",
      "/images/projects/1.png",
      "/images/about-5.jpeg",
      "/images/hero-2.png",
      "/images/projects/6.png",
      "/images/about.png",
    ],
    detail:
      "We specify and design aluminium doors and partitions that divide spaces elegantly while preserving light, flow and a contemporary finish.",
  },
  {
    number: "08",
    slug: "institutions",
    title: "Institutions",
    description: "Purposeful interiors for learning and public environments.",
    image: "/images/projects/4.png",
    gallery: [
      "/images/projects/4.png",
      "/images/projects/5.png",
      "/images/hero-3.png",
      "/images/projects/6.png",
      "/images/about-3.jpeg",
      "/images/hero-4.png",
      "/images/about-5.jpeg",
      "/images/hero.jpeg",
      "/images/projects/3.jpeg",
      "/images/about.png",
    ],
    detail:
      "Our institutional interiors are planned for durability, accessibility and clear movement, creating environments that serve people well over time.",
  },
  {
    number: "09",
    slug: "hospitality",
    title: "Hospitality",
    description: "Memorable guest environments with a distinct sense of place.",
    image: "/images/hero-3.png",
    gallery: [
      "/images/hero-3.png",
      "/images/projects/3.jpeg",
      "/images/projects/4.png",
      "/images/about-3.jpeg",
      "/images/hero-4.png",
      "/images/projects/5.png",
      "/images/about-5.jpeg",
      "/images/hero.jpeg",
      "/images/projects/6.png",
      "/images/about.png",
    ],
    detail:
      "From arrival to final detail, we create hospitality spaces that feel distinctive, welcoming and aligned with the experience you want guests to remember.",
  },
];