'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionSummary } from '@/types/permissions';

// Updated interface for the data passed to this component
interface PermissionAnalysisData {
  groupId: number;
  groupName: string;
  permissionCounts: PermissionSummary;
}

interface PermissionsAIAnalysisProps {
  groupPermissionsData: PermissionAnalysisData[];
  isLoading: boolean;
}

export function PermissionsAIAnalysis({
  groupPermissionsData,
  isLoading
}: PermissionsAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && groupPermissionsData.length > 0) {
      analyzePermissions();
    }
  }, [isLoading, groupPermissionsData]);

  const analyzePermissions = async () => {
    if (groupPermissionsData.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call our API endpoint instead of using the Gemini API directly
      const response = await fetch('/api/analyze-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupPermissionsData,
          formatOptions: {
            concise: true,
            avoidMarkdown: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze permissions');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setRiskLevel(data.riskLevel);
    } catch (err) {
      console.error('Error analyzing permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze permissions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskBadge = () => {
    if (!riskLevel) return null;

    const bgColor = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }[riskLevel];

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${bgColor}`}>
        {riskLevel} risk
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Security Analysis</CardTitle>
          {getRiskBadge()}
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {isLoading || isAnalyzing ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <p className="text-sm text-muted-foreground mt-4">
                {isLoading ? "Waiting for permissions data..." : "Analyzing permissions with Gemini AI..."}
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500">
              <p>Error: {error}</p>
              <p className="text-sm mt-2">Please check your Gemini API configuration.</p>
            </div>
          ) : groupPermissionsData.length === 0 ? (
            <p>No permission data available for analysis.</p>
          ) : (
            <div className="text-sm">
              <div className="whitespace-pre-line">{analysis}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}