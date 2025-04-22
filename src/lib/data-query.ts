import { DataQueryParams, DataQueryResult } from "@/types/data-query";
import { odooApiRequest } from "./utils";

export async function executeDataQuery(params: DataQueryParams): Promise<DataQueryResult> {
  try {
    // Use odooApiRequest which prioritizes the GUI-set session key
    return await odooApiRequest(
      '/api/odoo/data-query',
      'POST',
      params
    );
  } catch (error) {
    console.error("Error executing data query:", error);
    throw error;
  }
}