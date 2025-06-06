import { Faculty } from '@/types/faculty';

export function createGroupNameMap(groups: Array<{ id: number; full_name: string }>): Record<number, string> {
  return Object.fromEntries(groups.map(group => [group.id, group.full_name]));
}

export function formatDate(dateString: string | undefined | null): string {
  return dateString ? new Date(dateString).toLocaleDateString() : "Not provided";
}

export function formatFacultyForClipboard(faculty: Faculty, groupMap: Record<number, string>): string {
  const facultyGroups = faculty.res_group_id?.map(id =>
    `${id}: ${groupMap[id] || `Group ${id}`}`
  ).join(", ") || "None";

  return `Faculty: ${faculty.name}
ID: ${faculty.id || "N/A"}
Login: ${faculty.login || "Not provided"}
Joining Date: ${formatDate(faculty.joining_date)}
Contact: ${faculty.contact_number1 || "Not provided"}
Campus: ${faculty.campus_id?.[1] || "Not assigned"}
Department: ${faculty.department_id?.[1] || "Not assigned"}
Resource Groups: ${facultyGroups}`;
}

export function copyToClipboardWithFeedback(
  text: string,
  setTooltipState: (state: string) => void,
  successMessage: string = "Copied!",
  errorMessage: string = "Failed to copy",
  defaultMessage: string = "Copy to clipboard",
  timeout: number = 2000
): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      setTooltipState(successMessage);
      setTimeout(() => setTooltipState(defaultMessage), timeout);
    })
    .catch(() => {
      setTooltipState(errorMessage);
      setTimeout(() => setTooltipState(defaultMessage), timeout);
    });
}