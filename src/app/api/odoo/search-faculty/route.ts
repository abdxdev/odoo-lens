import { NextRequest, NextResponse } from 'next/server';
import { HEADERS } from '@/lib/constants';

const generateRandomId = (): number => {
  return Math.floor(Math.random() * 900000000) + 100000000;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    // Get the client-provided session key from the request header
    const clientSessionKey = request.headers.get('x-odoo-session-key');

    // Only use the session key from the client header, don't fall back to env variable
    if (!clientSessionKey) {
      return NextResponse.json(
        { error: 'Session ID not configured' },
        { status: 401 }
      );
    }

    const payload = {
      "jsonrpc": "2.0",
      "method": "call",
      "params": {
        "model": "obe.core.faculty",
        "fields": [
          "id",
          "name",
          "department_id",
          "campus_id",
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_ODOO_URL}/web/dataset/search_read`, {
      method: "POST",
      headers: {
        ...HEADERS,
        "Cookie": `session_id=${clientSessionKey}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      
      // Try to detect session expiration issues
      if (text.includes("session_id") || text.includes("Session expired") || text.includes("Odoo Login")) {
        return NextResponse.json(
          { error: 'Session Expired: Please update your Odoo session key' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Check for Odoo errors that might indicate session issues
    if (data.error) {
      const errorText = JSON.stringify(data.error);
      if (errorText.includes("session") || errorText.includes("login") || errorText.includes("auth")) {
        return NextResponse.json(
          { error: 'Session Expired: Please update your Odoo session key' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `Odoo error: ${JSON.stringify(data.error)}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data.result?.records || []);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}