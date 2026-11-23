import Image from "next/image";

interface PageHeaderProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function PageHeader({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="relative h-64 w-full overflow-hidden bg-stone-900 sm:h-72 lg:h-80">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/45" />
      {(title || description) && (
        <div className="relative flex h-full items-center justify-center px-4 text-center text-white sm:px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-medium tracking-[0.3em] text-white/80 uppercase sm:text-sm">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mx-auto max-w-2xl text-base leading-8 text-white/85 sm:text-lg md:text-xl">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
