

import { DataQueryParams, DataQueryResult } from "@/types/data-query";

export async function getAvailableModels() {
  try {

    const response = await fetch('/api/odoo/model-fields?model_id=ir.model');

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available models:", error);
    throw error;
  }
}

export async function getModelFields(modelId: string) {
  try {
    const response = await fetch(`/api/odoo/model-fields?model_id=${encodeURIComponent(modelId)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch model fields: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching model fields:", error);
    throw error;
  }
}

export async function executeDataQuery(params: DataQueryParams): Promise<DataQueryResult> {
  try {
    const response = await fetch('/api/odoo/data-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Data query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error executing data query:", error);
    throw error;
  }
}