export interface DataQueryResult {
  records: Record<string, unknown>[];
  length: number;
}

export interface DataQueryParams {
  model: string;
  fields: string[];
  filterField?: string;
  filterValue?: string;
  limit?: number;
}