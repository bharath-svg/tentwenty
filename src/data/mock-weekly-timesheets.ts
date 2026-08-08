import type {
  TimesheetDay,
  TimesheetEntry,
  WeeklyTimesheet,
} from "@/types/timesheet";

function createEntry(
  id: string,
  title = "Homepage Development",
): TimesheetEntry {
  return {
    id,
    title,
    hours: 4,
    projectName: "Project Name",
    typeOfWork: "Development",
    description: "Homepage development work",
  };
}

function createDay(
  date: string,
  label: string,
  entryCount: number,
): TimesheetDay {
  return {
    id: date,
    date,
    label,
    entries: Array.from(
      { length: entryCount },
      (_, index) =>
        createEntry(`${date}-entry-${index + 1}`),
    ),
  };
}

export const mockWeeklyTimesheets: WeeklyTimesheet[] = [
  {
    id: "week-1",
    week: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    loggedHours: 40,
    targetHours: 40,
    days: [
      createDay("2024-01-01", "Jan 1", 2),
      createDay("2024-01-02", "Jan 2", 2),
      createDay("2024-01-03", "Jan 3", 2),
      createDay("2024-01-04", "Jan 4", 2),
      createDay("2024-01-05", "Jan 5", 2),
    ],
  },
  {
    id: "week-2",
    week: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    loggedHours: 40,
    targetHours: 40,
    days: [
      createDay("2024-01-08", "Jan 8", 2),
      createDay("2024-01-09", "Jan 9", 2),
      createDay("2024-01-10", "Jan 10", 2),
      createDay("2024-01-11", "Jan 11", 2),
      createDay("2024-01-12", "Jan 12", 2),
    ],
  },
  {
    id: "week-3",
    week: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    loggedHours: 28,
    targetHours: 40,
    days: [
      createDay("2024-01-15", "Jan 15", 2),
      createDay("2024-01-16", "Jan 16", 2),
      createDay("2024-01-17", "Jan 17", 1),
      createDay("2024-01-18", "Jan 18", 1),
      createDay("2024-01-19", "Jan 19", 1),
    ],
  },
  {
    id: "week-4",
    week: 4,
    startDate: "2024-01-21",
    endDate: "2024-01-26",
    loggedHours: 20,
    targetHours: 40,
    days: [
      createDay("2024-01-21", "Jan 21", 2),
      createDay("2024-01-22", "Jan 22", 3),
      createDay("2024-01-23", "Jan 23", 3),
      createDay("2024-01-24", "Jan 24", 3),
      createDay("2024-01-25", "Jan 25", 0),
    ],
  },
  {
    id: "week-5",
    week: 5,
    startDate: "2024-01-28",
    endDate: "2024-02-01",
    loggedHours: 0,
    targetHours: 40,
    days: [
      createDay("2024-01-28", "Jan 28", 0),
      createDay("2024-01-29", "Jan 29", 0),
      createDay("2024-01-30", "Jan 30", 0),
      createDay("2024-01-31", "Jan 31", 0),
      createDay("2024-02-01", "Feb 1", 0),
    ],
  },
];