import { Faculty } from "@/types/faculty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import resGroups from "@/data/res.groups.json";
import { 
  createGroupNameMap, 
  formatDate, 
  formatFacultyForClipboard, 
  copyToClipboardWithFeedback 
} from "@/lib/faculty";

// Create a map of group IDs to their full names
const groupMap = createGroupNameMap(resGroups);

// Faculty details field configuration
const FACULTY_FIELDS = [
  { label: "Login", getValue: (f: Faculty) => f.login },
  { label: "Department", getValue: (f: Faculty) => f.department_id?.[1] },
  { label: "Contact Number", getValue: (f: Faculty) => f.contact_number1 },
  { label: "Campus", getValue: (f: Faculty) => f.campus_id?.[1] },
  { label: "Joining Date", getValue: (f: Faculty) => formatDate(f.joining_date) },
];

interface FacultyDetailsProps {
  faculty: Faculty | null;
}

export function FacultyDetails({ faculty }: FacultyDetailsProps) {
  const [copyTooltip, setCopyTooltip] = useState("Copy to clipboard");

  if (!faculty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faculty Details</CardTitle>
          <CardDescription>Select a faculty member to view their details</CardDescription>
        </CardHeader>
        <CardContent>No faculty member selected</CardContent>
      </Card>
    );
  }

  const handleCopyToClipboard = () => {
    const text = formatFacultyForClipboard(faculty, groupMap);
    copyToClipboardWithFeedback(text, setCopyTooltip);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>{faculty.name}</CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{copyTooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>ID: {faculty.id || "N/A"}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FACULTY_FIELDS.map(({ label, getValue }, i) => (
            <div key={label} className={`space-y-1 ${i % 2 === 0 ? "sm:col-span-1" : "sm:col-span-2"}`}>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-sm">{getValue(faculty) || "Not provided"}</p>
            </div>
          ))}

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Resource Groups</p>
            <div className="flex flex-wrap gap-1.5">
              {faculty.res_group_id?.length ? faculty.res_group_id.map((groupId, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {groupMap[groupId] || `Group ${groupId}`}
                </Badge>
              )) : <span className="text-muted-foreground text-sm">None</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}