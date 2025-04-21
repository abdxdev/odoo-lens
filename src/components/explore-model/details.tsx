"use client";

import React from "react";
import { Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelDetailsProps {
  model: {
    id: number;
    name: string;
  };
}

export function ModelDetails({ model }: ModelDetailsProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>{model.name}</CardTitle>
        </div>
        <CardDescription>
          Model details and information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Model ID</div>
            <div className="font-medium">{model.id}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Model Name</div>
            <div className="font-medium">{model.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Type</div>
            <Badge variant="outline" className="text-xs">
              Database Model
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}