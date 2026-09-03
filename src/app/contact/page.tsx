"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, Upload } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";

// Zod validation schema
const contactSchema = z.object({
name: z.string().min(2, "Please enter your full name"),
email: z.string().email("Please enter a valid email"),
phone: z.string().min(7, "Please enter a valid phone number"),
projectType: z.string().min(1, "Please select a project type"),
services: z.array(z.string()).min(1, "Please select at least one service"),
location: z.string().min(2, "Please enter the project location"),
area: z.string().optional(),
budget: z.string().optional(),
timeline: z.string().optional(),
message: z.string().min(20, "Please provide at least 20 characters"),
consent: z.boolean().refine((value) => value === true, {
message: "Please accept the consent",
}),
});

type ContactFormData = z.infer<typeof contactSchema>;

const PROJECT_TYPES = [
"Residential",
"Commercial",
"Office",
"Retail",
"Hospitality",
"Renovation",
"Other",
];

const SERVICES = [
"Interior Design",
"Space Planning",
"Furniture Design",
"3D Visualization",
"Turnkey Execution",
"Renovation",
"Consultation",
];

const BUDGETS = [
"Under ₹5 Lakhs",
"₹5 – ₹10 Lakhs",
"₹10 – ₹25 Lakhs",
"₹25 – ₹50 Lakhs",
"₹50 Lakhs – ₹1 Crore",
"Above ₹1 Crore",
"Not sure yet",
];

const TIMELINES = [
"Immediately",
"Within 1 month",
"1 – 3 months",
"3 – 6 months",
"6+ months",
"Not decided",
];

const FAQs = [
{
question: "How does the interior design process work?",
answer:
"Our process begins with an initial consultation to understand your vision and requirements. We then create mood boards and 3D visualizations, followed by detailed planning and execution. We maintain regular communication throughout to ensure your project aligns with your expectations.",
},
{
question: "What information should I provide for a consultation?",
answer:
"It helps to share your budget, timeline, project location, and any reference images or inspiration. You can upload these directly in the form, or discuss them during our initial call. The more details you provide, the better we can tailor our proposal.",
},
{
question: "Do you handle turnkey execution?",
answer:
"Yes, we offer complete turnkey solutions. This means we manage everything from design to procurement, installation, and project completion. You can choose to be involved at every stage or let us handle it entirely.",
},
{
question: "Do you work outside Coimbatore?",
answer:
"Yes, we work across Tamil Nadu and nearby regions. For projects outside our immediate area, we coordinate with trusted local partners to ensure quality and consistency.",
},
{
question: "How long does an interior project usually take?",
answer:
"Project timelines vary based on scope and complexity. A small residential project might take 3-4 months, while larger commercial spaces could take 6-12 months. We'll provide a detailed timeline during your consultation.",
},
];

const BENEFITS = [
{
number: "01",
title: "Thoughtful Design",
description: "Every space is planned around your lifestyle and requirements.",
},
{
number: "02",
title: "Quality Craftsmanship",
description: "We focus on materials, details and execution quality.",
},
{
number: "03",
title: "End-to-End Support",
description: "From initial concept to final execution, we guide the process.",
},
];

export default function ContactPage() {
const [submitted, setSubmitted] = useState(false);
const [selectedServices, setSelectedServices] = useState<string[]>([]);
const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
const [openFAQ, setOpenFAQ] = useState<number | null>(0);

const {
register,
handleSubmit,
formState: { errors, isSubmitting },
reset,
} = useForm<ContactFormData>({
resolver: zodResolver(contactSchema),
defaultValues: {
services: [],
consent: false,
},
});

const onSubmit = async (data: ContactFormData) => {
// Simulate form submission delay
await new Promise((resolve) => setTimeout(resolve, 500));

void data;
setSubmitted(true);

};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
const files = Array.from(e.target.files || []);
const validFiles = files.filter((file) => {
const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const maxSize = 10 * 1024 * 1024; // 10MB
return validTypes.includes(file.type) && file.size <= maxSize;
});
setUploadedFiles((prev) => [...prev, ...validFiles]);
};

const removeFile = (index: number) => {
setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
};

const toggleService = (service: string) => {
setSelectedServices((prev) =>
prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
);
};

const resetForm = () => {
reset();
setSubmitted(false);
setSelectedServices([]);
setUploadedFiles([]);
};

