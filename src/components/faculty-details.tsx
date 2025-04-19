import { Faculty } from "@/types/faculty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";
import resGroups from "@/data/res.groups.json";

const groupMap = Object.fromEntries(resGroups.map(group => [group.id, group.full_name]));

export function FacultyDetails({ faculty }: { faculty: Faculty | null }) {
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

  const copyToClipboard = () => {
    const facultyGroups = faculty.res_group_id?.map(id => 
      `${id}: ${groupMap[id] || `Group ${id}`}`
    ).join(", ") || "None";
    
    navigator.clipboard.writeText(
      `Faculty: ${faculty.name}
ID: ${faculty.id || "N/A"}
Login: ${faculty.login || "Not provided"}
Joining Date: ${faculty.joining_date ? new Date(faculty.joining_date).toLocaleDateString() : "Not provided"}
Contact: ${faculty.contact_number1 || "Not provided"}
Campus: ${faculty.campus_id?.[1] || "Not assigned"}
Department: ${faculty.department_id?.[1] || "Not assigned"}
Resource Groups: ${facultyGroups}`
    )
    .then(() => {
      setCopyTooltip("Copied!");
      setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
    })
    .catch(() => {
      setCopyTooltip("Failed to copy");
      setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
    });
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
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
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
          {[
            { label: "Login", value: faculty.login },
            { label: "Department", value: faculty.department_id?.[1] },
            { label: "Contact Number", value: faculty.contact_number1 },
            { label: "Campus", value: faculty.campus_id?.[1] },
            { label: "Joining Date", value: faculty.joining_date ? new Date(faculty.joining_date).toLocaleDateString() : null },
          ].map(({ label, value }, i) => (
            <div key={label} className={`space-y-1 ${i%2 === 0 ? "sm:col-span-1" : "sm:col-span-2"}`}>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-sm">{value || "Not provided"}</p>
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