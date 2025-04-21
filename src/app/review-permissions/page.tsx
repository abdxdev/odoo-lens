"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModelPermissionsReview } from "@/components/review-permissions/table";
import { RoleSearch } from "@/components/review-permissions/search";
import { RoleDetails } from "@/components/review-permissions/details";
import { GroupPermission } from "@/types/permissions";
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
        const res = await fetch(`/api/odoo/review-permissions?group_id=${selectedRole.id}`);
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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >
      {/* Search and Role Details in a row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <div className="h-full">
            <RoleSearch onSelectRole={handleRoleSelect} />
          </div>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
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
        </motion.div>
      </motion.div>

      {/* Permissions table below */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {selectedRole && (
          <motion.div variants={item}>
            <ModelPermissionsReview
              groupId={selectedRole.id}
              groupName={selectedRole.name}
              permissions={permissions}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}