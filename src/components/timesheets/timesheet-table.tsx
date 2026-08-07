import { StatusBadge } from "@/components/timesheets/status-badge";
import type { Timesheet } from "@/types/timesheet";

type TimesheetTableProps = {
  timesheets: Timesheet[];
};

function formatDateRange(
  startDate: string,
  endDate: string,
) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(
    new Date(endDate),
  )}`;
}

export function TimesheetTable({
  timesheets,
}: TimesheetTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr className="text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-4 font-medium">
                Week #
              </th>

              <th className="px-4 py-4 font-medium">
                Date
              </th>

              <th className="px-4 py-4 font-medium">
                Status
              </th>

              <th className="px-4 py-4 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {timesheets.map((timesheet) => (
              <tr key={timesheet.id}>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {timesheet.week}
                </td>

                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatDateRange(
                    timesheet.startDate,
                    timesheet.endDate,
                  )}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={timesheet.status} />
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    className="text-sm font-medium capitalize text-blue-600 hover:text-blue-700"
                  >
                    {timesheet.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}