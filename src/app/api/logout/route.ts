import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Await the cookies promise first!
  const cookieStore = await cookies();
  
  // Now you can securely delete it
  cookieStore.delete("admin_token");
  
  return NextResponse.json({ success: true });
}