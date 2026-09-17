export type DesignCategory = {
  number: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  published?: boolean;
  video?: string;
};

export const DESIGN_LIBRARY: DesignCategory[] = [
  {
    number: "01",
    slug: "living-room",
    title: "Living Room",
    description: "Layered spaces made for conversation, comfort and everyday life.",
    images: [
      "/images/projects/Sathyamoorthy (1).png",
      "/images/projects/Sathyamoorthy (2).png",
      "/images/projects/Sathyamoorthy (3).png",
      "/images/projects/Sathyamoorthy (4).png",
      "/images/projects/Sathyamoorthy (5).png",
      "/images/projects/Sathyamoorthy (6).png",
    ],
  },
  {
    number: "02",
    slug: "bedroom",
    title: "Bedroom",
    description: "Quiet, personal rooms designed around rest and ritual.",
    images: [
      "/images/projects/Ravichandram interior (1).jpg",
      "/images/projects/Ravichandram interior (2).jpg",
      "/images/projects/Ravichandram interior (3).jpg",
      "/images/projects/Ravichandram interior (4).jpg",
      "/images/projects/Ravichandram interior (5).jpg",
      "/images/projects/Ravichandram interior (6).jpg",
    ],
  },
  {
    number: "03",
    slug: "kitchen",
    title: "Kitchen",
    description: "Practical, polished kitchens with a place for everything.",
    images: [
      "/images/projects/NOOR (1).png",
      "/images/projects/NOOR (2).png",
      "/images/projects/NOOR (3).png",
      "/images/projects/NOOR (4).png",
      "/images/projects/NOOR (5).png",
      "/images/projects/NOOR (6).png",
    ],
  },
  {
    number: "04",
    slug: "dining",
    title: "Dining",
    description: "Warm settings shaped for meals, hosting and connection.",
    images: [
      "/images/projects/sasi (1).png",
      "/images/projects/sasi (2).png",
      "/images/projects/sasi (3).png",
      "/images/projects/sasi (4).png",
      "/images/projects/sasi (5).png",
      "/images/projects/sasi (6).png",
    ],
  },
  {
    number: "05",
    slug: "bathroom",
    title: "Bathroom",
    description: "Refined, functional spaces with a sense of calm.",
    images: [
      "/images/projects/Dr. Shankar (1).jpg",
      "/images/projects/Dr. Shankar (2).jpg",
      "/images/projects/Dr. Shankar (3).jpg",
      "/images/projects/Dr. Shankar (4).jpg",
      "/images/projects/Dr. Shankar (5).jpg",
      "/images/projects/Dr. Shankar (6).jpg",
    ],
  },
  {
    number: "06",
    slug: "kids-room",
    title: "Kids Room",
    description: "Playful, flexible rooms that grow with the people in them.",
    images: [
      "/images/projects/kongu (1).png",
      "/images/projects/kongu (2).png",
      "/images/projects/kongu (3).png",
      "/images/projects/kongu (4).png",
      "/images/projects/kongu (5).png",
      "/images/projects/kongu (6).png",
    ],
  },
  {
    number: "07",
    slug: "luxury-interiors",
    title: "Luxury Interiors",
    description: "Elevated interiors where material, proportion and detail lead.",
    images: [
      "/images/projects/sengeetha (1).png",
      "/images/projects/sengeetha (2).png",
      "/images/projects/sengeetha (3).png",
      "/images/projects/sengeetha (4).png",
      "/images/projects/sengeetha (5).png",
      "/images/projects/sengeetha (6).png",
    ],
  },
  {
    number: "08",
    slug: "pooja-room",
    title: "Pooja Room",
    description: "Serene, considered spaces designed for reflection and ritual.",
    images: [
      "/images/projects/1.png",
      "/images/projects/2.jpeg",
      "/images/projects/3.jpeg",
      "/images/projects/4.png",
      "/images/projects/5.png",
      "/images/projects/6.png",
    ],
  },
  {
    number: "09",
    slug: "home-office",
    title: "Home Office",
    description: "Focused workspaces designed for clarity, comfort and flow.",
    images: [
      "/images/projects/Sathyamoorthy (7).png",
      "/images/projects/Sathyamoorthy (8).png",
      "/images/projects/Sathyamoorthy (9).png",
      "/images/projects/Sathyamoorthy (10).png",
      "/images/projects/Sathyamoorthy (11).png",
      "/images/projects/Sathyamoorthy (12).png",
    ],
  },
  {
    number: "10",
    slug: "wardrobe-storage",
    title: "Wardrobe & Storage",
    description: "Tailored storage systems that bring order to everyday living.",
    images: [
      "/images/projects/Ravichandram interior (7).jpg",
      "/images/projects/Ravichandram interior (8).jpg",
      "/images/projects/Ravichandram interior (9).jpg",
      "/images/projects/Ravichandram interior (10).jpg",
      "/images/projects/Ravichandram interior (11).jpg",
      "/images/projects/Ravichandram interior (12).jpg",
    ],
  },
];

export function getDesignCategory(slug: string) {
  return DESIGN_LIBRARY.find((category) => category.slug === slug);
}