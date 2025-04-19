"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleDetails {
  id: number;
  name: string;
}

interface RoleDetailsProps {
  role: RoleDetails | null;
}

export function RoleDetails({ role }: RoleDetailsProps) {
  if (!role) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          Role Details
        </CardTitle>
        <CardDescription>Information about the selected role</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Role Name</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">{role.name}</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Role ID</div>
            <div className="mt-1">{role.id}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}