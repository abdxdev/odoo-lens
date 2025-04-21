"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelField, DataQueryParams } from '@/types/data-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { getTableFields } from '@/lib/fields';
import allTablesData from "@/data/all_tables.json";

interface DataQueryFormProps {
  onSubmitQuery: (queryParams: DataQueryParams) => void;
}

export function DataQueryForm({ onSubmitQuery }: DataQueryFormProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelOptions, setModelOptions] = useState<ComboboxOption[]>([]);
  const [availableFields, setAvailableFields] = useState<Record<string, ModelField>>({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterField, setFilterField] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {

    const options: ComboboxOption[] = allTablesData.map((model) => ({
      value: model.id.toString(),
      label: model.model
    }));

    setModelOptions(options);
  }, []);


  useEffect(() => {
    if (!selectedModel) {
      setAvailableFields({});
      setSelectedFields([]);
      return;
    }

    async function fetchModelFields() {
      try {
        setIsLoading(true);
        const fields = await getTableFields(selectedModel);
        setAvailableFields(fields || {});
        setSelectedFields([]);
        setFilterField("");
        setFilterValue("");
      } catch (error) {
        console.error("Error fetching model fields:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModelFields();
  }, [selectedModel]);

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);

    if (!modelId) {
      setSelectedModel("");
      return;
    }

    const selectedModelData = allTablesData.find(model => model.id.toString() === modelId);

    if (selectedModelData) {
      setSelectedModel(selectedModelData.model);
    }
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  const handleSelectAllFields = () => {
    setSelectedFields(Object.keys(availableFields));
  };

  const handleClearFields = () => {
    setSelectedFields([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModel || selectedFields.length === 0) {
      alert("Please select a model and at least one field.");
      return;
    }

    const queryParams: DataQueryParams = {
      model: selectedModel,
      fields: selectedFields,
    };

    if (filterField && filterValue) {
      queryParams.filterField = filterField;
      queryParams.filterValue = filterValue;
    }

    onSubmitQuery(queryParams);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Query</CardTitle>
        <CardDescription>
          Select a table (model), fields, and optional filter to query data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model-select">Select a Model</Label>
            <Combobox
              options={modelOptions}
              value={selectedModelId}
              onChange={handleModelChange}
              placeholder="Search models..."
              emptyText="No models found"
              label=""
              width="100%"
              triggerClassName="h-10 text-base"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : Object.keys(availableFields).length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Fields</Label>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllFields}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearFields}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(availableFields).map(([fieldName, field]) => (
                    <div key={fieldName} className="flex items-center space-x-2">
                      <Checkbox
                        id={fieldName}
                        checked={selectedFields.includes(fieldName)}
                        onCheckedChange={() => handleFieldToggle(fieldName)}
                      />
                      <label
                        htmlFor={fieldName}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {field.string || fieldName} ({field.type}{field.required ? ", required" : ""})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-field">Filter (Optional)</Label>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <select
                      id="filter-field"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                    >
                      <option value="">Select a field to filter</option>
                      {Object.entries(availableFields).map(([fieldName, field]) => (
                        <option key={fieldName} value={fieldName}>
                          {field.string || fieldName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <Input
                      id="filter-value"
                      placeholder="Filter value"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      disabled={!filterField}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedModel || selectedFields.length === 0}
          >
            Run Query
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}