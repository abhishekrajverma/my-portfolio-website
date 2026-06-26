import { getSupabaseAdmin } from "@/lib/supabase/server";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getSubscribersFromSupabase(): Promise<string[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null)
    .order("subscribed_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => row.email);
}

export async function addSubscriberToSupabase(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const supabase = getSupabaseAdmin();

  const { data: existing, error: lookupError } = await supabase
    .from("newsletter_subscribers")
    .select("id, unsubscribed_at")
    .eq("email", normalized)
    .maybeSingle();

  if (lookupError) {
    throw new Error(lookupError.message);
  }

  if (existing) {
    if (existing.unsubscribed_at) {
      const { error: resubscribeError } = await supabase
        .from("newsletter_subscribers")
        .update({ unsubscribed_at: null, subscribed_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (resubscribeError) {
        throw new Error(resubscribeError.message);
      }

      return true;
    }

    return false;
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: normalized });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return true;
}

export async function removeSubscriberFromSupabase(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", normalized)
    .is("unsubscribed_at", null);

  if (error) {
    throw new Error(error.message);
  }
}
