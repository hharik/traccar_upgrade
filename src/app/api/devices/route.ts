import { NextRequest, NextResponse } from 'next/server';
import { traccarService } from '@/services/traccarService';

export async function GET(request: NextRequest) {
  try {
    const devices = await traccarService.getDevices();
    
    return NextResponse.json(devices, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Error fetching devices:', error.message);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch devices',
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
