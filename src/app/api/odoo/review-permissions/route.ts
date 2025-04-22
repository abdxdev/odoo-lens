import { NextRequest, NextResponse } from 'next/server';
import { HEADERS } from '@/lib/constants';

const getRandomNumber = (digits: number): number => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('group_id');

  if (!groupId) {
    return NextResponse.json({ error: 'group_id is required' }, { status: 400 });
  }

  // Get the client-provided session key from the request header
  const clientSessionKey = request.headers.get('x-odoo-session-key');

  // First try to use the session key provided by the client, then fall back to env variable
  const sessionId = clientSessionKey || process.env.NEXT_PUBLIC_ODOO_SESSION_ID;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID not configured' }, { status: 401 });
  }

  const headers = {
    ...HEADERS,
    'Cookie': `session_id=${sessionId}`,
  };

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      model: 'ir.model.access',
      method: 'search_read',
      args: [[['group_id', '=', parseInt(groupId, 10)]]],
      kwargs: {
        fields: ['model_id', 'perm_read', 'perm_write', 'perm_create', 'perm_unlink'],
        limit: 1000,
      },
    },
    id: getRandomNumber(9),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ODOO_URL}/web/dataset/call_kw`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Odoo API Error Status:', response.status);
      const errorText = await response.text();
      console.error('Odoo API Error Response:', errorText);
      
      // Try to detect session expiration issues
      if (errorText.includes("session_id") || errorText.includes("Session expired") || errorText.includes("Odoo Login")) {
        return NextResponse.json(
          { error: 'Session Expired: Please update your Odoo session key' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({ error: `Odoo API request failed: ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();

    if (data.error) {
      console.error('Odoo API Returned Error:', data.error);
      
      // Check for session-related errors in the response
      const errorText = JSON.stringify(data.error);
      if (errorText.includes("session") || errorText.includes("login") || errorText.includes("auth")) {
        return NextResponse.json(
          { error: 'Session Expired: Please update your Odoo session key' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({ error: 'Odoo API returned an error', details: data.error }, { status: 500 });
    }

    return NextResponse.json(data.result || []);
  } catch (error) {
    console.error('Error fetching Odoo permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions from Odoo', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
