"use client";

import React, { useState, useEffect } from "react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import allTablesData from "@/data/all_tables.json";

interface ModelSearchProps {
  onSelectModel: (model: { id: number; name: string }) => void;
}

export function ModelSearch({ onSelectModel }: ModelSearchProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [modelOptions, setModelOptions] = useState<ComboboxOption[]>([]);
  
  useEffect(() => {
    // Transform data into combobox options format
    const options: ComboboxOption[] = allTablesData.map((model) => ({
      value: model.id.toString(),
      label: model.model
    }));
    
    setModelOptions(options);
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);

    if (!modelId) {
      return;
    }

    const selectedModel = allTablesData.find(model => model.id.toString() === modelId);

    if (selectedModel) {
      onSelectModel({
        id: selectedModel.id,
        name: selectedModel.model
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Search Models</CardTitle>
        <CardDescription>
          Search and select a model to explore its fields
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Combobox
          options={modelOptions}
          value={selectedModelId}
          onChange={handleModelChange}
          placeholder="Search models..."
          emptyText="No models found"
          label="Models"
          width="100%"
          triggerClassName="h-10 text-base"
        />
      </CardContent>
    </Card>
  );
}