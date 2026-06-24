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

      let query = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (user) {
        query = query.or(`is_active.eq.true,user_id.eq.${user.id}`);
      } else {
        query = query.eq("is_active", true);
      }

      const { data: properties } = await query;

      let favIds = new Set<string>();
      if (user) {
        const { data: favs } = await supabase
          .from("favorites")
          .select("property_id")
          .eq("user_id", user.id);
        favIds = new Set((favs || []).map((f: any) => f.property_id));
      }

      const listings = (properties || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        address: p.address || "",
        city: p.city || "",
        country: p.country,
        coordinates: { lat: p.latitude, lng: p.longitude },
        pricePerNight: p.price,
        transactionType: p.transaction_type,
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

      setListings(listings);
    })();
  }, [setListings]);

  return null;
}
