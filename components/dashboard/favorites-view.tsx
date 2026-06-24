"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PropertyRow } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRentalsStore } from "@/store/rentals-store";
import type { Listing } from "@/mock-data/listings";

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  villa: "Villa",
  studio: "Studio",
  loft: "Loft",
  cottage: "Cottage",
};

export function FavoritesView() {
  const [favorites, setFavorites] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const addListing = useRentalsStore((s) => s.addListing);

  const loadFavorites = async () => {
    const supabase = createClient();
    const { data: favs } = await supabase
      .from("favorites")
      .select("property_id, properties(*)");

    const props: PropertyRow[] = (favs || [])
      .filter((f: any) => f.properties)
      .map((f: any) => f.properties);

    setFavorites(props);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (propertyId: string) => {
    const supabase = createClient();
    await supabase
      .from("favorites")
      .delete()
      .eq("property_id", propertyId);
    setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground text-sm">
            {favorites.length} saved {favorites.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="mb-4 size-12 text-muted-foreground" />
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-muted-foreground text-sm">
              Save properties you like
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {favorites.map((property) => (
              <Card key={property.id}>
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => removeFavorite(property.id)}
                    >
                      <Heart className="size-4 fill-destructive text-destructive" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold">{property.title}</h3>
                      <Badge
                        variant={
                          property.transaction_type === "rent"
                            ? "secondary"
                            : "default"
                        }
                        className="shrink-0"
                      >
                        {property.transaction_type === "rent"
                          ? "Rent"
                          : "Sale"}
                      </Badge>
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="truncate">
                        {property.address || property.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {propertyTypeLabels[property.property_type] ||
                          property.property_type}
                      </span>
                      <span>•</span>
                      <span>{property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{property.bathrooms} baths</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        ${property.price}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          addListing({
                            id: property.id,
                            title: property.title,
                            description: property.description || "",
                            address: property.address || "",
                            city: property.city || "",
                            country: property.country,
                            coordinates: {
                              lat: property.latitude,
                              lng: property.longitude,
                            },
                            pricePerNight: property.price,
                            propertyType: property.property_type as any,
                            bedrooms: property.bedrooms,
                            beds: property.bedrooms,
                            bathrooms: property.bathrooms,
                            guests: property.guests,
                            rating: 0,
                            reviewCount: 0,
                            images: property.images,
                            amenities: property.amenities,
                            host: {
                              name: "",
                              avatar: "",
                              isSuperhost: false,
                            },
                            isFavorite: true,
                            isNew: false,
                            instantBook: false,
                          });
                        }}
                      >
                        <Link href="/">View on map</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
