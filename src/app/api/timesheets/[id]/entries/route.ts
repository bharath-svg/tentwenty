import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { mockWeeklyTimesheets } from "@/data/mock-weekly-timesheets";
import type { CreateTimesheetEntryInput } from "@/types/timesheet";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const timesheet = mockWeeklyTimesheets.find(
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

  let body: Partial<CreateTimesheetEntryInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        message: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    dayId,
    projectName,
    typeOfWork,
    description,
    hours,
  } = body;

  const errors: Record<string, string> = {};

  if (!dayId?.trim()) {
    errors.dayId = "Day is required.";
  }

  if (!projectName?.trim()) {
    errors.projectName = "Project is required.";
  }

  if (!typeOfWork?.trim()) {
    errors.typeOfWork = "Type of work is required.";
  }

  if (!description?.trim()) {
    errors.description = "Task description is required.";
  } else if (description.trim().length < 3) {
    errors.description =
      "Task description must be at least 3 characters.";
  }

  if (
    typeof hours !== "number" ||
    hours < 1 ||
    hours > 24
  ) {
    errors.hours =
      "Hours must be between 1 and 24.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        message: "Please correct the form errors.",
        errors,
      },
      {
        status: 400,
      },
    );
  }

  const day = timesheet.days.find(
    (item) => item.id === dayId,
  );

  if (!day) {
    return NextResponse.json(
      {
        message: "Selected day was not found.",
      },
      {
        status: 404,
      },
    );
  }

  const entry = {
    id: randomUUID(),
    title: description!.trim(),
    projectName: projectName!.trim(),
    typeOfWork: typeOfWork!.trim(),
    description: description!.trim(),
    hours: hours!,
  };

  day.entries.push(entry);

  timesheet.loggedHours += entry.hours;

  return NextResponse.json(
    {
      data: timesheet,
    },
    {
      status: 201,
    },
  );
}