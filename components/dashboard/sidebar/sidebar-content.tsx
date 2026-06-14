"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRentalsStore } from "@/store/rentals-store";
import { propertyTypeLabels, type PropertyType } from "@/mock-data/listings";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "compra", title: "Compra", href: "/compra" },
  { id: "alquiler", title: "Alaquiler", href: "/alquiler" },
];

const propertyTypes: PropertyType[] = [
  "apartment",
  "house",
  "villa",
  "studio",
  "loft",
  "cottage",
];

export function RentalSidebarContent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const {
    listings,
    searchQuery,
    setSearchQuery,
    selectedPropertyTypes,
    togglePropertyType,
    priceRange,
    setPriceRange,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    getFilteredListings,
    getFavoriteListings,
    resetFilters,
  } = useRentalsStore();

  const favoriteCount = listings.filter((l) => l.isFavorite).length;
  const allCount = listings.length;
  const filteredCount = getFilteredListings().length;

  const activeFiltersCount =
    selectedPropertyTypes.length +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0) +
    (bedrooms !== null ? 1 : 0) +
    (bathrooms !== null ? 1 : 0);
  return (
    <SidebarContent className="px-2.5">
      <SidebarGroup className="p-0">
        <SidebarGroupContent>
          {/* 
          1. Usamos 'pathname' como el valor activo actual. 
          Cada vez que cambie la ruta, shadcn sabrá qué pestaña marcar como activa.
        */}
          <Tabs value={pathname} className="w-full">
            <TabsList className="w-full justify-start h-10 p-1 bg-muted">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                let badge: number | undefined;
                if (item.id === "alquiler") badge = favoriteCount;
                if (item.id === "compra") badge = allCount;

                return (
                  /* 
                  2. 'asChild' le dice a Radix/shadcn que no renderice un botón,
                     sino que use el componente <Link> de abajo manteniendo los estilos de pestaña.
                */
                  <TabsTrigger
                    key={item.id}
                    value={item.href} // El valor debe coincidir con la URL para que se active solo
                    asChild
                    className="w-full justify-center"
                  >
                    <Link href={item.href}>
                      {/* <item.icon className="size-4 shrink-0" /> */}
                      <span className="text-sm">{item.title}</span>

                      {/* 3. El Badge adaptado al diseño de las pestañas */}
                      {badge !== undefined && badge > 0 && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 text-xs font-medium transition-colors pointer-events-none",
                            isActive
                              ? "bg-muted text-muted-foreground hover:bg-muted"
                              : "bg-background text-muted-foreground shadow-sm",
                          )}
                        >
                          {badge}
                        </Badge>
                      )}
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0 mt-4">
        <SidebarGroupLabel className="px-0 h-6">
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Search
          </span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-7 text-sm"
              />
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0 mt-4">
        <SidebarGroupLabel className="px-0 h-6 flex items-center justify-between">
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1.5 text-[10px]"
              onClick={resetFilters}
            >
              Clear
            </Button>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 space-y-4">
            <div>
              <p className="text-xs font-medium mb-2 text-sidebar-foreground">
                Property type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {propertyTypes.map((type) => (
                  <Button
                    key={type}
                    variant={
                      selectedPropertyTypes.includes(type)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => togglePropertyType(type)}
                    className={cn(
                      "h-7 text-xs px-2",
                      selectedPropertyTypes.includes(type) &&
                        "bg-primary text-primary-foreground",
                    )}
                  >
                    {propertyTypeLabels[type]}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium mb-2 text-sidebar-foreground">
                Price range
              </p>
              <div className="space-y-2">
                <div className="px-2">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={(value) =>
                      setPriceRange([value[0], value[1]])
                    }
                    min={0}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      ${priceRange[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium mb-2 text-sidebar-foreground">
                Rooms
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sidebar-foreground">
                    Bedrooms
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setBedrooms(
                          bedrooms !== null && bedrooms > 0
                            ? bedrooms - 1
                            : null,
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-xs">
                      {bedrooms ?? "Any"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setBedrooms((bedrooms ?? 0) + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sidebar-foreground">
                    Bathrooms
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setBathrooms(
                          bathrooms !== null && bathrooms > 0
                            ? bathrooms - 1
                            : null,
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-xs">
                      {bathrooms ?? "Any"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setBathrooms((bathrooms ?? 0) + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
