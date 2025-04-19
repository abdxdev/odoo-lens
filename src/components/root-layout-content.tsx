"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "//" || pathname === "") {
      router.push("/");
    }
  }, [pathname, router]);
  
  return (
    <SidebarInset className="flex-1 overflow-y-auto">
      <PageHeader />
      {children}
    </SidebarInset>
  );
}