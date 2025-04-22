"use client";

import React, { useState, useEffect } from "react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import allTablesData from "@/data/all_tables.json";
import resGroupsData from "@/data/res.groups.json";

export type SearchType = "model" | "role";

interface CombinedSearchProps {
  type: SearchType;
  onSelect: (selected: { id: number; name: string }) => void;
}

export function CombinedSearch({ type, onSelect }: CombinedSearchProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [options, setOptions] = useState<ComboboxOption[]>([]);

  useEffect(() => {
    if (type === "model") {
      const modelOptions: ComboboxOption[] = allTablesData.map((model) => ({
        value: model.id.toString(),
        label: model.model
      }));
      setOptions(modelOptions);
    } else if (type === "role") {
      const roleOptions: ComboboxOption[] = resGroupsData.map((role) => ({
        value: role.id.toString(),
        label: role.full_name
      }));
      setOptions(roleOptions);
    }
  }, [type]);

  const handleChange = (id: string) => {
    setSelectedId(id);

    if (!id) {
      return;
    }

    if (type === "model") {
      const selectedModel = allTablesData.find(model => model.id.toString() === id);
      if (selectedModel) {
        onSelect({
          id: selectedModel.id,
          name: selectedModel.model
        });
      }
    } else if (type === "role") {
      const selectedRole = resGroupsData.find(role => role.id.toString() === id);
      if (selectedRole) {
        onSelect({
          id: selectedRole.id,
          name: selectedRole.full_name
        });
      }
    }
  };

  const title = type === "model" ? "Search Models" : "Search Roles";
  const description = type === "model"
    ? "Search and select a model to explore its fields"
    : "Search and select a role to view its permissions";
  const placeholder = type === "model" ? "Search models..." : "Search roles...";
  const emptyText = type === "model" ? "No models found" : "No roles found";
  const label = type === "model" ? "Models" : "Roles";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Combobox
          options={options}
          value={selectedId}
          onChange={handleChange}
          placeholder={placeholder}
          emptyText={emptyText}
          label={label}
          width="100%"
          triggerClassName="h-10 text-base"
        />
      </CardContent>
    </Card>
  );
}