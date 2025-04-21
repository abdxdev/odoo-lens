"use client";

import { useState, useEffect, ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CombinedSearch, SearchType } from "@/components/shared/combined-search";
import { CombinedDetails } from "@/components/shared/combined-details";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Animation variants
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

interface EntityExplorerPageProps {
  type: SearchType;
  entityTypeName: string;
  urlIdParam: string;
  urlNameParam: string;
  fetchDataFn: (id: number, name: string) => Promise<any>;
  tableComponent: (props: any) => ReactNode;
}

export function EntityExplorerPage({
  type,
  entityTypeName,
  urlIdParam,
  urlNameParam,
  fetchDataFn,
  tableComponent: TableComponent
}: EntityExplorerPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const entityId = searchParams.get(urlIdParam) ? parseInt(searchParams.get(urlIdParam)!) : undefined;
  const entityName = searchParams.get(urlNameParam) || searchParams.get("model") || undefined;

  const [selectedEntity, setSelectedEntity] = useState<{ id: number; name: string } | null>(
    entityId && entityName ? { id: entityId, name: entityName } : null
  );
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If URL params change, update the selected entity
    if (entityId && entityName && (!selectedEntity || selectedEntity.id !== entityId)) {
      setSelectedEntity({ id: entityId, name: entityName });
    }
  }, [entityId, entityName, selectedEntity]);

  useEffect(() => {
    if (!selectedEntity?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDataFn(selectedEntity.id, selectedEntity.name);
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${entityTypeName} data:`, err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedEntity?.id, selectedEntity?.name, entityTypeName, fetchDataFn]);

  const handleEntitySelect = (entity: { id: number; name: string }) => {
    setSelectedEntity(entity);

    // Update URL with the selected entity information
    const params = new URLSearchParams({
      [urlIdParam]: entity.id.toString(),
      [urlNameParam]: entity.name
    });

    router.push(`/${type === 'model' ? 'explore-model' : 'review-permissions'}?${params.toString()}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >
      {/* Search and Entity Details in a row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <div className="h-full">
            <CombinedSearch type={type} onSelect={handleEntitySelect} />
          </div>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <div className="h-full">
            {selectedEntity ? (
              <CombinedDetails type={type} item={selectedEntity} />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{entityTypeName} Details</CardTitle>
                  <CardDescription>
                    Select a {entityTypeName.toLowerCase()} to view its details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>No {entityTypeName.toLowerCase()} selected. Please use the search on the left to select a {entityTypeName.toLowerCase()}.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Data table below */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {selectedEntity && (
          <motion.div variants={item}>
            <TableComponent
              {...{
                [`${type === 'model' ? 'model' : 'group'}Id`]: selectedEntity.id,
                [`${type === 'model' ? 'model' : 'group'}Name`]: selectedEntity.name,
                [type === 'model' ? 'fields' : 'permissions']: data,
                isLoading,
                error
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}