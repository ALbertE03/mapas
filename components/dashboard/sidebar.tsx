import Link from "next/link";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { RentalSidebarContent } from "./sidebar/sidebar-content";
import { Home, Heart, GalleryVerticalEnd } from "lucide-react";
import { RentalSidebarFooter } from "./sidebar/sidebar-footer";

export function RentalsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-2.5 py-3">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-5 items-center justify-center rounded-md text-primary-foreground">
              <svg
                width="264"
                height="290"
                viewBox="0 0 264 290"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M131.512 118.256C138.262 121.308 165.963 138.712 173.203 143.081L263.665 197.767C256.137 210.486 248.769 224.311 241.649 237.309C227.843 229.224 214.117 221.009 200.471 212.667C187.779 204.887 158.226 180.998 154.546 210.087C153.552 217.961 154.105 228.518 154.113 236.642L154.193 289.074L131.888 289.089L109.275 289.091C109.26 272.482 111.909 213.349 106.268 201.803C105.021 199.248 103.158 196.742 100.332 195.858C96.526 194.666 91.6545 196.393 88.134 197.929C80.8356 201.112 73.886 206.082 67.0678 210.239C52.1912 219.307 37.2689 228.834 21.9385 237.085C14.6144 224.865 7.00897 210.502 0 197.936C42.6319 171.039 88.2166 144.556 131.512 118.256Z"
                  fill="#222222"
                />
                <path
                  d="M22.5876 52.4746C48.8653 69.3253 79.5453 87.0413 106.489 103.236C96.6572 109.694 85.4278 116.185 75.2912 122.311L63.0347 129.778C57.42 126.951 48.0282 120.967 42.4135 117.618L0.164062 92.2853L22.5876 52.4746Z"
                  fill="#222222"
                />
                <path
                  d="M240.817 52.748C244.36 56.1339 259.963 86.3716 263.138 92.2147C259.233 95.0921 247.976 101.448 243.454 104.17L200.608 129.783L188.895 122.664C178.279 116.416 167.736 110.037 157.273 103.527C184.854 86.3829 213.012 69.5739 240.817 52.748Z"
                  fill="#222222"
                />
                <path
                  d="M109.376 0L154.098 0.101052L154.138 74.9636L145.086 80.595L131.809 88.6963L109.312 75.015L109.376 0Z"
                  fill="#222222"
                />
              </svg>
            </div>
            Casabe
          </a>
        </div>
      </SidebarHeader>

      <RentalSidebarContent />

      <RentalSidebarFooter />
    </Sidebar>
  );
}
