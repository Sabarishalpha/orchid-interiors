"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ImageGalleryProps = {
  images: readonly string[];
  title: string;
};

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [zoom, setZoom] = useState(1);

  const isOpen = selectedIndex !== null;

  /* ==========================================================
     OPEN IMAGE
  ========================================================== */

  const openGallery = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
  };

  /* ==========================================================
     CLOSE GALLERY
  ========================================================== */

  const closeGallery = useCallback(() => {
    setSelectedIndex(null);
    setZoom(1);
  }, []);

  /* ==========================================================
     NEXT IMAGE
  ========================================================== */

  const nextImage = useCallback(() => {
    if (selectedIndex === null) return;

    setSelectedIndex((selectedIndex + 1) % images.length);

    setZoom(1);
  }, [images.length, selectedIndex]);

  /* ==========================================================
     PREVIOUS IMAGE
  ========================================================== */

  const previousImage = useCallback(() => {
    if (selectedIndex === null) return;

    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);

    setZoom(1);
  }, [images.length, selectedIndex]);

  /* ==========================================================
     KEYBOARD CONTROLS
  ========================================================== */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          closeGallery();
          break;

        case "ArrowRight":
          nextImage();
          break;

        case "ArrowLeft":
          previousImage();
          break;

        case "+":
        case "=":
          setZoom((value) => Math.min(value + 0.25, 3));
          break;

        case "-":
          setZoom((value) => Math.max(value - 0.25, 1));
          break;

        case "0":
          setZoom(1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGallery, isOpen, nextImage, previousImage, selectedIndex]);

  /* ==========================================================
     LOCK PAGE SCROLL
  ========================================================== */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ======================================================
          GALLERY GRID
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => openGallery(index)}
            className={`
              group
              relative
              overflow-hidden
              bg-stone-200
              text-left
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-black
              ${
                index === 0
                  ? "aspect-16/10 sm:col-span-2 md:col-span-2"
                  : "aspect-16/10"
              }
            `}
            aria-label={`Open ${title} image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} detail ${index + 1}`}
              fill
              className="
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 33vw,
                25vw
              "
            />

            {/* Hover overlay */}

            <div
              className="
                absolute
                inset-0
                bg-black/0
                transition-all
                duration-500
                group-hover:bg-black/20
              "
            />

            {/* View icon */}

            <div
              className="
                absolute
                right-4
                bottom-4
                flex
                h-10
                w-10
                translate-y-2
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-black
                opacity-0
                shadow-lg
                backdrop-blur
                transition-all
                duration-500
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </button>
        ))}
      </div>

      {/* ======================================================
          FULLSCREEN LIGHTBOX
      ====================================================== */}

      {isOpen && selectedIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/95
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          onClick={closeGallery}
        >
          {/* ==================================================
              TOP BAR
          ================================================== */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              z-30
              flex
              items-center
              justify-between
              border-b
              border-white/10
              bg-black/20
              px-4
              py-4
              backdrop-blur-md
              sm:px-6
            "
            onClick={(event) => event.stopPropagation()}
          >
            {/* Counter */}

            <div
              className="
                text-xs
                tracking-[0.2em]
                text-white/70
                uppercase
              "
            >
              {String(selectedIndex + 1).padStart(2, "0")}
              {" / "}
              {String(images.length).padStart(2, "0")}
            </div>

            {/* Controls */}

            <div className="flex items-center gap-2">
              {/* Zoom Out */}

              <button
                type="button"
                onClick={() => setZoom((value) => Math.max(value - 0.25, 1))}
                disabled={zoom <= 1}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/5
                  text-white
                  transition
                  hover:bg-white/15
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              {/* Zoom percentage */}

              <span
                className="
                  hidden
                  min-w-12
                  text-center
                  text-xs
                  text-white/60
                  sm:block
                "
              >
                {Math.round(zoom * 100)}%
              </span>

              {/* Zoom In */}

              <button
                type="button"
                onClick={() => setZoom((value) => Math.min(value + 0.25, 3))}
                disabled={zoom >= 3}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/5
                  text-white
                  transition
                  hover:bg-white/15
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              {/* Reset */}

              <button
                type="button"
                onClick={() => setZoom(1)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/5
                  text-white
                  transition
                  hover:bg-white/15
                "
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Close */}

              <button
                type="button"
                onClick={closeGallery}
                className="
                  ml-1
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-black
                  transition
                  hover:bg-stone-200
                "
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ==================================================
              PREVIOUS
          ================================================== */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            className="
              absolute
              left-3
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/40
              text-white
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              sm:left-6
              sm:h-14
              sm:w-14
            "
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* ==================================================
              NEXT
          ================================================== */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            className="
              absolute
              right-3
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/15
              bg-black/40
              text-white
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              sm:right-6
              sm:h-14
              sm:w-14
            "
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* ==================================================
              MAIN IMAGE
          ================================================== */}

          <div
            className="
              relative
              flex
              h-[calc(100vh-130px)]
              w-[calc(100vw-110px)]
              items-center
              justify-center
              overflow-hidden
              sm:h-[calc(100vh-140px)]
              sm:w-[calc(100vw-150px)]
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="
                relative
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
              <Image
                key={images[selectedIndex]}
                src={images[selectedIndex]}
                alt={`${title} detail ${selectedIndex + 1}`}
                fill
                priority
                className="
                  object-contain
                  transition-transform
                  duration-300
                  ease-out
                "
                style={{
                  transform: `scale(${zoom})`,
                }}
                sizes="100vw"
              />
            </div>
          </div>

          {/* ==================================================
              BOTTOM INFO
          ================================================== */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              z-20
              flex
              items-center
              justify-center
              bg-linear-to-t
              from-black
              to-transparent
              px-5
              pb-5
              pt-14
              text-center
            "
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
