"use client";

import { SearchFaculty } from "@/components/search-faculty/search"
import { FacultyDetails } from "@/components/search-faculty/details"
import { FacultyPermissions } from "@/components/search-faculty/table";
import { PermissionsAIAnalysis } from "@/components/search-faculty/ai-analysis";
import { ChartComponent } from "@/components/search-faculty/chart";
import { useState, useEffect } from "react"
import { Faculty } from "@/types/faculty"
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [groupPermissionsData, setGroupPermissionsData] = useState<Record<string, unknown>[]>([]);
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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 w-full"
      >
        <motion.div variants={item} className="w-full">
          <SearchFaculty onSelectFaculty={handleSelectFaculty} />
        </motion.div>

        {selectedFaculty && (
          <motion.div variants={item} className="w-full">
            <FacultyDetails faculty={selectedFaculty} />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {selectedFaculty && (
            <motion.div variants={item}>
              <FacultyPermissions faculty={selectedFaculty} />
            </motion.div>
          )}

          {selectedFaculty && (
            <motion.div variants={item}>
              <ChartComponent permissionsData={groupPermissionsData} />
            </motion.div>
          )}
        </motion.div>

        {selectedFaculty && (
          <motion.div variants={item}>
            <PermissionsAIAnalysis
              groupPermissionsData={groupPermissionsData}
              isLoading={isLoadingPermissions}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
