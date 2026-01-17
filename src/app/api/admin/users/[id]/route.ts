import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await validateSession(token);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, active, traccarDeviceIds } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(typeof active === 'boolean' && { active }),
        ...(traccarDeviceIds && { traccarDeviceIds }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        traccarDeviceIds: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error('[Update User Error]:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await validateSession(token);
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Don't allow deleting yourself
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Delete User Error]:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
