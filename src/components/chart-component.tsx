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
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartComponentProps {
  permissionsData: any[];
}

export function ChartComponent({ permissionsData }: ChartComponentProps) {
  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!permissionsData || permissionsData.length === 0) {
      return [];
    }

    // Transform the data to show each permission type for each group
    const permTypes = ["create", "read", "update", "delete"];
    const permLabels = {
      create: "Create",
      read: "Read (View)",
      update: "Update (Write)",
      delete: "Delete (Unlink)"
    };

    return permTypes.map(type => {
      const dataPoint = {
        subject: permLabels[type as keyof typeof permLabels],
      };

      // Add each group's value for this permission type
      permissionsData.forEach(group => {
        const counts = group.permissionCounts || {};
        const shortName = group.groupName.length > 10 
          ? `${group.groupName.substring(0, 10)}...` 
          : group.groupName;
          
        dataPoint[shortName] = counts[type as keyof typeof counts] || 0;
        dataPoint[`${shortName}-fullName`] = group.groupName;
      });

      return dataPoint;
    });
  }, [permissionsData]);

  // Create chart config with colors for each group
  const chartConfig = React.useMemo(() => {
    if (!permissionsData || permissionsData.length === 0) {
      return {};
    }

    const config: Record<string, any> = {};
    
    // Generate colors for each group
    permissionsData.forEach((group, index) => {
      const shortName = group.groupName.length > 10 
        ? `${group.groupName.substring(0, 10)}...` 
        : group.groupName;
        
      // Create different hues for different groups
      const hue = (index * 137) % 360; // Golden ratio to spread colors nicely
      config[shortName] = {
        label: shortName,
        color: `hsl(${hue}, 70%, 50%)`,
      };
    });
    
    return config;
  }, [permissionsData]);

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Permission Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
          No permission data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Permission Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="h-[300px] w-full mx-auto">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
                cx="50%" 
                cy="50%"
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                
                {/* Create a Radar for each group */}
                {permissionsData.map((group, index) => {
                  const shortName = group.groupName.length > 10 
                    ? `${group.groupName.substring(0, 10)}...` 
                    : group.groupName;
                    
                  // Create different hues for different groups
                  const hue = (index * 137) % 360; // Golden ratio to spread colors nicely
                  const color = `hsl(${hue}, 70%, 50%)`;
                  
                  return (
                    <Radar 
                      key={shortName}
                      name={shortName} 
                      dataKey={shortName} 
                      stroke={color}
                      fill={color}
                      fillOpacity={0.3} 
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
                            // Find the full name from the data
                            const fullName = props.payload[0].payload[`${dataKey}-fullName`] || dataKey;
                            
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
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '0.75rem', paddingTop: '5px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}