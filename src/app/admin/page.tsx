import { requireAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminEntryPage() {
  await requireAdminSession();
  redirect("/admin/projects");
}
