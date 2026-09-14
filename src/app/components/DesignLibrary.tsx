import Image from "next/image";
import Link from "next/link";

type DesignCategory = {
  number: string;
  slug: string;
  title: string;
  description: string;
  images: readonly string[];
};

type DesignLibraryProps = {
  categories: readonly DesignCategory[];
};

function CategoryCard({ category }: { category: DesignCategory }) {
  return (
    <Link
      href={`/design-library/${category.slug}`}
      className="group relative overflow-hidden rounded-[18px] bg-stone-200"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16 / 9" }}
      >
        <Image
          src={category.images[0]}
          alt={`${category.title} interior design`}
          fill
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 text-xs tracking-[0.2em] text-white/60">
            <span>{category.number}</span>
            <span className="translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              VIEW CATEGORY ↗
            </span>
          </div>
          <h2 className="text-2xl font-light text-white sm:text-3xl">
            {category.title}
          </h2>
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-10 bg-white transition-all duration-500 group-hover:w-20"
          />
        </div>
      </div>
    </Link>
  );
}

export default function DesignLibrary({ categories }: DesignLibraryProps) {
  const featuredCategories = categories.slice(0, 2);
  const remainingCategories = categories.slice(2);

  return (
    <main className="bg-stone-50 px-4 pb-20 pt-16 text-black sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-stone-500">
            Completed 3D designs
          </p>
          <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
            Design Library
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
            Browse our completed interiors by room. Select a category to see the
            full collection of visualised designs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {remainingCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
