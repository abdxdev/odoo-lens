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


    const sessionId = process.env.NEXT_PUBLIC_ODOO_SESSION_ID;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID not configured' },
        { status: 500 }
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


    return NextResponse.json(data.result?.records || []);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}