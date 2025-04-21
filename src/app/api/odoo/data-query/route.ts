import { NextRequest, NextResponse } from 'next/server';
import { HEADERS } from '@/lib/constants';

const generateRandomId = (digits: number): number => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, fields, filterField, filterValue, limit = 100 } = body;

    if (!model || !fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { error: 'Model and fields are required' },
        { status: 400 }
      );
    }

    const sessionId = process.env.NEXT_PUBLIC_ODOO_SESSION_ID;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID not configured' },
        { status: 500 }
      );
    }


    let domain: any[] = [];
    if (filterField && filterValue !== undefined && filterValue !== '') {
      domain.push([filterField, '=', filterValue]);
    }


    const payload = {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: model,
        fields: fields,
        domain: domain,
        context: {
          lang: "en_US",
          tz: "Asia/Karachi",
          uid: 75096,
          params: { action: 345 },
          bin_size: true
        },
        offset: 0,
        limit: limit,
        sort: "",
      },
      id: generateRandomId(9),
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

    return NextResponse.json({
      records: data.result?.records || [],
      length: data.result?.length || 0
    });
  } catch (error) {
    console.error("Error in data query API:", error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}