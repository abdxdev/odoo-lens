import { Faculty } from "@/types/faculty";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import resGroups from "@/data/res.groups.json";

// Create a map of group IDs to full names for quick lookup
const groupMap: Record<number, string> = {};
resGroups.forEach(group => {
    groupMap[group.id] = group.full_name;
});

interface FacultyDetailsProps {
    faculty: Faculty | null;
}

export function FacultyDetails({ faculty }: FacultyDetailsProps) {
    if (!faculty) {
        return (
            <Card className="w-full shadow-sm h-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Faculty Details</CardTitle>
                    <CardDescription>Select a faculty member to view their details</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10 text-muted-foreground">
                    No faculty member selected
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-sm h-full">
            <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <CardTitle className="text-2xl font-semibold">{faculty.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                            ID: {faculty.id || "Not available"}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="h-fit">
                        {faculty.department_id?.[1] || "No Department"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Login</p>
                        <p className="text-sm">{faculty.login || "Not provided"}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Joining Date</p>
                        <p className="text-sm">{faculty.joining_date ? new Date(faculty.joining_date).toLocaleDateString() : "Not provided"}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Contact Number</p>
                        <p className="text-sm">{faculty.contact_number1 || "Not provided"}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Resource Groups</p>
                        <div className="flex flex-wrap gap-1.5">
                            {faculty.res_group_id && faculty.res_group_id.length > 0 ? (
                                faculty.res_group_id.map((groupId, index) => (
                                    <Badge key={index} variant="secondary" className="font-normal">
                                        {groupMap[groupId] || `Group ${groupId}`}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}