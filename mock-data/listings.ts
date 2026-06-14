export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "loft"
  | "cottage";

export type Listing = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  propertyType: PropertyType;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  guests: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
  };
  isFavorite: boolean;
  isNew: boolean;
  instantBook: boolean;
};

const propertyTypes: PropertyType[] = [
  "apartment",
  "house",
  "villa",
  "studio",
  "loft",
  "cottage",
];

const amenitiesList = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "TV",
  "Parking",
  "Pool",
  "Hot tub",
  "Gym",
  "Fireplace",
  "Balcony",
  "Garden",
  "Beach access",
  "Pet friendly",
];

const cities = [
  { name: "Habana", country: "Cuba", lat: 23.1436, lng: -82.3642 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
];

const titles = [
  "Cozy Modern Apartment",
  "Luxury Downtown Loft",
  "Charming Historic House",
  "Beachfront Villa",
  "Stylish Studio in Center",
  "Spacious Family Home",
  "Elegant Penthouse",
  "Rustic Countryside Cottage",
  "Minimalist Urban Retreat",
  "Boutique City Apartment",
  "Seaside Paradise",
  "Mountain View Escape",
  "Artistic Loft Space",
  "Traditional Family Villa",
  "Contemporary Design Home",
  "Quaint Garden Cottage",
  "Luxury Skyline View",
  "Peaceful Garden House",
  "Modern Minimalist Flat",
  "Historic Character Home",
];

const descriptions = [
  "Beautifully designed space perfect for your stay",
  "Experience luxury and comfort in this stunning property",
  "A unique blend of modern amenities and classic charm",
  "Perfect location with easy access to all attractions",
  "Spacious and well-appointed for a memorable stay",
  "Stylish accommodation in the heart of the city",
  "Peaceful retreat with all the comforts of home",
  "Elegant property with attention to every detail",
  "Contemporary living space with premium finishes",
  "Charming accommodation in a prime location",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomPrice(): number {
  return Math.floor(Math.random() * 400) + 50;
}

function createListing(
  id: string,
  cityIndex: number,
  titleIndex: number,
): Listing {
  const city = cities[cityIndex % cities.length];
  const propertyType = getRandomElement(propertyTypes);
  const bedrooms =
    propertyType === "studio" ? 0 : Math.floor(Math.random() * 4) + 1;
  const beds = bedrooms === 0 ? 1 : bedrooms + Math.floor(Math.random() * 2);
  const bathrooms = Math.max(1, bedrooms - Math.floor(Math.random() * 2));
  const guests = beds * 2;
  const pricePerNight = getRandomPrice();
  const rating = 4 + Math.random() * 1;
  const reviewCount = Math.floor(Math.random() * 200) + 10;
  const isSuperhost = Math.random() > 0.7;
  const hostName = `Host ${String.fromCharCode(
    65 + (id.charCodeAt(id.length - 1) % 26),
  )}`;

  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;

  return {
    id,
    title: titles[titleIndex % titles.length],
    description: getRandomElement(descriptions),
    address: `${Math.floor(Math.random() * 200) + 1} Main Street`,
    city: city.name,
    country: city.country,
    coordinates: {
      lat: city.lat + latOffset,
      lng: city.lng + lngOffset,
    },
    pricePerNight,
    propertyType,
    bedrooms,
    beds,
    bathrooms,
    guests,
    rating,
    reviewCount,
    images: Array.from(
      { length: 5 },
      () =>
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    ),
    amenities: getRandomElements(
      amenitiesList,
      Math.floor(Math.random() * 8) + 4,
    ),
    host: {
      name: hostName,
      avatar: `https://api.dicebear.com/9.x/glass/svg?seed=${hostName}`,
      isSuperhost,
    },
    isFavorite: Math.random() > 0.8,
    isNew: Math.random() > 0.9,
    instantBook: Math.random() > 0.5,
  };
}

export const revolicoListings: Listing[] = [
  {
    id: "rev-837492",
    title: "Renta de apartamento a ESTRENAR!!! Centro Habana",
    description:
      "Se renta apartamento totalmente nuevo, recién reparado con todo a estrenar. Cuenta con sala-comedor, cocina moderna equipada, habitación climatizada con cama camera y baño nuevo con presión de agua. Excelente ubicación cerca de zonas turísticas.",
    address: "Calle Neptuno e/ Belascoaín y Gervasio",
    city: "Centro Habana, La Habana",
    country: "Cuba",
    coordinates: {
      lat: 23.1365,
      lng: -82.3688,
    },
    pricePerNight: 35,
    propertyType: "apartment",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    guests: 2,
    rating: 4.9,
    reviewCount: 4,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    amenities: ["Aire acondicionado", "Cocina equipada", "Agua caliente", "TV"],
    host: {
      name: "Lisandra",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      isSuperhost: false,
    },
    isFavorite: false,
    isNew: true,
    instantBook: true,
  },
  {
    id: "rev-910432",
    title: "Espectacular Casa independiente con piscina en Miramar",
    description:
      "Gran propiedad independiente en zona residencial de Playa. Amplio jardín, garaje para 3 autos, portal, sala espacioso, comedor y cocina. Lo mejor es su patio trasero con piscina en perfectas condiciones y área de parrillada techada. Ideal para estancias largas o familias.",
    address: "Calle 22 e/ 3ra y 5ta Ave",
    city: "Playa, La Habana",
    country: "Cuba",
    coordinates: {
      lat: 23.1256,
      lng: -82.4274,
    },
    pricePerNight: 180,
    propertyType: "villa",
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    guests: 8,
    rating: 4.95,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    ],
    amenities: [
      "Piscina privada",
      "Parrillada",
      "Portal",
      "Garaje",
      "Seguridad 24h",
      "Cisterna propia",
    ],
    host: {
      name: "Eduardo",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      isSuperhost: true,
    },
    isFavorite: true,
    isNew: false,
    instantBook: false,
  },
  {
    id: "rev-776412",
    title: "Apartamento moderno y céntrico en La Víbora",
    description:
      "Se vende o renta apartamento en bajos, puerta de calle. Cuenta con sala, cocina-comedor amplia, baño moderno y habitación espaciosa en mezanine estilo loft. Todo enrejado, muy seguro, con teléfono fijo y contrato de Nauta Hogar incluido. Papeles en regla.",
    address: "Calle Patrocinio e/ 10 de Octubre y Carmen",
    city: "Diez de Octubre, La Habana",
    country: "Cuba",
    coordinates: {
      lat: 23.0982,
      lng: -82.3811,
    },
    pricePerNight: 25,
    propertyType: "loft",
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    guests: 3,
    rating: 4.72,
    reviewCount: 11,
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
    ],
    amenities: [
      "Teléfono fijo",
      "Nauta Hogar",
      "Puerta de calle",
      "Enrejado de seguridad",
    ],
    host: {
      name: "Orestes",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      isSuperhost: false,
    },
    isFavorite: false,
    isNew: false,
    instantBook: true,
  },
  {
    id: "rev-459102",
    title: "Estudio independiente climatizado en El Vedado",
    description:
      "Pequeño estudio ideal para una persona o pareja de paso por La Habana. Entrada totalmente independiente, cocina pequeña con refrigerador y hornito, baño con agua fría y caliente las 24 horas. Muy cerca de los hospitales del Vedado y de la avenida Línea.",
    address: "Calle K e/ 11 y 13",
    city: "Plaza de la Revolución, La Habana",
    country: "Cuba",
    coordinates: {
      lat: 23.1389,
      lng: -82.3922,
    },
    pricePerNight: 28,
    propertyType: "studio",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    guests: 2,
    rating: 4.65,
    reviewCount: 7,
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"],
    amenities: [
      "Entrada independiente",
      "Split climatizado",
      "Refrigerador",
      "Microondas",
    ],
    host: {
      name: "Beatriz",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      isSuperhost: false,
    },
    isFavorite: false,
    isNew: false,
    instantBook: true,
  },
];

// export const listings: Listing[] = Array.from({ length: 150 }, (_, i) => {
//   const cityIndex = i % cities.length;
//   return createListing(`listing-${i + 1}`, cityIndex, i);
// });

export const listings: Listing[] = revolicoListings;

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  house: "House",
  villa: "Villa",
  studio: "Studio",
  loft: "Loft",
  cottage: "Cottage",
};
