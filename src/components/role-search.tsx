"use client";

import React, { useState, useRef } from "react";
import { AsyncSelect } from "@/components/async-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import resGroupsData from "@/data/res.groups.json";

interface RoleSearchProps {
  onSelectRole: (role: { id: number; name: string }) => void;
}

interface Role {
  id: number;
  full_name: string;
}

export function RoleSearch({ onSelectRole }: RoleSearchProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const rolesDataRef = useRef<Record<string, Role>>({});

  const fetchRoles = async (query: string = ""): Promise<Role[]> => {
    const filteredRoles = resGroupsData.filter((role) => 
      !query || role.full_name.toLowerCase().includes(query.toLowerCase())
    );
    
    filteredRoles.forEach(role => {
      rolesDataRef.current[role.id.toString()] = role;
    });
    
    return filteredRoles;
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);

    if (!roleId) {
      return;
    }

    const selected = rolesDataRef.current[roleId];

    if (selected) {
      onSelectRole({
        id: selected.id,
        name: selected.full_name
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Search Roles</CardTitle>
        <CardDescription>
          Search and select a role to view its permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <AsyncSelect<Role>
          fetcher={fetchRoles}
          preload={true}
          filterFn={(role, query) => role.full_name.toLowerCase().includes(query.toLowerCase())}
          renderOption={(role) => (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="font-medium">{role.full_name}</div>
              </div>
            </div>
          )}
          getOptionValue={(role) => role.id.toString()}
          getDisplayValue={(role) => (
            <div className="flex items-center gap-2 text-left">
              <div className="flex flex-col leading-tight">
                <div className="font-medium">{role.full_name}</div>
              </div>
            </div>
          )}
          notFound={<div className="py-6 text-center text-sm">No roles found</div>}
          label="Roles"
          placeholder="Search roles..."
          value={selectedRoleId}
          onChange={handleRoleChange}
          width="100%"
          triggerClassName="h-10 text-base"
        />
      </CardContent>
    </Card>
  );
}