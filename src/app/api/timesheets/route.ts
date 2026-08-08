import { NextResponse } from "next/server";

import { mockTimesheets } from "@/data/mock-timesheets";
import type { TimesheetStatus } from "@/types/timesheet";

const validStatuses: TimesheetStatus[] = [
  "completed",
  "incomplete",
  "missing",
];

function getPositiveNumber(
  value: string | null,
  fallback: number,
) {
  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return fallback;
  }

  return parsedValue;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");

  const startDate =
    searchParams.get("startDate") ?? "";

  const endDate =
    searchParams.get("endDate") ?? "";

  const page = getPositiveNumber(
    searchParams.get("page"),
    1,
  );

  const pageSize = getPositiveNumber(
    searchParams.get("pageSize"),
    5,
  );

  if (
    status &&
    !validStatuses.includes(
      status as TimesheetStatus,
    )
  ) {
    return NextResponse.json(
      {
        message: "Invalid timesheet status.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    startDate &&
    endDate &&
    startDate > endDate
  ) {
    return NextResponse.json(
      {
        message:
          "Start date cannot be after end date.",
      },
      {
        status: 400,
      },
    );
  }

  let filteredTimesheets = [
    ...mockTimesheets,
  ];

  if (status) {
    filteredTimesheets =
      filteredTimesheets.filter(
        (timesheet) =>
          timesheet.status === status,
      );
  }

  if (startDate || endDate) {
    filteredTimesheets =
      filteredTimesheets.filter(
        (timesheet) => {
          const startsBeforeRangeEnds =
            !endDate ||
            timesheet.startDate <= endDate;

          const endsAfterRangeStarts =
            !startDate ||
            timesheet.endDate >= startDate;

          return (
            startsBeforeRangeEnds &&
            endsAfterRangeStarts
          );
        },
      );
  }

  const total = filteredTimesheets.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize),
  );

  const safePage = Math.min(
    page,
    totalPages,
  );

  const startIndex =
    (safePage - 1) * pageSize;

  const data = filteredTimesheets.slice(
    startIndex,
    startIndex + pageSize,
  );

  return NextResponse.json({
    data,

    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  });
}