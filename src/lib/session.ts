import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

export function createSession(user: SessionUser) {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    sameSite: 'lax',
  });
}

export function getSession(): SessionUser | null {
  try {
    const token = cookies().get('auth-token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      image: decoded.image,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export function clearSession() {
  cookies().set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
}
