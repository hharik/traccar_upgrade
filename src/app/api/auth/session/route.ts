import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await validateSession(token);

    if (!user) {
      const response = NextResponse.json({ user: null });
      response.cookies.delete('session');
      return response;
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('[Session Error]:', error);
    return NextResponse.json({ user: null });
  }
}
