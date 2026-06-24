"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ImageIcon,
  X,
  MapPin,
  Plus,
  UploadCloud,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createProperty } from "@/lib/supabase/queries";
import type { PropertyFormData } from "@/lib/supabase/types";
import { useRentalsStore } from "@/store/rentals-store";
import type { PropertyType } from "@/mock-data/listings";
import { MapView } from "./map-view-setadd";

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
  { value: "loft", label: "Loft" },
  { value: "cottage", label: "Cottage" },
];

export function CreateAdForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "map">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    transaction_type: "rent",
    property_type: "apartment",
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    area_sqm: undefined,
    address: "",
    city: "",
    latitude: 23.1436,
    longitude: -82.3642,
    amenities: [],
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationTouched, setLocationTouched] = useState(false);

  const handleLocationSelect = (loc: { lat: number; lng: number }) => {
    setLocation(loc);
    setLocationTouched(true);
    setFormData((prev) => ({ ...prev, latitude: loc.lat, longitude: loc.lng }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024,
    );
    const newImages = [...images, ...validFiles].slice(0, 10);
    setImages(newImages);
    setImagePreviews(
      newImages.map((f) => URL.createObjectURL(f)),
    );
    if (e.target) e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const urls: string[] = [];
    for (const file of images) {
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
  };

  const handleSubmit = async () => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.price || formData.price <= 0) errors.push("Price must be greater than 0");
    if (!locationTouched || !location) errors.push("Select a location on the map");
    if (errors.length > 0) {
      setError(errors.join(". "));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const imageUrls = await uploadImages();
      const property = await createProperty(formData, imageUrls);

      useRentalsStore.getState().addListing({
        id: property.id,
        title: property.title,
        description: property.description || "",
        address: property.address || "",
        city: property.city || "",
        country: property.country,
        coordinates: { lat: property.latitude, lng: property.longitude },
        pricePerNight: property.transaction_type === "rent" ? property.price : property.price,
        propertyType: property.property_type as PropertyType,
        bedrooms: property.bedrooms,
        beds: property.bedrooms,
        bathrooms: property.bathrooms,
        guests: property.guests,
        rating: 0,
        reviewCount: 0,
        images: property.images,
        amenities: property.amenities,
        host: { name: "You", avatar: "", isSuperhost: false },
        isFavorite: false,
        isNew: true,
        instantBook: false,
      });

      router.push("/my-ads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "map") {
    return (
      <div className="relative h-full w-full">
        <MapView onLocationSelect={handleLocationSelect} />
        <div className="absolute left-4 top-4 z-30 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep("form")}
            className="bg-background shadow-lg"
          >
            ← Back to form
          </Button>
          {location && (
            <div className="rounded-lg bg-background px-3 py-2 text-xs shadow-lg">
              <MapPin className="mr-1 inline size-3" />
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create Publication</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details of your property
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>
                Describe your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select
                    value={formData.transaction_type}
                    onValueChange={(v: "sell" | "rent") =>
                      setFormData((prev) => ({ ...prev, transaction_type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sell">For Sale</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, property_type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {propertyTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Cozy apartment in Vedado"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  placeholder="350"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
              <CardDescription>Property specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bedrooms: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Guests</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        guests: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Area (m²)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="60"
                    value={formData.area_sqm || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        area_sqm: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
              <CardDescription>
                Address and map position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Calle 23 e/ L y M"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Habana"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className={`rounded-lg border p-4 ${!locationTouched ? "border-destructive/50 bg-destructive/5" : "bg-muted/30"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-4 text-primary" />
                    <span className="font-medium">Position on map *</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("map")}
                  >
                    {locationTouched ? "Change" : "Select"}
                  </Button>
                </div>
                {locationTouched && location ? (
                  <p className="text-xs text-muted-foreground">
                    Lat: {location.lat.toFixed(4)}, Lng:{" "}
                    {location.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-xs text-destructive">
                    Click "Select" to choose a location on the map
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photos</CardTitle>
              <CardDescription>
                Upload up to 10 images (max 5MB each)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative aspect-4/3 overflow-hidden rounded-lg border">
                    <img
                      src={preview}
                      alt={`Image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 size-6"
                      onClick={() => removeImage(i)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 10 && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex aspect-4/3 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-center">
                      <UploadCloud className="mx-auto mb-1 size-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Add photo
                      </span>
                    </div>
                  </button>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {submitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
