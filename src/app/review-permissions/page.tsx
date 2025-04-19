"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModelPermissionsReview } from "@/components/model-permissions-review";
import { RoleSearch } from "@/components/role-search";
import { RoleDetails } from "@/components/role-details";
import { GroupPermission } from "@/types/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewPermissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") ? parseInt(searchParams.get("groupId")!) : undefined;
  const groupName = searchParams.get("groupName") || undefined;

  const [selectedRole, setSelectedRole] = useState<{ id: number; name: string } | null>(
    groupId && groupName ? { id: groupId, name: groupName } : null
  );
  const [permissions, setPermissions] = useState<GroupPermission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If URL params change, update the selected role
    if (groupId && groupName && (!selectedRole || selectedRole.id !== groupId)) {
      setSelectedRole({ id: groupId, name: groupName });
    }
  }, [groupId, groupName, selectedRole]);

  useEffect(() => {
    if (!selectedRole?.id) return;

    const fetchPermissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/odoo/permissions?group_id=${selectedRole.id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data = await res.json();
        setPermissions(data);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [selectedRole?.id]);

  const handleRoleSelect = (role: { id: number; name: string }) => {
    setSelectedRole(role);

    // Update URL with the selected role information
    const params = new URLSearchParams({
      groupId: role.id.toString(),
      groupName: role.name
    });

    router.push(`/review-permissions?${params.toString()}`);
  };

  return (
    <main className="flex-1 flex-col space-y-6 p-6 2xl:mx-40">
      {/* Search and Role Details in a row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <div className="h-full">
            <RoleSearch onSelectRole={handleRoleSelect} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="h-full">
            {selectedRole ? (
              <RoleDetails role={selectedRole} />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Role Details</CardTitle>
                  <CardDescription>
                    Select a role to view its details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>No role selected. Please use the search on the left to select a role.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Permissions table below */}
      <div className="w-full">
        {!selectedRole ? (
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Search and select a role to view its permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Select a role to view detailed model permissions.
                You can also navigate to this page directly from the faculty permissions table
                by clicking on a group in the Permissions Summary.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ModelPermissionsReview
            groupId={selectedRole.id}
            groupName={selectedRole.name}
            permissions={permissions}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </main>
  );
}