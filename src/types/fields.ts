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