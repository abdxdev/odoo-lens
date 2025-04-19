"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelDetails {
  id: number;
  model: string;
}

interface ModelDetailsProps {
  model: ModelDetails | null;
}

export function ModelDetails({ model }: ModelDetailsProps) {
  if (!model) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          Model Details
        </CardTitle>
        <CardDescription>Information about the selected model</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Model Name</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium">{model.model}</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Model ID</div>
            <div className="mt-1">{model.id}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}