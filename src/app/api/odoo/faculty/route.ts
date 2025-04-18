import { NextRequest, NextResponse } from 'next/server';
import { HEADERS, ODOO_URL } from '@/lib/constants'; // Import HEADERS and ODOO_URL

// Helper function to generate random numbers for request IDs that works in both Node.js and browser contexts
const generateRandomId = (): number => {
  return Math.floor(Math.random() * 900000000) + 100000000;
};

export async function GET(request: NextRequest) {
  try {
    // Get the query parameter from the URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get session ID from environment variable
    const sessionId = process.env.NEXT_PUBLIC_ODOO_SESSION_ID;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID not configured' },
        { status: 500 }
      );
    }

    // Create the payload for the request
    const payload = {
      "jsonrpc": "2.0",
      "method": "call",
      "params": {
        "model": "obe.core.faculty",
        "fields": [
          "id",
          "name",
          "department_id",
          "joining_date",
          "identification_id",
          "login",
          "official_email",
          "contact_number1",
          "res_group_id",
        ],
        "domain": [["name", "ilike", query]],
        "context": { "lang": "en_US", "tz": "Asia/Karachi", "uid": 75096, "params": { "action": 345 }, "bin_size": true },
        "offset": 0,
        "limit": limit,
        "sort": "",
      },
      "id": generateRandomId(),
    };

    // Make the API call with cookie header using imported HEADERS
    const response = await fetch(`${ODOO_URL}/web/dataset/search_read`, { // Use ODOO_URL
      method: "POST",
      headers: {
        ...HEADERS, // Use imported HEADERS
        "Cookie": `session_id=${sessionId}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the faculty records
    return NextResponse.json(data.result?.records || []);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}