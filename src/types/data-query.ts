export interface ModelField {
  name: string;
  string: string;
  type: string;
  required: boolean;
  readonly: boolean;
  relation?: string;
}

export interface DataQueryResult {
  records: any[];
  length: number;
}

export interface DataQueryParams {
  model: string;
  fields: string[];
  filterField?: string;
  filterValue?: string;
  limit?: number;
}