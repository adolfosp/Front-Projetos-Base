import { NextResponse } from "next/server";

export function middleware(req: { url: string | URL | undefined; }) {
    const isAuthenticated = true; 
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }