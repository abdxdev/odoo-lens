'use client';

import { useState, useEffect } from 'react';
import { Faculty } from '@/types/faculty';
import { GroupPermissionsData, GroupPermission } from '@/types/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardCopy } from 'lucide-react';
import resGroupsData from '@/data/res.groups.json';

const getGroupName = (id: number): string => resGroupsData.find(g => g.id === id)?.full_name || `Group ID: ${id}`;
const permTypes = ['create', 'read', 'update', 'delete'] as const;
const permLabels = {create: 'Create', read: 'Read (View)', update: 'Update (Write)', delete: 'Delete (Unlink)'};

interface FacultyPermissionsProps {
  faculty: Faculty | null;
}

export function FacultyPermissions({ faculty }: FacultyPermissionsProps) {
  const [data, setData] = useState<GroupPermissionsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyTooltip, setCopyTooltip] = useState<string>("Copy to clipboard");

  useEffect(() => {
    if (!faculty?.res_group_id?.length) {
      setData([]);
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('permissionsLoaded', {detail: {permissionsData: [], isLoading: false}}));
      return;
    }

    const fetchPermissions = async () => {
      setIsLoading(true);
      window.dispatchEvent(new CustomEvent('permissionsLoaded', {detail: {permissionsData: [], isLoading: true}}));

      const initialData = faculty.res_group_id.map((id: number) => ({
        groupId: id, 
        groupName: getGroupName(id), 
        permissions: [],
        summary: { create: 0, read: 0, update: 0, delete: 0 },
        isLoading: true, 
        error: null
      }));
      setData(initialData);

      const results = await Promise.allSettled(faculty.res_group_id.map(async (groupId: number) => {
        try {
          const res = await fetch(`/api/odoo/permissions?group_id=${groupId}`);
          if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
          
          const permissions: GroupPermission[] = await res.json();
          const summary = permissions.reduce((acc, p) => ({
            create: acc.create + (p.perm_create ? 1 : 0),
            read: acc.read + (p.perm_read ? 1 : 0),
            update: acc.update + (p.perm_write ? 1 : 0),
            delete: acc.delete + (p.perm_unlink ? 1 : 0),
          }), { create: 0, read: 0, update: 0, delete: 0 });

          return { groupId, permissions, summary };
        } catch (error) {
          return { groupId, error: error instanceof Error ? error.message : String(error) };
        }
      }));

      const updatedData = initialData.map(group => {
        const result = results.find(r => 
          r.status === 'fulfilled' && 
          'groupId' in r.value && 
          r.value.groupId === group.groupId
        );
        
        if (result?.status === 'fulfilled') {
          const value = result.value as any;
          return value.error 
            ? {...group, isLoading: false, error: value.error} 
            : {...group, permissions: value.permissions, summary: value.summary, isLoading: false};
        }
        return {...group, isLoading: false, error: 'Failed to fetch'};
      });
      
      setData(updatedData);
      setIsLoading(false);
      
      const analysisData = updatedData
        .filter(g => !g.isLoading && !g.error)
        .map(({groupId, groupName, summary}) => ({
          groupId, 
          groupName, 
          permissionCounts: summary
        }));
        
      window.dispatchEvent(new CustomEvent('permissionsLoaded', {
        detail: {permissionsData: analysisData, isLoading: false}
      }));
    };

    fetchPermissions();
  }, [faculty]);

  const copyPermissionsToClipboard = () => {
    if (!faculty || !data.length) return;
    
    const header = `Permissions Summary for ${faculty.name} (${faculty.login || 'Not provided'})\n`;
    const divider = '═'.repeat(70) + '\n';
    
    // Format each permission type in a column for better readability
    const formattedGroups = data.map(group => {
      if (group.isLoading) return `${group.groupName}: Loading...`;
      if (group.error) return `${group.groupName}: Error - ${group.error}`;
      
      return `${group.groupName}:\n` + 
        `  Create: ${group.summary.create.toString().padEnd(6)} | ` +
        `Read: ${group.summary.read.toString().padEnd(6)} | ` +
        `Update: ${group.summary.update.toString().padEnd(6)} | ` +
        `Delete: ${group.summary.delete}`;
    }).join('\n\n');
    
    const totalCounts: Record<string, number> = !isLoading ? data.reduce((acc, group) => {
      if (!group.isLoading && !group.error) {
        Object.entries(group.summary).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
      }
      return acc;
    }, {} as Record<string, number>) : {};
    
    const totalSummary = `\nTotal Permissions:\n` +
      `  Create: ${totalCounts.create?.toString().padEnd(6) || '0'.padEnd(6)} | ` +
      `Read: ${totalCounts.read?.toString().padEnd(6) || '0'.padEnd(6)} | ` +
      `Update: ${totalCounts.update?.toString().padEnd(6) || '0'.padEnd(6)} | ` +
      `Delete: ${totalCounts.delete || '0'}`;
    
    navigator.clipboard.writeText(header + divider + formattedGroups + '\n' + divider + totalSummary)
      .then(() => {
        setCopyTooltip("Copied!");
        setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        setCopyTooltip("Failed to copy");
        setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
      });
  };

  if (!faculty) return null;
  if (isLoading && data.every(g => g.isLoading)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions Summary</CardTitle>
          <CardDescription>Loading permissions for {faculty.name}...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }
  if (!data.length && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions Summary</CardTitle>
          <CardDescription>No permissions data available for {faculty.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No permission groups associated with this faculty.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Permissions Summary</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={copyPermissionsToClipboard} disabled={isLoading || !data.length}>
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{copyTooltip}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Permissions for {faculty.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              {permTypes.map(type => <TableHead key={type} className="text-right">{permLabels[type]}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(({groupId, groupName, summary, isLoading, error}) => (
              <TableRow key={groupId}>
                <TableCell>
                  {isLoading ? <Skeleton className="h-5 w-24 inline-block" /> : groupName}
                </TableCell>
                {permTypes.map(type => (
                  <TableCell key={`${groupId}-${type}`} className="text-right">
                    {isLoading ? <Skeleton className="h-5 w-10 inline-block" /> : 
                     error ? <span className="error text-xs">Error</span> : summary[type]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.some(g => g.error) && (
          <div className="mt-4 space-y-1 text-sm text-red-600">
            {data.filter(g => g.error).map(g => (
              <p key={g.groupId}>Error loading {g.groupName}: {g.error}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
