import { NextResponse, type NextRequest } from "next/server";

export function loggedJson(
  request: NextRequest,
  body: unknown,
  status: number
) {
  console.log(
    `[api] ${request.method} ${request.nextUrl.pathname} -> ${status}`
  );
  return NextResponse.json(body, { status });
}
