import type { Metadata } from "next";
import Footer from "../components/Footer";
import LandingPage from "../components/LandingPage";
import type { InteriorReel } from "../components/InteriorReels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Interior Designers in Coimbatore & Tiruppur",
  description:
    "Transform your home or commercial space with Orchid Interiors. Explore interior design services, completed projects and book a free consultation.",
  alternates: { canonical: "/orchidmodularinteriors" },
  openGraph: {
    type: "website",
    title: "Premium Interior Designers in Coimbatore & Tiruppur",
    description:
      "Thoughtfully designed residential and commercial interiors by Orchid Interiors.",
    url: "/orchidmodularinteriors",
    images: [
      {
        url: "/images/hero-1.png",
        alt: "Luxury interior designed by Orchid Interiors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchid Interiors | Premium Interior Design",
    description:
      "Thoughtfully designed residential and commercial interiors across Tamil Nadu.",
    images: ["/images/hero-1.png"],
  },
};

async function getYouTubeShorts(): Promise<InteriorReel[]> {
  const fallback: InteriorReel[] = [
    { id: "FNaQnEUKB50", title: "Happy Client Testimonial" },
    { id: "QT0KK67QKG4", title: "Premium Wooden Partitions" },
    { id: "oZV4rbDo21w", title: "Premium Bedroom Interior Design" },
    { id: "qZeAvCPwcZA", title: "Modular Kitchen and Dining Design" },
    { id: "briAmRdxV80", title: "Luxury Modular Kitchen Design" },
  ];

  try {
    const response = await fetch(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCU3Y0P4rPd_ppcq4edlD_Nw",
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return fallback;

    const xml = await response.text();
    const entries = xml.match(/<entry[\s\S]*?<\/entry>/g) ?? [];
    const reels = entries
      .filter((entry) => /youtube\.com\/shorts\//i.test(entry))
      .map((entry) => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
        const title = entry
          .match(/<media:title>([\s\S]*?)<\/media:title>/)?.[1]
          ?.replace(/&amp;/g, "&")
          ?.replace(/&[^;]+;/g, "")
          ?.trim();
        return id && title ? { id, title } : null;
      })
      .filter((reel): reel is InteriorReel => reel !== null)
      .slice(0, 10);

    return reels.length > 0 ? reels : fallback;
  } catch {
    return fallback;
  }
}

export default async function OrchidModularInteriorsPage() {
  const reels = await getYouTubeShorts();

  return (
    <>
      <LandingPage reels={reels} />
      <Footer />
    </>
  );
}
