"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Settings,
  ChevronsUpDown,
  UserIcon,
  Megaphone,
  Bookmark,
} from "lucide-react"; // Añadimos UserIcon por si no hay foto
import { LogoutButton } from "../../logout-button";
import TabsUnderlineDemo from "../profile/Profile";

// Definimos la interfaz básica de lo que esperas de Supabase
interface UserMenuClientProps {
  user: {
    avatar_url?: string;
    name?: string;
    full_name?: string; // Supabase suele llamarlo full_name o name
    email?: string;
  };
}

export function UserMenuClient({ user }: UserMenuClientProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const menuItems = [
    { label: "Favoritos", href: "/favorites", Icon: Bookmark },
    { label: "Mis anuncios", href: "/my-ads", Icon: Megaphone },
  ];

  // Fallbacks de información en caso de que falten datos
  const userImage = user?.avatar_url;
  const userName = user?.full_name || user?.name || "Usuario";
  const userEmail = user?.email || "sin-correo@dominio.com";

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {/* Botón del Sidebar con foto y textos laterales */}
          <button className="flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-md p-1.5 transition-colors shrink-0 outline-none text-left">
            {/* Contenedor del Avatar */}
            <div className="flex size-8 items-center justify-center rounded-full bg-muted overflow-hidden shrink-0 border">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="size-full object-cover"
                />
              ) : (
                <UserIcon className="size-4 text-muted-foreground" />
              )}
            </div>

            {/* Nombre y flechas indicadoras (Se ocultan si el sidebar colapsa) */}
            <div className="flex flex-1 items-center justify-between min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold text-foreground">
                  {userName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64"
          //   side="bottom"
          sideOffset={8}
        >
          {/* Opciones del menú */}
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={`${item.href}-${index}`}
              asChild
              className="gap-2 cursor-pointer py-2"
            >
              <Link href={item.href}>
                <item.Icon className="size-4 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="gap-2 cursor-pointer py-2"
            onSelect={() => {
              setDropdownOpen(false);
              setDialogOpen(true);
            }}
          >
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>

          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EL DIALOG (Totalmente fuera del Dropdown) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Aumentamos el ancho aquí con max-w-3xl */}
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sticky Footer</DialogTitle>
            <DialogDescription>
              This dialog has a sticky footer that stays visible while the
              content scrolls.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <TabsUnderlineDemo />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
