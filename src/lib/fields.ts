export async function getTableFields(table: string) {
  try {
    // Updated to use the correct API endpoint
    const response = await fetch(`/api/odoo/explore-model?model_id=${encodeURIComponent(table)}`);
    
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