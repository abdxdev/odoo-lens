"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsDialog } from "@/components/settings-dialog";

export function PageHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <PageBreadcrumb />
      <div className="flex-1" />
      <div className="hidden md:block" />
      <SettingsDialog />
      <ThemeToggle />
    </header>
  );
}