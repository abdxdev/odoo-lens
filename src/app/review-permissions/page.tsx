"use client";

import { ModelPermissionsReview } from "@/components/review-permissions/table";
import { EntityExplorerPage } from "@/components/shared/entity-explorer-page";
import { getGroupPermissions } from "@/lib/permissions";

export default function ReviewPermissionsPage() {
  const fetchRolePermissions = async (id: number) => {
    return await getGroupPermissions(id);
  };

  return (
    <EntityExplorerPage
      type="role"
      entityTypeName="Role"
      urlIdParam="groupId"
      urlNameParam="groupName"
      fetchDataFn={fetchRolePermissions}
      tableComponent={ModelPermissionsReview}
    />
  );
}