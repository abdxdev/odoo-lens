import { odooApiRequest } from "./utils";

export async function getTableFields(table: string) {
  try {
    // Use odooApiRequest which prioritizes the GUI-set session key
    return await odooApiRequest(
      `/api/odoo/explore-model`,
      'GET',
      { model_id: table }
    );
  } catch (error) {
    console.error("Error in getTableFields:", error);
    throw error;
  }
}