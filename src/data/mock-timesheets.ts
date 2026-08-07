import type { Timesheet } from "@/types/timesheet";

export const mockTimesheets: Timesheet[] = [
  {
    id: "week-1",
    week: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    status: "completed",
    action: "view",
  },
  {
    id: "week-2",
    week: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    status: "completed",
    action: "view",
  },
  {
    id: "week-3",
    week: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    status: "incomplete",
    action: "update",
  },
  {
    id: "week-4",
    week: 4,
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    status: "completed",
    action: "view",
  },
  {
    id: "week-5",
    week: 5,
    startDate: "2024-01-28",
    endDate: "2024-02-01",
    status: "missing",
    action: "create",
  },
];