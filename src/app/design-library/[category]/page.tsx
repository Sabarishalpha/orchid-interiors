import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageGallery from "../../components/ImageGallery";
import PageHeader from "../../components/PageHeader";
import { DESIGN_LIBRARY, getDesignCategory } from "../../data/designLibrary";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return DESIGN_LIBRARY.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getDesignCategory(slug);

  if (!category) return {};

  return {
    title: `${category.title} Designs`,
    description: category.description,
    alternates: { canonical: `/design-library/${category.slug}` },
    openGraph: { images: [category.images[0]] },
  };
}

export default async function DesignCategoryPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getDesignCategory(slug);

  if (!category) notFound();

  return (
    <>
      <Navbar />
      <PageHeader
        image={category.images[0]}
        imageAlt={`${category.title} interior design header`}
      />
      <main className="bg-stone-50 px-4 pb-20 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-stone-500">
                Design Library / {category.number}
              </p>
              <h1 className="text-5xl font-light tracking-[-0.05em] text-black sm:text-7xl">
                {category.title}
              </h1>
            </div>
            <Link
              href="/design-library"
              className="text-xs font-medium uppercase tracking-[0.2em] text-stone-600 transition hover:text-black"
            >
              All categories ↗
            </Link>
          </div>

          <ImageGallery
            images={category.images}
            title={category.title}
            layout="design-library"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
