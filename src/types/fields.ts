export interface ModelField {
  id: number;
  name: string;
  model_id: number;
  model_name: string;
  perm_read: boolean;
  perm_write: boolean;
  perm_create: boolean;
  perm_unlink: boolean;
}

export interface FieldSummary {
  create: number;
  read: number;
  update: number;
  delete: number;
}

export interface ModelFieldData {
  modelId: number;
  modelName: string;
  fieldCounts: FieldSummary;
}

export interface ModelFieldsData {
  modelId: number;
  modelName: string;
  fields: ModelField[];
  summary: FieldSummary;
  isLoading: boolean;
  error: string | null;
}

export interface ProcessedField extends ModelField {
  model_name: string;
}

export interface ModelFieldsReviewProps {
  modelId?: number;
  modelName?: string;
  fields?: ModelField[];
  isLoading?: boolean;
  error?: string | null;
}

export interface StatusCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
}

export interface FieldAnalysisData {
  modelId: number;
  modelName: string;
  fieldCounts: FieldSummary;
}