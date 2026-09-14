import { getMediaLibrary } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import Image from "next/image";

export default async function MediaLibraryAdminPage() {
  await requireAdminSession();
  const media = getMediaLibrary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
            Media Library
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-[-0.05em] text-black">
            Uploaded files
          </h1>
        </div>
        <button className="rounded-full bg-black px-5 py-2.5 text-sm text-white">
          Upload media
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-stone-200">
              {item.mime_type.startsWith("image/") ? (
                <Image
                  src={item.file_url}
                  alt={item.original_name}
                  fill
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-stone-500">
                  Video
                </div>
              )}
            </div>
            <p className="font-medium text-stone-800">{item.original_name}</p>
            <p className="mt-2 text-xs text-stone-500">
              {item.mime_type} • {item.file_size} bytes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
