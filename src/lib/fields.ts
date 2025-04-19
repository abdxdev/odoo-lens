import { ModelField, FieldSummary } from '@/types/fields';

// Field types and labels
export const FIELD_TYPES = ['create', 'read', 'update', 'delete'] as const;

export const FIELD_LABELS: Record<string, string> = {
  create: 'Create',
  read: 'Read (View)',
  update: 'Update (Write)',
  delete: 'Delete (Unlink)'
};

/**
 * Get a model name from its ID using the res.models.json data
 */
export function getModelName(id: number, modelsData: any[]): string {
  return modelsData.find(g => g.id === id)?.full_name || `Model ID: ${id}`;
}

/**
 * Calculate field summary from a list of fields
 */
export function calculateFieldSummary(fields: ModelField[]): FieldSummary {
  return fields.reduce((acc, p) => ({
    create: acc.create + (p.perm_create ? 1 : 0),
    read: acc.read + (p.perm_read ? 1 : 0),
    update: acc.update + (p.perm_write ? 1 : 0),
    delete: acc.delete + (p.perm_unlink ? 1 : 0),
  }), { create: 0, read: 0, update: 0, delete: 0 });
}

/**
 * Format clipboard text with consistent padding
 */
export function formatFieldText(name: string, summary: FieldSummary): string {
  return `${name}:\n` + 
    `  Create: ${summary.create.toString().padEnd(6)} | ` +
    `Read: ${summary.read.toString().padEnd(6)} | ` +
    `Update: ${summary.update.toString().padEnd(6)} | ` +
    `Delete: ${summary.delete}`;
}

/**
 * Calculate total field counts from multiple models
 */
export function calculateTotalFields(models: { summary: FieldSummary, isLoading?: boolean, error?: string | null }[]): FieldSummary {
  const totalCounts = models.reduce((acc, model) => {
    if (model.isLoading || model.error) return acc;
    
    Object.entries(model.summary).forEach(([key, value]) => {
      acc[key as keyof FieldSummary] = (acc[key as keyof FieldSummary] || 0) + value;
    });
    return acc;
  }, { create: 0, read: 0, update: 0, delete: 0 } as FieldSummary);
  
  return totalCounts;
}

/**
 * A utility function similar to the Python get_table_fields example
 */
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