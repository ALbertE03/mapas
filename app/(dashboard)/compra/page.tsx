import { MapView } from "@/components/dashboard/map-view";
import { ListingsPanel } from "@/components/dashboard/listings-panel";
import { MapControls } from "@/components/dashboard/map-controls";

export default function CompraPage() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapView />
      <ListingsPanel mode="compra" />
      <MapControls />
    </div>
  );
}
