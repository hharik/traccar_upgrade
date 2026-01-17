import { NextRequest, NextResponse } from 'next/server';
import { traccarService } from '@/services/traccarService';

export async function GET(request: NextRequest) {
  try {
    const devices = await traccarService.getDevices();
    const positions = await traccarService.getPositions();
    
    // Get first device with position data for debugging
    const firstDevice = devices[0];
    const firstDevicePosition = positions.find(p => p.deviceId === firstDevice?.id);
    const firstDevicePositionById = positions.find(p => p.id === firstDevice?.positionId);
    
    return NextResponse.json({
      deviceCount: devices.length,
      positionCount: positions.length,
      sampleDevice: firstDevice,
      positionByDeviceId: firstDevicePosition,
      positionByPositionId: firstDevicePositionById,
      allPositionDeviceIds: positions.map(p => p.deviceId).slice(0, 10),
      allDeviceIds: devices.map(d => d.id).slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
