import { supabase } from "./supabase";

// Save user profile
export async function saveProfile(user) {
  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: user.user_metadata?.full_name || "User",
        email: user.email
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Fetch user profile
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}