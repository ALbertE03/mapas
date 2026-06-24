import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RentalsSidebar } from "@/components/dashboard/sidebar";
import { SupabaseSync } from "@/components/dashboard/supabase-sync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SupabaseSync />
      <RentalsSidebar />
      <SidebarInset className="overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
