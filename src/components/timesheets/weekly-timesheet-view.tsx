"use client";

import { useEffect, useState } from "react";

import { TimesheetDay } from "@/components/timesheets/timesheet-day";
import { TimesheetEntryModal } from "@/components/timesheets/timesheet-entry-modal";
import type {
  TimesheetEntry,
  WeeklyTimesheet,
} from "@/types/timesheet";

type WeeklyTimesheetViewProps = {
  timesheetId: string;
};

type WeeklyTimesheetResponse = {
  data: WeeklyTimesheet;
};

function formatWeekRange(
  startDate: string,
  endDate: string,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();

  const formatter = new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return `${startDay} - ${formatter.format(end)}`;
}

export function WeeklyTimesheetView({
  timesheetId,
}: WeeklyTimesheetViewProps) {
  const [timesheet, setTimesheet] =
    useState<WeeklyTimesheet | null>(null);

  const [selectedDayId, setSelectedDayId] =
    useState<string | null>(null);


  const [editingEntry, setEditingEntry] =
    useState<TimesheetEntry | null>(null);

  const [deletingEntryId, setDeletingEntryId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTimesheet() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/timesheets/${timesheetId}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Timesheet could not be loaded.",
          );
        }

        const result: WeeklyTimesheetResponse =
          await response.json();

        setTimesheet(result.data);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError(
          "Unable to load this timesheet. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTimesheet();

    return () => {
      controller.abort();
    };
  }, [timesheetId]);



  function handleAddEntry(dayId: string) {
    setEditingEntry(null);
    setSelectedDayId(dayId);
  }

  function handleEditEntry(
    dayId: string,
    entry: TimesheetEntry,
  ) {
    setSelectedDayId(dayId);
    setEditingEntry(entry);
  }

  function handleCloseModal() {
    setSelectedDayId(null);
    setEditingEntry(null);
  }



  function handleSaved(
    updatedTimesheet: WeeklyTimesheet,
  ) {
    setTimesheet(updatedTimesheet);
    handleCloseModal();
  }


  async function handleDeleteEntry(
    entryId: string,
  ) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this entry?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingEntryId(entryId);
      setError(null);

      const response = await fetch(
        `/api/timesheets/${timesheetId}/entries/${entryId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
          "Unable to delete entry.",
        );
      }

      setTimesheet(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete entry.",
      );
    } finally {
      setDeletingEntryId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading timesheet...
      </div>
    );
  }

  if (error || !timesheet) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {error ?? "Timesheet not found."}
      </div>
    );
  }

  const percentage =
    timesheet.targetHours > 0
      ? Math.min(
        100,
        Math.round(
          (timesheet.loggedHours /
            timesheet.targetHours) *
          100,
        ),
      )
      : 0;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            This week&apos;s timesheet
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            {formatWeekRange(
              timesheet.startDate,
              timesheet.endDate,
            )}
          </p>
        </div>

        <div className="w-full sm:w-36">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium text-gray-800">
              {timesheet.loggedHours}/
              {timesheet.targetHours} hrs
            </span>

            <span>{percentage}%</span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-orange-400 transition-[width]"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {timesheet.days.map((day) => (
          <TimesheetDay
            key={day.id}
            day={day}
            onAddEntry={handleAddEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            deletingEntryId={deletingEntryId}
          />
        ))}
      </div>

      <TimesheetEntryModal
        isOpen={selectedDayId !== null}
        timesheetId={timesheetId}
        dayId={selectedDayId}
        entry={editingEntry}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />
    </>
  );
}