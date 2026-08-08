import { NextResponse } from "next/server";

import { mockWeeklyTimesheets } from "@/data/mock-weekly-timesheets";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const timesheet =
    mockWeeklyTimesheets.find(
      (item) => item.id === id,
    );

  if (!timesheet) {
    return NextResponse.json(
      {
        message: "Timesheet not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    data: timesheet,
  });
}