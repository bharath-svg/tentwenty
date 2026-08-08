"use client";

import {
  useEffect,
  useState,
} from "react";

import { TimesheetTable } from "@/components/timesheets/timesheet-table";
import type {
  Timesheet,
  TimesheetStatus,
} from "@/types/timesheet";

type TimesheetsResponse = {
  data: Timesheet[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

const initialPagination = {
  page: 1,
  pageSize: 5,
  total: 0,
  totalPages: 1,
};

export function TimesheetDashboard() {
  const [timesheets, setTimesheets] =
    useState<Timesheet[]>([]);

  const [status, setStatus] =
    useState<"all" | TimesheetStatus>(
      "all",
    );

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [
    appliedStartDate,
    setAppliedStartDate,
  ] = useState("");

  const [
    appliedEndDate,
    setAppliedEndDate,
  ] = useState("");

  const [
    isDateFilterOpen,
    setIsDateFilterOpen,
  ] = useState(false);

  const [dateError, setDateError] =
    useState<string | null>(null);

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [pagination, setPagination] =
    useState(initialPagination);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadTimesheets() {
      try {
        setIsLoading(true);
        setError(null);

        const searchParams =
          new URLSearchParams();

        if (status !== "all") {
          searchParams.set(
            "status",
            status,
          );
        }

        if (appliedStartDate) {
          searchParams.set(
            "startDate",
            appliedStartDate,
          );
        }

        if (appliedEndDate) {
          searchParams.set(
            "endDate",
            appliedEndDate,
          );
        }

        searchParams.set(
          "page",
          String(page),
        );

        searchParams.set(
          "pageSize",
          String(pageSize),
        );

        const response = await fetch(
          `/api/timesheets?${searchParams.toString()}`,
          {
            signal: controller.signal,
          },
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ??
              "Unable to load timesheets.",
          );
        }

        const data =
          result as TimesheetsResponse;

        setTimesheets(data.data);
        setPagination(data.pagination);

        if (
          data.pagination.page !== page
        ) {
          setPage(
            data.pagination.page,
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load timesheets.",
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setIsLoading(false);
        }
      }
    }

    loadTimesheets();

    return () => {
      controller.abort();
    };
  }, [
    status,
    appliedStartDate,
    appliedEndDate,
    page,
    pageSize,
  ]);

  function applyDateRange() {
    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      setDateError(
        "Start date cannot be after end date.",
      );

      return;
    }

    setDateError(null);

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);

    setPage(1);
    setIsDateFilterOpen(false);
  }

  function clearDateRange() {
    setStartDate("");
    setEndDate("");

    setAppliedStartDate("");
    setAppliedEndDate("");

    setDateError(null);
    setPage(1);
    setIsDateFilterOpen(false);
  }

  const hasDateFilter =
    Boolean(
      appliedStartDate ||
        appliedEndDate,
    );

  return (
    <>
      <div className="mt-5 flex flex-wrap items-start gap-3">
        <div className="relative">
          <button
            type="button"
            aria-expanded={
              isDateFilterOpen
            }
            onClick={() =>
              setIsDateFilterOpen(
                (current) => !current,
              )
            }
            className={`flex h-10 items-center gap-2 rounded-lg border bg-white px-3 text-sm outline-none transition ${
              hasDateFilter
                ? "border-blue-500 text-blue-600"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            Date Range

            {hasDateFilter && (
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-blue-500"
              />
            )}
          </button>

          {isDateFilterOpen && (
            <div className="absolute left-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="mb-1.5 block text-xs font-medium text-gray-700"
                  >
                    Start date
                  </label>

                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => {
                      setStartDate(
                        event.target.value,
                      );

                      setDateError(null);
                    }}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="mb-1.5 block text-xs font-medium text-gray-700"
                  >
                    End date
                  </label>

                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) => {
                      setEndDate(
                        event.target.value,
                      );

                      setDateError(null);
                    }}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {dateError && (
                  <p
                    role="alert"
                    className="text-xs text-red-600"
                  >
                    {dateError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={applyDateRange}
                    className="h-9 flex-1 rounded-lg bg-[#1C64F2] px-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Apply
                  </button>

                  <button
                    type="button"
                    onClick={clearDateRange}
                    className="h-9 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <select
          value={status}
          aria-label="Filter by status"
          onChange={(event) => {
            setStatus(
              event.target.value as
                | "all"
                | TimesheetStatus,
            );

            setPage(1);
          }}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">
            Status
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="incomplete">
            Incomplete
          </option>

          <option value="missing">
            Missing
          </option>
        </select>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="rounded-lg border border-gray-200 py-12 text-center">
            <p className="text-sm text-gray-500">
              Loading timesheets...
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        ) : timesheets.length ===
          0 ? (
          <div className="rounded-lg border border-gray-200 py-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No timesheets found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Try changing your filters.
            </p>
          </div>
        ) : (
          <TimesheetTable
            timesheets={timesheets}
          />
        )}
      </div>

      {!isLoading && !error && (
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              aria-label="Rows per page"
              onChange={(event) => {
                setPageSize(
                  Number(
                    event.target.value,
                  ),
                );

                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
            >
              <option value={5}>
                5 per page
              </option>

              <option value={10}>
                10 per page
              </option>

              <option value={20}>
                20 per page
              </option>
            </select>

            <span className="hidden text-xs text-gray-500 sm:inline">
              {pagination.total} total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              disabled={
                pagination.page <= 1
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1,
                )
              }
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              {
                length:
                  pagination.totalPages,
              },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                aria-current={
                  pagination.page ===
                  pageNumber
                    ? "page"
                    : undefined
                }
                onClick={() =>
                  setPage(pageNumber)
                }
                className={`min-w-9 rounded-md border px-3 py-2 text-sm transition ${
                  pagination.page ===
                  pageNumber
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={
                pagination.page >=
                pagination.totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1,
                )
              }
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}