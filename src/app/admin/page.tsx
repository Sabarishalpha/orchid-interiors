import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";
import { requireAdminPage } from "@/lib/admin-page";
import { contentKinds, type ContentKind } from "@/lib/content-schema";
import { getContentItems } from "@/lib/content-store";
import { isFirebaseConfigured } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPage();
  const { saved } = await searchParams;
  const initialNotice =
    saved === "published"
      ? "Content changes are published and live on the website."
      : saved === "warning"
        ? "Content is live, but some replaced media could not be removed from Firebase Storage."
        : "";
  if (!isFirebaseConfigured()) {
    return (
      <AdminDashboard
        initialError="Configure the Firebase project, service account, and Storage bucket variables to manage content."
        initialNotice={initialNotice}
      />
    );
  }

  let initialContent: Record<
    ContentKind,
    Awaited<ReturnType<typeof getContentItems>>
  > | null = null;
  let initialError = "";
  try {
    const entries = await Promise.all(
      contentKinds.map(async (kind) => [kind, await getContentItems(kind, true)] as const),
    );
    initialContent = Object.fromEntries(entries) as Record<
      ContentKind,
      Awaited<ReturnType<typeof getContentItems>>
    >;
  } catch (error) {
    console.error(
      "Could not load admin dashboard content:",
      error instanceof Error ? error.message : "Unknown error",
    );
    initialError = "Website content could not be loaded. Check Firebase configuration and try again.";
  }

  if (initialError) {
    return <AdminDashboard initialError={initialError} initialNotice={initialNotice} />;
  }
  return <AdminDashboard initialContent={initialContent ?? undefined} initialNotice={initialNotice} />;
}
