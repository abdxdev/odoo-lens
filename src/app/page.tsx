"use client";

import { DataTableDemo } from "@/components/example-employee-table";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SearchFaculty } from "@/components/search-faculty"
import { FacultyDetails } from "@/components/faculty-details"
import { FacultyPermissions } from "@/components/faculty-permissions";
import { useState } from "react"
import { Faculty } from "@/types/faculty"

export default function Home() {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const handleSelectFaculty = (faculty: Faculty | null) => {
    setSelectedFaculty(faculty);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Odoo Lens
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Search Faculty</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex-1" />
          <div className="hidden md:block" />
          <ThemeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <section className="mx-auto w-full max-w-3xl space-y-6">
            <div className="space-y-6">
              <SearchFaculty onSelectFaculty={handleSelectFaculty} />
              <FacultyDetails faculty={selectedFaculty} />
              <FacultyPermissions faculty={selectedFaculty} />
              <DataTableDemo />
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
