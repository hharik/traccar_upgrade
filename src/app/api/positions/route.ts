import { NextRequest, NextResponse } from 'next/server';
import { traccarService } from '@/services/traccarService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('deviceId');

    const positions = deviceId 
      ? await traccarService.getPositions(parseInt(deviceId))
      : await traccarService.getPositions();

    return NextResponse.json(positions, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Error fetching positions:', error.message);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch positions',
        details: error.response?.data || null
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
