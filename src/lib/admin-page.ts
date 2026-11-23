import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  getAdminAuthConfig,
  isValidAdminSession,
} from "@/lib/admin-auth";

export async function requireAdminPage() {
  const config = getAdminAuthConfig();
  if (!config) redirect("/admin/login");

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSession(token, config.username, config.secret)) {
    redirect("/admin/login");
  }
}
