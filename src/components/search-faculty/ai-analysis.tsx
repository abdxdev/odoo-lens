'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionAnalysisData } from '@/types/permissions';

interface PermissionsAIAnalysisProps {
  groupPermissionsData: PermissionAnalysisData[];
  isLoading: boolean;
}

// Risk level type
type RiskLevel = 'low' | 'medium' | 'high' | null;

// Risk badge style mapping
const RISK_BADGE_CLASSES: Record<string, string> = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning', 
  high: 'bg-destructive/10 text-destructive'
};

export function PermissionsAIAnalysis({
  groupPermissionsData,
  isLoading
}: PermissionsAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);
  const [highRiskGroups, setHighRiskGroups] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePermissions = useCallback(async () => {
    if (groupPermissionsData.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupPermissionsData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze permissions');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setRiskLevel(data.riskLevel);
      setHighRiskGroups(data.highRiskGroups || []);
    } catch (err) {
      console.error('Error analyzing permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze permissions');
    } finally {
      setIsAnalyzing(false);
    }
  }, [groupPermissionsData]);

  useEffect(() => {
    if (!isLoading && groupPermissionsData.length > 0) {
      analyzePermissions();
    }
  }, [isLoading, groupPermissionsData, analyzePermissions]);

  const getRiskBadge = () => {
    if (!riskLevel) return null;

    const badgeClass = RISK_BADGE_CLASSES[riskLevel] || '';

    return (
      <div className="flex flex-col items-end">
        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${badgeClass}`}>
          {riskLevel} risk
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <CardTitle>AI Analysis</CardTitle>
          {getRiskBadge()}
        </div>
        <CardDescription>
          Analyze the permissions and identify potential risks.
        </CardDescription>
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
          <div className="text-destructive">
            <p>Error: {error}</p>
            <p className="text-sm mt-2">Please check your Gemini API configuration.</p>
          </div>
        ) : groupPermissionsData.length === 0 ? (
          <p>No permission data available for analysis.</p>
        ) : (
          <div className="text-sm">
            {highRiskGroups.length > 0 && (
              <div className="mb-4 p-3 rounded bg-destructive/10 text-destructive">
                <p className="font-medium mb-1">High Risk Groups:</p>
                <ul className="list-disc list-inside">
                  {highRiskGroups.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="whitespace-pre-line">{analysis}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}