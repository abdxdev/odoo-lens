export interface Faculty {
  id: number;
  name: string;
  department_id: [number, string];
  campus_id: [number, string];
  joining_date: string;
  identification_id: string;
  login: string;
  contact_number1: string;
  res_group_id: number[] | null;
}