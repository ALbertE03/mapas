"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PropertyRow } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Trash2,
  Home,
  Pencil,
  Star,
} from "lucide-react";

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  villa: "Villa",
  studio: "Studio",
  loft: "Loft",
  cottage: "Cottage",
};

export function MyAdsView() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});

  const loadProperties = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setProperties(data || []);

    const ratingMap: Record<string, { avg: number; count: number }> = {};
    for (const p of data || []) {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("property_id", p.id);
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        ratingMap[p.id] = { avg: sum / reviews.length, count: reviews.length };
      }
    }
    setRatings(ratingMap);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Ads</h1>
            <p className="text-muted-foreground text-sm">
              {properties.length} {properties.length === 1 ? "property" : "properties"}
            </p>
          </div>
          <Button asChild>
            <a href="/create-ad">Create ad</a>
          </Button>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Home className="mb-4 size-12 text-muted-foreground" />
            <p className="text-lg font-medium">No ads yet</p>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first publication
            </p>
            <Button asChild>
              <a href="/create-ad">Create ad</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => {
              const rating = ratings[property.id];
              return (
                <Card key={property.id}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg">
                      {property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Home className="size-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">
                              {property.title}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="size-3" />
                              <span className="truncate">
                                {property.address || property.city || "No address"}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              property.transaction_type === "rent"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {property.transaction_type === "rent"
                              ? "For Rent"
                              : "For Sale"}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {propertyTypeLabels[property.property_type] ||
                              property.property_type}
                          </span>
                          <span>•</span>
                          <span>{property.bedrooms} beds</span>
                          <span>•</span>
                          <span>{property.bathrooms} baths</span>
                          {rating && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                {rating.avg.toFixed(1)} ({rating.count})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          ${property.price}
                          {property.transaction_type === "rent" && (
                            <span className="text-xs font-normal text-muted-foreground">
                              /month
                            </span>
                          )}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive"
                            onClick={() => handleDelete(property.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
