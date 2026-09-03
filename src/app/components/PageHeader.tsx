import Image from "next/image";

interface PageHeaderProps {
  image: string;
  imageAlt: string;
  title?: string;
  description?: string;
}

export default function PageHeader({
  image,
  imageAlt,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="relative h-72 w-full overflow-hidden bg-stone-900 sm:h-80 lg:h-96">
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
            {title && (
              <h1 className="mb-6 text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
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
