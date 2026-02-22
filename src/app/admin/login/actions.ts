"use server";

import { cookies } from 'next/headers';

export async function verifyPassword(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    // Notice the (await cookies()) right here:
    (await cookies()).set('admin_token', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/' 
    });
    return true;
  }
  return false;
}