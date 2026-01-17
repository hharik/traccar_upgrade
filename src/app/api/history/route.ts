import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('deviceId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!deviceId || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: deviceId, from, to' },
        { status: 400 }
      );
    }

    console.log('[History API] Fetching history for device:', deviceId, 'from:', from, 'to:', to);

    const username = process.env.TRACCAR_API_USERNAME || 'followtrack@followtrack.com';
    const password = process.env.TRACCAR_API_PASSWORD || '';
    const baseURL = process.env.TRACCAR_API_URL || 'http://206.81.26.158:11002/api';

    // Fetch route history from Traccar
    const response = await axios.get(`${baseURL}/positions`, {
      params: {
        deviceId,
        from,
        to,
      },
      auth: {
        username,
        password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[History API] Retrieved', response.data.length, 'positions');

    return NextResponse.json(response.data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('[History API] Error fetching history:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
