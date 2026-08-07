import type { TimesheetStatus } from "@/types/timesheet";

type StatusBadgeProps = {
  status: TimesheetStatus;
};

const statusStyles: Record<TimesheetStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  incomplete: "bg-amber-100 text-amber-700",
  missing: "bg-pink-100 text-pink-700",
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium uppercase ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}