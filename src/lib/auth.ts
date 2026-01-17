import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  traccarUserId?: number;
  traccarDeviceIds: number[];
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

function parseDeviceIds(deviceIdsStr: string): number[] {
  if (!deviceIdsStr) return [];
  return deviceIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
}

function stringifyDeviceIds(deviceIds: number[]): string {
  return deviceIds.join(',');
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  traccarUserId?: number;
  traccarDeviceIds?: number[];
  createdBy?: string;
}): Promise<AuthUser> {
  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      traccarUserId: data.traccarUserId,
      traccarDeviceIds: stringifyDeviceIds(data.traccarDeviceIds || []),
      createdBy: data.createdBy,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN' | 'CLIENT',
    traccarUserId: user.traccarUserId || undefined,
    traccarDeviceIds: parseDeviceIds(user.traccarDeviceIds),
  };
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { email, active: true },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN' | 'CLIENT',
    traccarUserId: user.traccarUserId || undefined,
    traccarDeviceIds: parseDeviceIds(user.traccarDeviceIds),
  };
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id, active: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN' | 'CLIENT',
    traccarUserId: user.traccarUserId || undefined,
    traccarDeviceIds: parseDeviceIds(user.traccarDeviceIds),
  };
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { token } });
    }
    return null;
  }

  return getUserById(session.userId);
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({ where: { token } });
}
