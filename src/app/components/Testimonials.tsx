"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "The Sharma Family",
    project: "Luxury Residence",
    location: "Coimbatore",
    quote:
      "The process was seamless from concept to execution. Every decision felt intentional, and the final result exceeded our expectations.",
    image: "/images/projects/1.png",
  },
  {
    name: "Aditi & Rohan",
    project: "Modern Apartment",
    location: "Bengaluru",
    quote:
      "Our home feels elevated, warm and uniquely ours. The studio understood the brief perfectly and delivered with great restraint and taste.",
    image: "/images/projects/2.jpeg",
  },
  {
    name: "Karthik Enterprises",
    project: "Commercial Workspace",
    location: "Chennai",
    quote:
      "The transformation of our office was thoughtful and strategic. It made our workplace more functional, premium and employee-friendly.",
    image: "/images/projects/3.jpeg",
  },
];

export default function Testimonials() {
  return (
    <section className="relative w-full bg-stone-100 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl font-light text-black sm:text-4xl md:text-5xl">
            Clients we’ve delighted.
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={24}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{
            el: ".testimonials-pagination",
            clickable: true,
          }}
          loop
          className="!pb-12"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.name}>
              <div className="grid gap-8 rounded-[2rem] border border-stone-300 bg-white p-6 sm:p-8 lg:grid-cols-[0.9fr_1.5fr] lg:p-10">
                <div className="flex items-center justify-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border border-stone-300 bg-stone-200 sm:h-52 sm:w-52">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <blockquote className="text-xl font-light leading-relaxed text-black sm:text-2xl md:text-3xl">
                    “{item.quote}”
                  </blockquote>

                  <div className="mt-8">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-600">
                      {item.name}
                    </p>
                    <p className="mt-2 text-base text-stone-700">
                      {item.project} • {item.location}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="testimonials-pagination flex justify-center gap-2" />
      </div>
    </section>
  );
}
