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

export interface ModelFields {
  string: string;
  type: string;
  required: boolean;
  readonly: boolean;
  relation?: string;
  selection?: [string, string][];
  company_dependent?: boolean;
  domain?: string[];
  context?: Record<string, any>;
}