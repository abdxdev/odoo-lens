"use client";

import React, { useState, useEffect } from "react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import resGroupsData from "@/data/res.groups.json";

interface RoleSearchProps {
  onSelectRole: (role: { id: number; name: string }) => void;
}

export function RoleSearch({ onSelectRole }: RoleSearchProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [roleOptions, setRoleOptions] = useState<ComboboxOption[]>([]);
  
  useEffect(() => {
    // Transform data into combobox options format
    const options: ComboboxOption[] = resGroupsData.map((role) => ({
      value: role.id.toString(),
      label: role.full_name
    }));
    
    setRoleOptions(options);
  }, []);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);

    if (!roleId) {
      return;
    }

    const selectedRole = resGroupsData.find(role => role.id.toString() === roleId);

    if (selectedRole) {
      onSelectRole({
        id: selectedRole.id,
        name: selectedRole.full_name
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
        <Combobox
          options={roleOptions}
          value={selectedRoleId}
          onChange={handleRoleChange}
          placeholder="Search roles..."
          emptyText="No roles found"
          label="Roles"
          width="100%"
          triggerClassName="h-10 text-base"
        />
      </CardContent>
    </Card>
  );
}