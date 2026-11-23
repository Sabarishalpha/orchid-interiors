export type Service = {
  number?: string;
  slug: string;
  title: string;
  description?: string;
  image: string;
  published?: boolean;
};

export const servicesSeed: Service[] = [
  {
    slug: "modular-kitchen",
    title: "Modular Kitchen",
    image: "/images/services/modular-kitchen/70.jpg",
  },
];
