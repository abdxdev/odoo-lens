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