return (
<>
<Navbar />
<PageHeader
     image="/images/hero.jpeg"
     imageAlt="Warm interior space designed by Orchid Interiors"
     title="Let's create a space you'll love to live in."
     description="Tell us about your project, and our team will get back to you to discuss your vision, requirements and next steps."
   />

  {/* Main Contact Section */}
  <section data-contact-info className="relative w-full bg-white px-4 py-20 sm:px-6 md:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Contact Information */}
        <div className="flex h-full flex-col justify-between gap-8 rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8 lg:p-10">
          {/* Studio */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-[0.32em] uppercase text-stone-600">
              Showrooms
            </h3>
            <div className="grid gap-3">
              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                  Showroom 01
                </p>
                <p className="text-base font-light text-black">Coimbatore</p>
                <p className="mt-2 text-sm text-stone-700">18, Cross Cut Road, RS Puram</p>
                <p className="mt-2 text-sm text-stone-700">hello@orchidinteriors.com</p>
                <p className="mt-2 text-sm text-stone-700">+91 98765 43210</p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                  Showroom 02
                </p>
                <p className="text-base font-light text-black">Chennai</p>
                <p className="mt-2 text-sm text-stone-700">42, Nungambakkam High Road</p>
                <p className="mt-2 text-sm text-stone-700">chennai@orchidinteriors.com</p>
                <p className="mt-2 text-sm text-stone-700">+91 98450 11223</p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                  Showroom 03
                </p>
                <p className="text-base font-light text-black">Bengaluru</p>
                <p className="mt-2 text-sm text-stone-700">7, Indiranagar 100 Feet Road</p>
                <p className="mt-2 text-sm text-stone-700">bengaluru@orchidinteriors.com</p>
                <p className="mt-2 text-sm text-stone-700">+91 99887 66554</p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                  Showroom 04
                </p>
                <p className="text-base font-light text-black">Hyderabad</p>
                <p className="mt-2 text-sm text-stone-700">22, Banjara Hills, Road No. 3</p>
                <p className="mt-2 text-sm text-stone-700">hyderabad@orchidinteriors.com</p>
                <p className="mt-2 text-sm text-stone-700">+91 99662 33445</p>
              </div>

              <div className="rounded-[1.25rem] border border-stone-200 bg-white p-4">
                <p className="mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-stone-500">
                  Showroom 05
                </p>
                <p className="text-base font-light text-black">Kochi</p>
                <p className="mt-2 text-sm text-stone-700">9, Marine Drive, Kochi</p>
                <p className="mt-2 text-sm text-stone-700">kochi@orchidinteriors.com</p>
                <p className="mt-2 text-sm text-stone-700">+91 98941 22001</p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-[0.32em] uppercase text-stone-600">
              Working Hours
            </h3>
            <p className="text-base text-stone-700">
              Monday – Saturday
              <br />
              9:30 AM – 6:30 PM
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-6 text-xs font-medium tracking-[0.32em] uppercase text-stone-600">
              Follow Us
            </h3>
            <div className="flex gap-6">
              <a
                href="#"
                aria-label="Instagram"
                className="text-black transition-opacity duration-300 hover:opacity-60"
              >
                IG
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="text-black transition-opacity duration-300 hover:opacity-60"
              >
                P
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-7">
            <p className="mb-5 text-xs font-medium tracking-[0.2em] uppercase text-stone-600">
              What happens next
            </p>

            <div className="space-y-5">
              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                  1
                </span>
                <div>
                  <h4 className="mb-1 text-base font-medium text-black">Discovery call</h4>
                  <p className="text-sm leading-6 text-stone-700">
                    We understand your lifestyle, requirements, and design direction.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                  2
                </span>
                <div>
                  <h4 className="mb-1 text-base font-medium text-black">Design proposal</h4>
                  <p className="text-sm leading-6 text-stone-700">
                    You receive a tailored concept, materials, and design planning.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                  3
                </span>
                <div>
                  <h4 className="mb-1 text-base font-medium text-black">Execution</h4>
                  <p className="text-sm leading-6 text-stone-700">
                    Our team oversees procurement, detailing, and project delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          data-contact-form
          className="h-full rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8 lg:p-10"
        >
          {submitted ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-stone-300 bg-white px-8 py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-light text-black">Thank you!</h3>
              <p className="mb-8 text-base text-stone-700">
                Your enquiry has been received. Our team will get back to you shortly.
              </p>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 border border-black px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register("name")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  {...register("phone")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Project Type */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Project Type <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("projectType")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-xs text-red-600">{errors.projectType.message}</p>
                )}
              </div>

              {/* Services Required */}
              <div data-form-field>
                <label className="mb-3 block text-sm font-medium text-black">
                  Services Required <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2">
                  {SERVICES.map((service) => (
                    <label key={service} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        value={service}
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="h-4 w-4 border border-stone-300 bg-white accent-black"
                      />
                      <span className="text-sm text-black">{service}</span>
                    </label>
                  ))}
                </div>
                {selectedServices.length === 0 && errors.services && (
                  <p className="mt-2 text-xs text-red-600">{errors.services.message}</p>
                )}
              </div>

              {/* Location */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Project Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City / Location"
                  {...register("location")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Property Size */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Property Size (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Approx. area in sq. ft."
                  {...register("area")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Budget */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Estimated Budget (Optional)
                </label>
                <select
                  {...register("budget")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="">Select your budget</option>
                  {BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Project Timeline (Optional)
                </label>
                <select
                  {...register("timeline")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="">When would you like to start?</option>
                  {TIMELINES.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div data-form-field>
                <label className="mb-2 block text-sm font-medium text-black">
                  Tell us about your project <span className="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="Tell us about your space, design preferences, requirements and anything else you'd like us to know..."
                  rows={5}
                  {...register("message")}
                  className="w-full border border-stone-300 bg-white px-4 py-3 text-base text-black outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div data-form-field>
                <label className="mb-3 block text-sm font-medium text-black">
                  Upload plans, drawings or reference images (Optional)
                </label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-stone-300 px-6 py-8 transition-all duration-300 hover:border-stone-400">
                  <label className="flex cursor-pointer flex-col items-center gap-2">
                    <Upload className="h-5 w-5 text-stone-600" />
                    <span className="text-sm text-stone-700">
                      Click to upload PDF, JPG, PNG (Max 10MB)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-2"
                      >
                        <span className="truncate text-sm text-stone-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consent */}
              <div data-form-field className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1 h-4 w-4 border border-stone-300 bg-white accent-black"
                />
                <label className="text-sm text-stone-700">
                  I agree to be contacted by Orchid Interiors regarding my project enquiry.
                  <span className="text-red-600"> *</span>
                </label>
              </div>
              {errors.consent && (
                <p className="text-xs text-red-600">{errors.consent.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                data-form-submit
                className="w-full border border-black bg-black px-6 py-4 text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Enquiry →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  </section>

  {/* Google Business Location */}
  <section data-contact-location className="relative w-full bg-stone-50 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <p className="mb-4 text-xs font-medium tracking-[0.32em] text-stone-600 uppercase">
          VISIT OUR STUDIO
        </p>
        <h2 className="max-w-md text-3xl font-light text-black sm:text-4xl">
          Find Orchid Interiors on Google.
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-stone-700">
          Visit our Coimbatore showroom at 18, Cross Cut Road, RS Puram, and meet the team behind your next space.
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Orchid+Interiors%2C+18+Cross+Cut+Road%2C+RS+Puram%2C+Coimbatore"
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          Open in Google Maps →
        </a>
      </div>
      <div className="h-[360px] overflow-hidden border border-stone-300 bg-stone-200 sm:h-[420px]">
        <iframe
          title="Orchid Interiors Coimbatore showroom location"
          src="https://www.google.com/maps?q=Orchid+Interiors%2C+18+Cross+Cut+Road%2C+RS+Puram%2C+Coimbatore&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>

  {/* Why Work With Us */}
  <section data-contact-benefits className="relative w-full bg-stone-50 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-light text-black sm:text-4xl md:text-5xl">
          Why Work With Orchid Interiors
        </h2>
      </div>
      <div className="grid gap-12 md:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.number} className="flex flex-col">
            <p className="mb-6 text-4xl font-light text-stone-400">{benefit.number}</p>
            <h3 className="mb-4 text-xl font-light text-black">{benefit.title}</h3>
            <p className="text-base leading-7 text-stone-700">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* FAQ Section */}
  <section data-contact-faq className="relative w-full bg-white px-4 py-20 sm:px-6 md:px-10 lg:px-16">
    <div className="mx-auto max-w-3xl">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-light text-black sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-4">
        {FAQs.map((faq, index) => (
          <div
            key={index}
            className="border border-stone-300 transition-all duration-300"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="flex w-full items-center justify-between bg-white px-6 py-4 text-left hover:bg-stone-50"
            >
              <h3 className="text-base font-medium text-black md:text-lg">
                {faq.question}
              </h3>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                  openFAQ === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFAQ === index && (
              <div className="border-t border-stone-300 bg-stone-50 px-6 py-4">
                <p className="text-base leading-7 text-stone-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer />
</>
);
}
