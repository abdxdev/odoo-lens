export async function getTableFields(table: string) {
  try {
    const response = await fetch(`/api/odoo/model-fields?model_id=${encodeURIComponent(table)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch model fields: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTableFields:", error);
    throw error;
  }
}