"use client";

import { ModelFieldsReview } from "@/components/explore-model/table";
import { EntityExplorerPage } from "@/components/shared/entity-explorer-page";
import { getTableFields } from "@/lib/fields";
import { Suspense } from "react";

export default function ReviewFieldsPage() {
  const fetchModelFields = async (id: number, name: string) => {
    return await getTableFields(name);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityExplorerPage
        type="model"
        entityTypeName="Model"
        urlIdParam="modelId"
        urlNameParam="modelName"
        fetchDataFn={fetchModelFields}
        tableComponent={ModelFieldsReview}
      />
    </Suspense>
  );
}