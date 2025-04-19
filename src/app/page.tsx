"use client";

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
    </main>
  );
}
