import { createClient } from "./client";
import type { PropertyFormData } from "./types";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  mobile: string | null;
  country: string | null;
  gender: string | null;
};

export type PropertyRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  transaction_type: "sell" | "rent";
  property_type: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  area_sqm: number | null;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  is_active: boolean;
  created_at: string;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function upsertProfile(profile: Partial<Profile>): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });

  if (error) throw error;
}

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function uploadPropertyImages(
  files: File[],
): Promise<string[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);

    urls.push(urlData.publicUrl);
  }

  return urls;
}

export async function createProperty(
  data: PropertyFormData,
  imageUrls: string[],
): Promise<PropertyRow> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      transaction_type: data.transaction_type,
      property_type: data.property_type,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      guests: data.guests,
      area_sqm: data.area_sqm || null,
      address: data.address,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      images: imageUrls,
      amenities: data.amenities || [],
    })
    .select("*")
    .single();

  if (error) throw error;
  return property;
}

export async function getUserProperties(): Promise<PropertyRow[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateProperty(
  id: string,
  data: Partial<PropertyFormData>,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("properties")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
