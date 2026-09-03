export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Modern"
  | "Hospitality"
  | "Institute"
  | "Luxury";

export type Project = {
  id: number;
  number: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  location: string;

  image: string;
  width: number;
  height: number;

  gallery: string[];

  /**
   * Optional project video.
   * Leave as an empty string if the project doesn't have a video yet.
   */
  video?: string;
};

export const PROJECTS: Project[] = [
  // ============================================================
  // RESIDENTIAL — 4 PROJECTS
  // ============================================================

  {
    id: 1,
    number: "01",
    title: "The Harmonia Residence",
    slug: "harmonia-residence",
    category: "Residential",
    location: "Bangalore",

    image: "/images/projects/Sathyamoorthy (12).png",
    width: 1920 ,
    height: 1080,

    gallery: [
      "/images/projects/Sathyamoorthy (1).png",
      "/images/projects/Sathyamoorthy (2).png",
      "/images/projects/Sathyamoorthy (3).png",
      "/images/projects/Sathyamoorthy (4).png",
      "/images/projects/Sathyamoorthy (5).png",
      "/images/projects/Sathyamoorthy (6).png",
      "/images/projects/Sathyamoorthy (7).png",
      "/images/projects/Sathyamoorthy (8).png",
      "/images/projects/Sathyamoorthy (9).png",
      "/images/projects/Sathyamoorthy (10).png",
      "/images/projects/Sathyamoorthy (11).png",
      "/images/projects/Sathyamoorthy (12).png",
      "/images/projects/Sathyamoorthy (13).png",
      "/images/projects/Sathyamoorthy (14).png",
      "/images/projects/Sathyamoorthy (15).png",
      "/images/projects/Sathyamoorthy (16).png",
      "/images/projects/Sathyamoorthy (17).png",
      "/images/projects/Sathyamoorthy (18).png",
      "/images/projects/Sathyamoorthy (19).png",
      "/images/projects/Sathyamoorthy (20).png",
      "/images/projects/Sathyamoorthy (21).png",
      "/images/projects/Sathyamoorthy (22).png",
      "/images/projects/Sathyamoorthy (23).png",
      "/images/projects/Sathyamoorthy (24).png",
      "/images/projects/Sathyamoorthy (25).png",
      "/images/projects/Sathyamoorthy (26).png",

    ],

    video: "/videos/projects/test.mp4",
  },

  {
    id: 2,
    number: "02",
    title: "The Aria Residence",
    slug: "aria-residence",
    category: "Residential",
    location: "Coimbatore",

    image: "/images/projects/Ravichandram interior (1).jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
  // ============================================================
  // 24 images
  //   // ============================================================

      "/images/projects/Ravichandram interior (1).jpg",
      "/images/projects/Ravichandram interior (2).jpg",
      "/images/projects/Ravichandram interior (3).jpg",
      "/images/projects/Ravichandram interior (4).jpg",
      "/images/projects/Ravichandram interior (5).jpg",
      "/images/projects/Ravichandram interior (6).jpg",
      "/images/projects/Ravichandram interior (7).jpg",
      "/images/projects/Ravichandram interior (8).jpg",
      "/images/projects/Ravichandram interior (9).jpg",
      "/images/projects/Ravichandram interior (10).jpg",
      "/images/projects/Ravichandram interior (11).jpg",
      "/images/projects/Ravichandram interior (12).jpg",
      "/images/projects/Ravichandram interior (13).jpg",
      "/images/projects/Ravichandram interior (14).jpg",
      "/images/projects/Ravichandram interior (15).jpg",
      "/images/projects/Ravichandram interior (16).jpg",
      "/images/projects/Ravichandram interior (17).jpg",
      "/images/projects/Ravichandram interior (18).jpg",
      "/images/projects/Ravichandram interior (19).jpg",
      "/images/projects/Ravichandram interior (20).jpg",
      "/images/projects/Ravichandram interior (21).jpg",
      "/images/projects/Ravichandram interior (22).jpg",
      "/images/projects/Ravichandram interior (23).jpg",
      "/images/projects/Ravichandram interior (24).jpg"
    ],

    video: "/videos/projects/test.mp4",
  },

  {
    id: 3,
    number: "03",
    title: "The Elysian Home",
    slug: "elysian-home",
    category: "Residential",
    location: "Chennai",

    image: "/images/projects/elysian.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/elysian.jpg",
      "/images/projects/elysian-2.jpg",
      "/images/projects/elysian-3.jpg",
      "/images/projects/elysian-4.jpg",
    ],

    video: "/videos/projects/elysian.mp4",
  },

  {
    id: 4,
    number: "04",
    title: "The Solara Villa",
    slug: "solara-villa",
    category: "Residential",
    location: "Bangalore",

    image: "/images/projects/solara.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/solara.jpg",
      "/images/projects/solara-2.jpg",
      "/images/projects/solara-3.jpg",
      "/images/projects/solara-4.jpg",
    ],

    video: "/videos/projects/solara.mp4",
  },

  // ============================================================
  // COMMERCIAL — 4 PROJECTS
  // ============================================================

  {
    id: 6,
    number: "01",
    title: "Aurelia Corporate Office",
    slug: "aurelia-corporate-office",
    category: "Commercial",
    location: "Bangalore",

    image: "/images/projects/sasi (5).png",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/sasi (5).png",
      "/images/projects/sasi (2).png",
      "/images/projects/sasi (3).png",
      "/images/projects/sasi (4).png",
      "/images/projects/sasi (1).png", 
      "/images/projects/sasi (6).png",
      "/images/projects/sasi (7).png",
      "/images/projects/sasi (8).png",
      "/images/projects/sasi (9).png",
      "/images/projects/sasi (10).png",
      "/images/projects/sasi (11).png",
      "/images/projects/sasi (12).png",
      "/images/projects/sasi (13).png",
      "/images/projects/sasi (14).png",
      "/images/projects/sasi (15).png",
      "/images/projects/sasi (16).png",
      "/images/projects/sasi (17).png",
      "/images/projects/sasi (18).png",
      "/images/projects/sasi (19).png",
      "/images/projects/sasi (20).png",
      "/images/projects/sasi (21).png",
      "/images/projects/sasi (22).png",
      "/images/projects/sasi (23).png",
      "/images/projects/sasi (24).png"
    ],

    video: "/videos/projects/sasi.mp4",
  },

  {
    id: 7,
    number: "02",
    title: "The Atelier Workspace",
    slug: "atelier-workspace",
    category: "Commercial",
    location: "Coimbatore",

    image: "/images/projects/atelier.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/atelier.jpg",
      "/images/projects/atelier-2.jpg",
      "/images/projects/atelier-3.jpg",
      "/images/projects/atelier-4.jpg",
    ],

    video: "/videos/projects/atelier.mp4",
  },

  {
    id: 8,
    number: "03",
    title: "Vertex Business Lounge",
    slug: "vertex-business-lounge",
    category: "Commercial",
    location: "Chennai",

    image: "/images/projects/vertex.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/vertex.jpg",
      "/images/projects/vertex-2.jpg",
      "/images/projects/vertex-3.jpg",
      "/images/projects/vertex-4.jpg",
    ],

    video: "/videos/projects/vertex.mp4",
  },

  {
    id: 9,
    number: "04",
    title: "Nexa Studio",
    slug: "nexa-studio",
    category: "Commercial",
    location: "Bangalore",

    image: "/images/projects/nexa.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/nexa.jpg",
      "/images/projects/nexa-2.jpg",
      "/images/projects/nexa-3.jpg",
      "/images/projects/nexa-4.jpg",
    ],

    video: "/videos/projects/nexa.mp4",
  },

  // ============================================================
  // MODERN — 4 PROJECTS
  // ============================================================

  {
    id: 11,
    number: "01",
    title: "Monochrome House",
    slug: "monochrome-house",
    category: "Modern",
    location: "Bangalore",

    image: "/images/projects/Dr. Shankar (1).jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/Dr. Shankar (1).jpg",
      "/images/projects/Dr. Shankar (2).jpg",
      "/images/projects/Dr. Shankar (3).jpg",
      "/images/projects/Dr. Shankar (4).jpg",
      "/images/projects/Dr. Shankar (5).jpg",
      "/images/projects/Dr. Shankar (6).jpg",
      "/images/projects/Dr. Shankar (7).jpg",
      "/images/projects/Dr. Shankar (8).jpg",
      "/images/projects/Dr. Shankar (9).jpg",
      "/images/projects/Dr. Shankar (10).jpg",
      "/images/projects/Dr. Shankar (11).jpg",
      "/images/projects/Dr. Shankar (12).jpg",
      "/images/projects/Dr. Shankar (13).jpg",
      "/images/projects/Dr. Shankar (14).jpg",
      "/images/projects/Dr. Shankar (15).jpg",
      "/images/projects/Dr. Shankar (16).jpg",
      "/images/projects/Dr. Shankar (17).jpg",
      "/images/projects/Dr. Shankar (18).jpg",
      "/images/projects/Dr. Shankar (19).jpg",
      "/images/projects/Dr. Shankar (20).jpg",
      "/images/projects/Dr. Shankar (21).jpg",
      "/images/projects/Dr. Shankar (22).jpg",
      "/images/projects/Dr. Shankar (23).jpg",
      "/images/projects/Dr. Shankar (24).jpg",
      "/images/projects/Dr. Shankar (25).jpg",
    ],

    video: "/videos/projects/monochrome.mp4",
  },

  {
    id: 12,
    number: "02",
    title: "The Linear Residence",
    slug: "linear-residence",
    category: "Modern",
    location: "Chennai",

    image: "/images/projects/linear.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/linear.jpg",
      "/images/projects/linear-2.jpg",
      "/images/projects/linear-3.jpg",
      "/images/projects/linear-4.jpg",
    ],

    video: "/videos/projects/linear.mp4",
  },

  {
    id: 13,
    number: "03",
    title: "The Minimalist Home",
    slug: "minimalist-home",
    category: "Modern",
    location: "Coimbatore",

    image: "/images/projects/minimalist.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/minimalist.jpg",
      "/images/projects/minimalist-2.jpg",
      "/images/projects/minimalist-3.jpg",
      "/images/projects/minimalist-4.jpg",
    ],

    video: "/videos/projects/minimalist.mp4",
  },

  {
    id: 14,
    number: "04",
    title: "Axis Residence",
    slug: "axis-residence",
    category: "Modern",
    location: "Bangalore",

    image: "/images/projects/axis.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/axis.jpg",
      "/images/projects/axis-2.jpg",
      "/images/projects/axis-3.jpg",
      "/images/projects/axis-4.jpg",
    ],

    video: "/videos/projects/axis.mp4",
  },

  // ============================================================
  // LUXURY — 4 PROJECTS
  // ============================================================

  {
    id: 16,
    number: "01",
    title: "The Grand Residence",
    slug: "grand-residence",
    category: "Luxury",
    location: "Bangalore",

    image: "/images/projects/NOOR (1).png",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/NOOR (1).png ",
      "/images/projects/NOOR (2).PNG",
      "/images/projects/NOOR (3).PNG",
      "/images/projects/NOOR (4).PNG",
      "/images/projects/NOOR (5).PNG",
      "/images/projects/NOOR (6).PNG",
      "/images/projects/NOOR (7).PNG",
      "/images/projects/NOOR (8).PNG",
      "/images/projects/NOOR (9).PNG",
      "/images/projects/NOOR (10).PNG",
      "/images/projects/NOOR (11).PNG",
      "/images/projects/NOOR (12).PNG",
      "/images/projects/NOOR (13).PNG",
      "/images/projects/NOOR (14).PNG",
      "/images/projects/NOOR (15).PNG",
    ],

    video: "/videos/projects/grand-residence.mp4",
  },

  {
    id: 17,
    number: "02",
    title: "The Imperial Villa",
    slug: "imperial-villa",
    category: "Luxury",
    location: "Chennai",

    image: "/images/projects/imperial-villa.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/imperial-villa.jpg",
      "/images/projects/imperial-villa-2.jpg",
      "/images/projects/imperial-villa-3.jpg",
      "/images/projects/imperial-villa-4.jpg",
    ],

    video: "/videos/projects/imperial-villa.mp4",
  },

  {
    id: 18,
    number: "03",
    title: "The Royale Estate",
    slug: "royale-estate",
    category: "Luxury",
    location: "Coimbatore",

    image: "/images/projects/royale-estate.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/royale-estate.jpg",
      "/images/projects/royale-estate-2.jpg",
      "/images/projects/royale-estate-3.jpg",
      "/images/projects/royale-estate-4.jpg",
    ],

    video: "/videos/projects/royale-estate.mp4",
  },

  {
    id: 19,
    number: "04",
    title: "The Opulent House",
    slug: "opulent-house",
    category: "Luxury",
    location: "Bangalore",

    image: "/images/projects/opulent-house.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/opulent-house.jpg",
      "/images/projects/opulent-house-2.jpg",
      "/images/projects/opulent-house-3.jpg",
      "/images/projects/opulent-house-4.jpg",
    ],

    video: "/videos/projects/opulent-house.mp4",
  },

  // ============================================================
  // Hospitality — 2 PROJECTS
  // ============================================================
  {
    id: 21,
    number: "01",
    title: "The Luxe Hotel",
    slug: "luxe-hotel",
    category: "Hospitality",
    location: "Bangalore",

    image: "/images/projects/sengeetha (5).png",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/sengeetha (1).png",
      "/images/projects/sengeetha (2).png",
      "/images/projects/sengeetha (3).png",
      "/images/projects/sengeetha (4).png",
      "/images/projects/sengeetha (5).png",
      "/images/projects/sengeetha (6).png",
      "/images/projects/sengeetha (7).png",
      "/images/projects/sengeetha (8).png",
      "/images/projects/sengeetha (9).png",
      "/images/projects/sengeetha (10).png",
      "/images/projects/sengeetha (11).png",
      "/images/projects/sengeetha (12).png",
      "/images/projects/sengeetha (13).png",
      "/images/projects/sengeetha (14).png",
    ],

    video: "/videos/projects/luxe-hotel.mp4",
  },

  {
    id: 22,
    number: "02",
    title: "The Grand Resort",
    slug: "grand-resort",
    category: "Hospitality",
    location: "Chennai",

    image: "/images/projects/grand-resort.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/grand-resort.jpg",
      "/images/projects/grand-resort-2.jpg",
      "/images/projects/grand-resort-3.jpg",
      "/images/projects/grand-resort-4.jpg",
    ],

    video: "/videos/projects/grand-resort.mp4",
  },
  // ============================================================
  // Institute — 2 PROJECTS
  // ============================================================
  {
    id: 23,
    number: "01",
    title: "The Elite Academy",
    slug: "elite-academy",
    category: "Institute",
    location: "Bangalore",

    image: "/images/projects/kongu (1).png",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/kongu (1).png",
      "/images/projects/kongu (2).png",
      "/images/projects/kongu (3).png",
      "/images/projects/kongu (4).png",
      "/images/projects/kongu (5).png",
      "/images/projects/kongu (6).png",
      "/images/projects/kongu (7).png",
      "/images/projects/kongu (8).png",
      "/images/projects/kongu (9).png",
      "/images/projects/kongu (10).png",
      "/images/projects/kongu (11).png",
    ],

    video: "/videos/projects/elite-academy.mp4",
  },

  {
    id: 24,
    number: "02",
    title: "The Knowledge Hub",
    slug: "knowledge-hub",
    category: "Institute",
    location: "Chennai",

    image: "/images/projects/knowledge-hub.jpg",
    width: 1920 ,
    height: 1080 ,

    gallery: [
      "/images/projects/knowledge-hub.jpg",
      "/images/projects/knowledge-hub-2.jpg",
      "/images/projects/knowledge-hub-3.jpg",
      "/images/projects/knowledge-hub-4.jpg",
    ],

    video: "/videos/projects/knowledge-hub.mp4",
  },

];
