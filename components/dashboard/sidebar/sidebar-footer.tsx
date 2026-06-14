import Link from "next/link";
import { SidebarFooter } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { User } from "./name-later";

export function RentalSidebarFooter() {
  return (
    <SidebarFooter className="px-2.5 pb-3">
      <div className="group-data-[collapsible=icon]:hidden space-y-3">
        <div className="group/sidebar relative flex flex-col gap-2 rounded-lg border p-4 text-sm w-full bg-background">
          <div className="text-balance text-lg font-semibold leading-tight group-hover/sidebar:underline">
            Apartamento con vista al mar en El Vedado
          </div>
          <div className="text-muted-foreground text-xs line-clamp-2">
            Excelente apartamento capitalista en zona céntrica, totalmente
            climatizado, con balcón y agua las 24 horas. Cerca de 23 y L.
          </div>

          <Button size="sm" className="w-full" asChild>
            <Link
              href="https://revolico.com/search?category=inmobiliaria&subcategory=inmobiliaria-casas"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en Revolico
            </Link>
          </Button>
        </div>
      </div>

      <User />
    </SidebarFooter>
  );
}
