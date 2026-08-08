"use client";

import { useState } from "react";

import type { TimesheetEntry } from "@/types/timesheet";

type TimesheetEntryRowProps = {
  entry: TimesheetEntry;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entryId: string) => void;
  isDeleting?: boolean;
};

export function TimesheetEntryRow({
  entry,
  onEdit,
  onDelete,
  isDeleting = false,
}: TimesheetEntryRowProps) {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  return (
    <div className="relative flex min-h-11 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3">
      <p className="min-w-0 flex-1 truncate text-sm text-gray-900">
        {entry.title}
      </p>

      <span className="shrink-0 text-xs text-gray-400">
        {entry.hours} hrs
      </span>

      <span className="hidden shrink-0 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 sm:inline-flex">
        {entry.projectName}
      </span>

      <button
        type="button"
        aria-label={`Actions for ${entry.title}`}
        aria-expanded={isMenuOpen}
        onClick={() =>
          setIsMenuOpen((current) => !current)
        }
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      >
        ⋯
      </button>

      {isMenuOpen && (
        <div className="absolute right-2 top-10 z-20 min-w-24 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onEdit(entry);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              setIsMenuOpen(false);
              onDelete(entry.id);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}