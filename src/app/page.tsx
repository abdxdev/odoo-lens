"use client";

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
import { PermissionsAIAnalysis } from "@/components/permissions-ai-analysis";
import { ChartComponent } from "@/components/chart-component";
import { useState, useEffect } from "react"
import { Faculty } from "@/types/faculty"

export default function Home() {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [groupPermissionsData, setGroupPermissionsData] = useState<any[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState<boolean>(false);

  const handleSelectFaculty = (faculty: Faculty | null) => {
    setSelectedFaculty(faculty);
  };

  useEffect(() => {
    const handlePermissionsLoaded = (event: CustomEvent) => {
      const { permissionsData, isLoading } = event.detail;
      setGroupPermissionsData(permissionsData || []);
      setIsLoadingPermissions(isLoading);
    };

    window.addEventListener('permissionsLoaded', handlePermissionsLoaded as EventListener);

    return () => {
      window.removeEventListener('permissionsLoaded', handlePermissionsLoaded as EventListener);
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 overflow-y-auto">
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
        <main className="flex-1 flex-col space-y-6 p-6 2xl:mx-40">

          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="w-full">
              <SearchFaculty onSelectFaculty={handleSelectFaculty} />
            </div>

            {selectedFaculty && (
              <div className="w-full">
                <FacultyDetails faculty={selectedFaculty} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {selectedFaculty && (
                <FacultyPermissions faculty={selectedFaculty} />
              )}

              {selectedFaculty && (
                <ChartComponent permissionsData={groupPermissionsData} />
              )}
            </div>

            {selectedFaculty && (
              <PermissionsAIAnalysis
                groupPermissionsData={groupPermissionsData}
                isLoading={isLoadingPermissions}
              />
            )}
          </div>
          {/* <DataTableDemo/> */}

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
