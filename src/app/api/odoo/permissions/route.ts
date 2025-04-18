import { NextRequest, NextResponse } from 'next/server';
import { ODOO_URL, HEADERS } from '@/lib/constants'; // Import HEADERS

// Helper function to generate a random number (similar to Python's random_number)
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

  // Get session ID from environment variable
  const sessionId = process.env.NEXT_PUBLIC_ODOO_SESSION_ID;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID not configured' }, { status: 500 });
  }

  // Use imported HEADERS and session ID from env var
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
      args: [[['group_id', '=', parseInt(groupId, 10)]]], // Ensure group_id is an integer
      kwargs: {
        fields: ['model_id', 'perm_read', 'perm_write', 'perm_create', 'perm_unlink'],
        limit: 1000, // Adjust limit as needed
      },
    },
    id: getRandomNumber(9),
  };

  try {
    const response = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Odoo API Error Status:', response.status);
      const errorText = await response.text();
      console.error('Odoo API Error Response:', errorText);
      return NextResponse.json({ error: `Odoo API request failed: ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();

    if (data.error) {
      console.error('Odoo API Returned Error:', data.error);
      return NextResponse.json({ error: 'Odoo API returned an error', details: data.error }, { status: 500 });
    }

    return NextResponse.json(data.result || []);
  } catch (error) {
    console.error('Error fetching Odoo permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions from Odoo', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
