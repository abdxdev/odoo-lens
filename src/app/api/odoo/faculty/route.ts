import { NextRequest, NextResponse } from 'next/server';

// Define headers for API requests
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "en-US,en;q=0.9",
  "Connection": "keep-alive",
  "Referer": "https://lms.uet.edu.pk/",
  "Upgrade-Insecure-Requests": "1",
  "Content-Type": "application/json",
};

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
        "context": {"lang": "en_US", "tz": "Asia/Karachi", "uid": 75096, "params": {"action": 345}, "bin_size": true},
        "offset": 0,
        "limit": limit,
        "sort": "",
      },
      "id": generateRandomId(),
    };

    // Make the API call with cookie header
    const response = await fetch("https://lms.uet.edu.pk/web/dataset/search_read", {
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