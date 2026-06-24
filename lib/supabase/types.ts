export type PropertyFormData = {
  title: string;
  description: string;
  transaction_type: "sell" | "rent";
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  area_sqm?: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  amenities: string[];
};
