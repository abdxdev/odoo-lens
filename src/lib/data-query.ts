

import { DataQueryParams, DataQueryResult } from "@/types/data-query";


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