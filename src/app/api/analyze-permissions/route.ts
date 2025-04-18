import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { PermissionSummary } from '@/types/permissions';

// Updated interface to match what's being sent from the component
interface PermissionAnalysisData {
  groupId: number;
  groupName: string;
  permissionCounts: PermissionSummary;
}

interface FormatOptions {
  concise?: boolean;
  avoidMarkdown?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      groupPermissionsData,
      formatOptions = {}
    } = data as {
      groupPermissionsData: PermissionAnalysisData[],
      formatOptions?: FormatOptions
    };

    if (!groupPermissionsData || !Array.isArray(groupPermissionsData) || groupPermissionsData.length === 0) {
      return NextResponse.json({ error: 'No permissions data provided' }, { status: 400 });
    }

    // Get API key from environment variable
    const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Prepare permission data for analysis - now using only summary numbers
    const permissionsText = groupPermissionsData.map(groupData => {
      const { groupName, permissionCounts } = groupData;

      return `Group: ${groupName}
Permission counts:
- Create: ${permissionCounts.create} models
- Read: ${permissionCounts.read} models
- Update: ${permissionCounts.update} models
- Delete: ${permissionCounts.delete} models`;
    }).join('\n\n');

    // Initialize Gemini API with the correct package
    const ai = new GoogleGenAI({
      apiKey: NEXT_PUBLIC_GEMINI_API_KEY
    });

    // Get the model
    const model = ai.models;

    // Add formatting instructions based on options
    const formatInstructions = [];
    if (formatOptions.concise) {
      formatInstructions.push("Be extremely concise and direct. Use short sentences and minimal words.");
    }
    if (formatOptions.avoidMarkdown) {
      formatInstructions.push("Do not use any markdown syntax in your response. Use plain text only.");
    }

    const formatInstructionsText = formatInstructions.length > 0
      ? `\n\nFormatting requirements:\n${formatInstructions.join('\n')}`
      : '';

    const prompt = `
      Analyze the following Odoo ERP user permissions summary and identify potential security risks or issues:
      
      ${permissionsText}
      
      Please provide a concise analysis of:
      1. Overall risk assessment (low, medium, or high)
      2. Potential security vulnerabilities
      3. Recommendations to improve security
      
      Focus on permission combinations and counts that might lead to data breaches, unauthorized access, or operational risks.
      For example, high number of delete permissions might indicate excessive rights.${formatInstructionsText}
    `;

    // Use the streaming approach as shown in the example
    try {
      const response = await model.generateContentStream({
        model: "gemini-2.0-flash-001",
        contents: prompt,
      });

      // Collect all the chunks of text
      let analysisText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          analysisText += chunk.text;
        }
      }

      if (!analysisText) {
        throw new Error('Empty response from Gemini API');
      }

      // Determine risk level from response
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      if (analysisText.toLowerCase().includes('high risk') ||
        analysisText.toLowerCase().includes('risk: high')) {
        riskLevel = 'high';
      } else if (analysisText.toLowerCase().includes('low risk') ||
        analysisText.toLowerCase().includes('risk: low')) {
        riskLevel = 'low';
      }

      return NextResponse.json({
        analysis: analysisText,
        riskLevel
      });
    } catch (error) {
      throw new Error('Error during streaming response processing');
    }
  } catch (error) {
    console.error('Error analyzing permissions with Gemini:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to analyze permissions'
    }, {
      status: 500
    });
  }
}