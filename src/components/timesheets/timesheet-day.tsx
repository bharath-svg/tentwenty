import { TimesheetEntryRow } from "@/components/timesheets/timesheet-entry-row";
import type {
  TimesheetDay as TimesheetDayType,
  TimesheetEntry,
} from "@/types/timesheet";

type TimesheetDayProps = {
  day: TimesheetDayType;

  onAddEntry: (
    dayId: string,
  ) => void;

  onEditEntry: (
    dayId: string,
    entry: TimesheetEntry,
  ) => void;

  onDeleteEntry: (
    entryId: string,
  ) => void;

  deletingEntryId: string | null;
};

export function TimesheetDay({
  day,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  deletingEntryId,
}: TimesheetDayProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[72px_1fr]">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          {day.label}
        </h2>
      </div>

      <div className="space-y-2">
        {day.entries.map((entry) => (
          <TimesheetEntryRow
            key={entry.id}
            entry={entry}
            onEdit={(selectedEntry) =>
              onEditEntry(
                day.id,
                selectedEntry,
              )
            }
            onDelete={onDeleteEntry}
            isDeleting={
              deletingEntryId === entry.id
            }
          />
        ))}

        <button
          type="button"
          onClick={() =>
            onAddEntry(day.id)
          }
          className="flex min-h-11 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
        >
          <span className="mr-2 text-lg">
            +
          </span>

          Add new task
        </button>
      </div>
    </div>
  );
}