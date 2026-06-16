import { NextResponse } from "next/server";

interface ErrorResponse {
  success: false;
  message: string;
}

export function errorResponse(status: number, message: string): NextResponse<ErrorResponse> {
  return NextResponse.json({ success: false, message }, { status });
}
