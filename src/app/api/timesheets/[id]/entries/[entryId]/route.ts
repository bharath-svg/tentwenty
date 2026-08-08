import { NextResponse } from "next/server";

import { mockWeeklyTimesheets } from "@/data/mock-weekly-timesheets";
import type { UpdateTimesheetEntryInput } from "@/types/timesheet";

type RouteParams = {
  params: Promise<{
    id: string;
    entryId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteParams,
) {
  const { id, entryId } = await params;

  const timesheet = mockWeeklyTimesheets.find(
    (item) => item.id === id,
  );

  if (!timesheet) {
    return NextResponse.json(
      { message: "Timesheet not found." },
      { status: 404 },
    );
  }

  let body: Partial<UpdateTimesheetEntryInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const {
    projectName,
    typeOfWork,
    description,
    hours,
  } = body;

  const errors: Record<string, string> = {};

  if (!projectName?.trim()) {
    errors.projectName = "Project is required.";
  }

  if (!typeOfWork?.trim()) {
    errors.typeOfWork = "Type of work is required.";
  }

  if (!description?.trim()) {
    errors.description =
      "Task description is required.";
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
      { status: 400 },
    );
  }

  let entryFound = null;

  for (const day of timesheet.days) {
    const entry = day.entries.find(
      (item) => item.id === entryId,
    );

    if (entry) {
      entryFound = entry;
      break;
    }
  }

  if (!entryFound) {
    return NextResponse.json(
      { message: "Timesheet entry not found." },
      { status: 404 },
    );
  }

  const previousHours = entryFound.hours;

  entryFound.projectName = projectName!.trim();
  entryFound.typeOfWork = typeOfWork!.trim();
  entryFound.description = description!.trim();
  entryFound.title = description!.trim();
  entryFound.hours = hours!;

  timesheet.loggedHours =
    timesheet.loggedHours -
    previousHours +
    entryFound.hours;

  return NextResponse.json({
    data: timesheet,
  });
}

export async function DELETE(
  _request: Request,
  { params }: RouteParams,
) {
  const { id, entryId } = await params;

  const timesheet = mockWeeklyTimesheets.find(
    (item) => item.id === id,
  );

  if (!timesheet) {
    return NextResponse.json(
      { message: "Timesheet not found." },
      { status: 404 },
    );
  }

  for (const day of timesheet.days) {
    const entryIndex = day.entries.findIndex(
      (item) => item.id === entryId,
    );

    if (entryIndex === -1) {
      continue;
    }

    const [deletedEntry] = day.entries.splice(
      entryIndex,
      1,
    );

    timesheet.loggedHours = Math.max(
      0,
      timesheet.loggedHours -
        deletedEntry.hours,
    );

    return NextResponse.json({
      data: timesheet,
    });
  }

  return NextResponse.json(
    { message: "Timesheet entry not found." },
    { status: 404 },
  );
}