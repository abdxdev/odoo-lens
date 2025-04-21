"use client";

import React from "react";
import { Database, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchType } from "./search";

interface SelectedItem {
  id: number;
  name: string;
}

interface CombinedDetailsProps {
  type: SearchType;
  item: SelectedItem | null;
}

export function CombinedDetails({ type, item }: CombinedDetailsProps) {
  if (!item) return null;

  const icon = type === "model" ? 
    <Database className="h-5 w-5 text-primary" /> : 
    <Shield className="h-5 w-5 text-primary" />;
  
  const title = type === "model" ? item.name : "Role Details";
  const description = type === "model" ? "Model details and information" : "Information about the selected role";
  
  const itemTypeName = type === "model" ? "Model" : "Role";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">{itemTypeName} ID</div>
            <div className="font-medium">{item.id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">{itemTypeName} Name</div>
            <div className="font-medium">{item.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Type</div>
            <Badge variant="outline" className="text-xs">
              {type === "model" ? "Database Model" : "Security Role"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}