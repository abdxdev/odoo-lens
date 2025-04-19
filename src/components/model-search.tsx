"use client";

import React, { useState, useRef } from "react";
import { AsyncSelect } from "@/components/async-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import modelsData from "@/data/all_tables.json";

interface ModelSearchProps {
  onSelectModel: (model: { id: number; name: string }) => void;
}

interface Model {
  id: number;
  model: string;
}

export function ModelSearch({ onSelectModel }: ModelSearchProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const modelsDataRef = useRef<Record<string, Model>>({});

  const fetchModels = async (query: string = ""): Promise<Model[]> => {
    const filteredModels = modelsData.filter((model) => 
      !query || model.model.toLowerCase().includes(query.toLowerCase())
    );
    
    filteredModels.forEach(model => {
      modelsDataRef.current[model.id.toString()] = model;
    });
    
    return filteredModels;
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);

    if (!modelId) {
      return;
    }

    const selected = modelsDataRef.current[modelId];

    if (selected) {
      onSelectModel({
        id: selected.id,
        name: selected.model
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Search Models</CardTitle>
        <CardDescription>
          Search and select a model to view its permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <AsyncSelect<Model>
          fetcher={fetchModels}
          preload={true}
          filterFn={(model, query) => model.model.toLowerCase().includes(query.toLowerCase())}
          renderOption={(model) => (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="font-medium">{model.model}</div>
              </div>
            </div>
          )}
          getOptionValue={(model) => model.id.toString()}
          getDisplayValue={(model) => (
            <div className="flex items-center gap-2 text-left">
              <div className="flex flex-col leading-tight">
                <div className="font-medium">{model.model}</div>
              </div>
            </div>
          )}
          notFound={<div className="py-6 text-center text-sm">No models found</div>}
          label="Models"
          placeholder="Search models..."
          value={selectedModelId}
          onChange={handleModelChange}
          width="100%"
          triggerClassName="h-10 text-base"
        />
      </CardContent>
    </Card>
  );
}