import { createSupabaseServerClient } from "@/lib/supabase/server-auth";

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const adminEmail = getAdminEmail();
  if (adminEmail && user.email?.toLowerCase() !== adminEmail) {
    return null;
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
