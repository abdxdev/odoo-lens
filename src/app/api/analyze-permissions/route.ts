import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { PermissionSummary } from '@/types/permissions';

interface PermissionAnalysisData {
  groupId: number;
  groupName: string;
  permissionCounts: PermissionSummary;
}

const RISK_FACTORS = {
  DELETE_PERMISSION_WEIGHT: 3,
  UPDATE_PERMISSION_WEIGHT: 2,
  CREATE_PERMISSION_WEIGHT: 1,
  READ_PERMISSION_WEIGHT: 0.5,
  RISK_THRESHOLDS: {
    HIGH: 50,
    MEDIUM: 25
  }
};

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { groupPermissionsData } = data as { groupPermissionsData: PermissionAnalysisData[] };

  if (!groupPermissionsData?.length) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }

  const riskScoreResult = calculateRiskScore(groupPermissionsData);
  const { riskScore, riskLevel, highRiskGroups } = riskScoreResult;
  
  const permissionsText = groupPermissionsData.map((groupData: PermissionAnalysisData) => {
    const { groupName, permissionCounts } = groupData;
    return `Group: ${groupName}
Permission counts (each number represents database tables this group can access):
- Create: ${permissionCounts.create} database tables
- Read: ${permissionCounts.read} database tables
- Update: ${permissionCounts.update} database tables
- Delete: ${permissionCounts.delete} database tables`;
  }).join('\n\n');

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.models;

  const prompt = `
    Analyze the following Odoo ERP user permissions summary and identify potential security risks or issues:
    
    ${permissionsText}
    
    IMPORTANT: Each number represents database tables that the user group can access. For example, "Delete: 10" means
    the group can delete records in 10 different database tables. Higher numbers mean broader database access.
    
    According to our algorithmic risk assessment, this configuration has a risk score of ${riskScore.toFixed(1)} 
    out of 100 (${riskLevel.toUpperCase()} RISK).
    ${highRiskGroups.length > 0 ? `High risk groups identified: ${highRiskGroups.join(', ')}` : ''}
    
    Please provide a concise analysis of:
    1. Overall risk assessment (confirm or adjust our ${riskLevel} risk assessment with justification)
    2. Potential security vulnerabilities based solely on the number of database tables each group can access
    3. Recommendations to improve security
    
    Focus on permission combinations and counts that might lead to data breaches or unauthorized access.
    For example, high number of delete permissions might indicate excessive rights to delete data from many tables.
    
    Be extremely concise and direct. Use short sentences and minimal words.
    Do not use any markdown syntax in your response. Use plain text only.
  `;

  const response = await model.generateContentStream({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  let analysisText = '';
  for await (const chunk of response) {
    if (chunk.text) {
      analysisText += chunk.text;
    }
  }

  let finalRiskLevel = riskLevel;
  if (analysisText.toLowerCase().includes('high risk') && riskLevel !== 'high') {
    finalRiskLevel = 'high';
  } else if (analysisText.toLowerCase().includes('low risk') && riskLevel !== 'low') {
    finalRiskLevel = 'low';
  }

  return NextResponse.json({
    analysis: analysisText || 'No analysis available',
    riskLevel: finalRiskLevel,
    riskScore,
    highRiskGroups
  });
}

function calculateRiskScore(groupPermissionsData: PermissionAnalysisData[]): { 
  riskScore: number; 
  riskLevel: 'low' | 'medium' | 'high'; 
  highRiskGroups: string[] 
} {
  let totalRiskScore = 0;
  const highRiskGroups: string[] = [];
  
  groupPermissionsData.forEach((group: PermissionAnalysisData) => {
    const { groupName, permissionCounts } = group;
    
    const groupRiskScore = 
      (permissionCounts.delete || 0) * RISK_FACTORS.DELETE_PERMISSION_WEIGHT +
      (permissionCounts.update || 0) * RISK_FACTORS.UPDATE_PERMISSION_WEIGHT +
      (permissionCounts.create || 0) * RISK_FACTORS.CREATE_PERMISSION_WEIGHT +
      (permissionCounts.read || 0) * RISK_FACTORS.READ_PERMISSION_WEIGHT;
    
    if (groupRiskScore > RISK_FACTORS.RISK_THRESHOLDS.HIGH) {
      highRiskGroups.push(groupName);
    }
    
    totalRiskScore += groupRiskScore;
  });
  
  const normalizedScore = Math.min(
    100, 
    (totalRiskScore / (groupPermissionsData.length || 1)) * 
    (1 + (highRiskGroups.length * 0.2))
  );
  
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (normalizedScore >= RISK_FACTORS.RISK_THRESHOLDS.HIGH) {
    riskLevel = 'high';
  } else if (normalizedScore < RISK_FACTORS.RISK_THRESHOLDS.MEDIUM) {
    riskLevel = 'low';
  }
  
  return {
    riskScore: normalizedScore,
    riskLevel,
    highRiskGroups
  };
}