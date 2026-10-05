import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentEditor from "../../ContentEditor";
import { requireAdminPage } from "@/lib/admin-page";
import { isContentKind } from "@/lib/content-schema";
import { getContentItems } from "@/lib/content-store";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "Edit Content",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ kind: string; slug: string }> };

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: PageProps) {
  await requireAdminPage();
  const { kind, slug } = await params;
  if (!isContentKind(kind)) notFound();

  if (!isFirebaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 px-5">
        <section className="max-w-xl rounded-2xl border border-amber-200 bg-white p-7">
          <h1 className="text-xl font-medium">Firebase setup required</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Configure the private Firebase project, service-account, and Storage bucket
            environment variables described in the README before editing content.
          </p>
        </section>
      </main>
    );
  }

  const item = (await getContentItems(kind, true)).find(
    (contentItem) => contentItem.slug === slug,
  );
  if (!item) notFound();

  return <ContentEditor initialItem={{ ...item, description: item.description ?? "" }} kind={kind} />;
}
