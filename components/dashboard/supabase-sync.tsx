"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRentalsStore } from "@/store/rentals-store";

export function SupabaseSync() {
  const setListings = useRentalsStore((s) => s.setListings);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (!properties || properties.length === 0) return;

      const { data: favs } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", user.id);

      const favIds = new Set((favs || []).map((f: any) => f.property_id));

      const store = useRentalsStore.getState();
      const existingIds = new Set(store.listings.map((l) => l.id));

      const newListings = properties
        .filter((p) => !existingIds.has(p.id))
        .map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          address: p.address || "",
          city: p.city || "",
          country: p.country,
          coordinates: { lat: p.latitude, lng: p.longitude },
          pricePerNight: p.price,
          propertyType: p.property_type as any,
          bedrooms: p.bedrooms,
          beds: p.bedrooms,
          bathrooms: p.bathrooms,
          guests: p.guests,
          rating: 0,
          reviewCount: 0,
          images: p.images,
          amenities: p.amenities,
          host: { name: "You", avatar: "", isSuperhost: false },
          isFavorite: favIds.has(p.id),
          isNew: true,
          instantBook: false,
        }));

      if (newListings.length > 0) {
        setListings([...newListings, ...store.listings]);
      }
    })();
  }, [setListings]);

  return null;
}
