import { NextResponse } from "next/server";

import { mockTimesheets } from "@/data/mock-timesheets";

export async function GET() {
  return NextResponse.json({
    data: mockTimesheets,
  });
}