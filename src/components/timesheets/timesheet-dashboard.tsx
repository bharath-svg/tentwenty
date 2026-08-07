"use client";

import { useEffect, useMemo, useState } from "react";

import { TimesheetTable } from "@/components/timesheets/timesheet-table";
import type {
  Timesheet,
  TimesheetStatus,
} from "@/types/timesheet";

type TimesheetsResponse = {
  data: Timesheet[];
};

const PAGE_SIZE = 5;

export function TimesheetDashboard() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [status, setStatus] = useState<"all" | TimesheetStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTimesheets() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/timesheets", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load timesheets.");
        }

        const result: TimesheetsResponse = await response.json();

        setTimesheets(result.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError("Unable to load timesheets. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTimesheets();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredTimesheets = useMemo(() => {
    if (status === "all") {
      return timesheets;
    }

    return timesheets.filter(
      (timesheet) => timesheet.status === status,
    );
  }, [timesheets, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTimesheets.length / PAGE_SIZE),
  );

  const paginatedTimesheets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredTimesheets.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [filteredTimesheets, currentPage]);

  function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const selectedStatus = event.target.value as
      | "all"
      | TimesheetStatus;

    setStatus(selectedStatus);
    setCurrentPage(1);
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading timesheets...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600"
        >
          Date Range
        </button>

        <select
          value={status}
          onChange={handleStatusChange}
          aria-label="Filter by status"
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
        >
          <option value="all">Status</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      <div className="mt-5">
        {paginatedTimesheets.length > 0 ? (
          <TimesheetTable timesheets={paginatedTimesheets} />
        ) : (
          <div className="rounded-lg border border-gray-200 py-12 text-center">
            <p className="text-sm text-gray-500">
              No timesheets found.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500">
          {PAGE_SIZE} per page
        </span>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1,
          ).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-current={
                currentPage === page ? "page" : undefined
              }
              className={`min-w-9 rounded-md border px-3 py-2 text-sm ${
                currentPage === page
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1),
              )
            }
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}