"use client";

import React from "react";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupPermissionData, PermissionSummary } from "@/types/permissions";

interface ChartComponentProps {
  permissionsData: GroupPermissionData[];
}

// Permission type labels
const PERMISSION_LABELS = {
  create: "Create",
  read: "Read (View)",
  update: "Update (Write)",
  delete: "Delete (Unlink)"
};

export function ChartComponent({ permissionsData }: ChartComponentProps) {
  const chartData = React.useMemo(() => {
    if (!permissionsData || permissionsData.length === 0) {
      return [];
    }

    const permTypes = ["create", "read", "update", "delete"];

    return permTypes.map(type => {
      const dataPoint: Record<string, string | number> = {
        subject: PERMISSION_LABELS[type as keyof typeof PERMISSION_LABELS],
      };

      permissionsData.forEach(group => {
        const counts = group.permissionCounts || {};
        const shortName = group.groupName.length > 10
          ? `${group.groupName.substring(0, 10)}...`
          : group.groupName;

        dataPoint[shortName] = counts[type as keyof PermissionSummary] || 0;
        dataPoint[`${shortName}-fullName`] = group.groupName;
      });

      return dataPoint;
    });
  }, [permissionsData]);

  const chartConfig = React.useMemo(() => {
    if (!permissionsData || permissionsData.length === 0) {
      return {};
    }

    const config: Record<string, { label: string; color: string }> = {};
    
    // Use CSS variables for colors
    const themeColors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)'
    ];

    permissionsData.forEach((group, index) => {
      const shortName = group.groupName.length > 10
        ? `${group.groupName.substring(0, 10)}...`
        : group.groupName;

      const colorIndex = index % themeColors.length;
      config[shortName] = {
        label: shortName,
        color: themeColors[colorIndex],
      };
    });

    return config;
  }, [permissionsData]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground">
          No permission data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Distribution</CardTitle>
        <CardDescription>
          Visualize the distribution of permissions across different groups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />

              {permissionsData.map((group, index) => {
                const shortName = group.groupName.length > 10
                  ? `${group.groupName.substring(0, 10)}...`
                  : group.groupName;

                const colorIndex = index % 5 + 1;
                const color = `var(--chart-${colorIndex})`;

                return (
                  <Radar
                    key={shortName}
                    name={shortName}
                    dataKey={shortName}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.3}
                    angleAxisId={0}
                  />
                );
              })}

              <ChartTooltip
                content={(props) => {
                  if (!props.active || !props.payload || !props.payload.length) {
                    return null;
                  }

                  return (
                    <div className="bg-background rounded-lg border p-2 text-sm shadow-lg">
                      <div className="font-medium">{props.label}</div>
                      <div className="mt-1 space-y-1">
                        {props.payload.map((entry) => {
                          const dataKey = entry.dataKey;
                          const fullName = props.payload?.[0]?.payload?.[`${dataKey}-fullName`] ?? dataKey;

                          return (
                            <div key={entry.dataKey} className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-muted-foreground">{fullName}:</span>
                              <span className="font-mono font-medium">{entry.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}