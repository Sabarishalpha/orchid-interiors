export type ProjectCategory =
  | "Residential"
  | "Commercial"
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
  description?: string;
  image: string;
  width: number;
  height: number;
  gallery: string[];
  published?: boolean;
  video?: string;
};
