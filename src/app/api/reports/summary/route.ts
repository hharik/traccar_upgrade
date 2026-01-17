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

    console.log('[Summary API] Requesting summary for device:', deviceId, 'from:', from, 'to:', to);

    const username = process.env.TRACCAR_API_USERNAME || 'followtrack@followtrack.com';
    const password = process.env.TRACCAR_API_PASSWORD || 'Hharik@123';
    const baseURL = process.env.TRACCAR_API_URL || 'http://206.81.26.158:11002/api';

    // Fetch summary report from Traccar
    const response = await axios.get(`${baseURL}/reports/summary`, {
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

    console.log('[Summary API] Retrieved summary data:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('[Summary API Error]:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch summary report',
        details: error.response?.data || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}
